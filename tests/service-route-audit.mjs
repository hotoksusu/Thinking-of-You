// Browser evidence for every page entry point. Run against a local QA server only.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {sourceFiles, auditSources} from '../scripts/audit-interactions.mjs';
const {chromium} = createRequire(import.meta.url)('playwright');
const origin = process.env.TEST_BASE_URL || 'http://localhost:3100';
const replacements = {'[step]': '1', '[state]': 'completed', '[hospitalId]': 'hospital_001', '[pilotId]': 'pilot_hospital_001', '[issueId]': 'issue_demo_001'};
const routes = sourceFiles('app').filter(f => /[\\/]page\.tsx$/.test(f)).map(file => {
  let route = file.replaceAll('\\', '/').replace(/^app/, '').replace(/\/page\.tsx$/, '') || '/';
  for (const [key, value] of Object.entries(replacements)) route = route.replace(key, value);
  route = route.replace('[id]', route.includes('/care/hospital/') ? 'kim' : 'parent_001');
  return {file, route};
});
if (process.env.QA_ROUTES) routes.splice(0, routes.length, ...process.env.QA_ROUTES.split(',').map(route => ({file: '', route})));
const browser = await chromium.launch({headless: true, channel: process.env.TEST_BROWSER_CHANNEL || undefined});
const results = [], sourceFindings = auditSources();
let next = 0;
async function worker() {
  while (next < routes.length) {
    const {file, route} = routes[next++];
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
    await context.addInitScript(() => {
      localStorage.setItem('oneul-anbu:demo:hospital-session', JSON.stringify({kind: 'hospital', sessionId: 'qa', userId: 'hu_a_nurse', hospitalId: 'hospital_001', role: 'nurse', expiresAt: '2999-01-01'}));
      localStorage.setItem('oneul-anbu:demo:patient-session', JSON.stringify({kind: 'patient', sessionId: 'qa', patientId: 'patient_001', hospitalId: 'hospital_001', expiresAt: '2999-01-01'}));
      localStorage.setItem('oneul-anbu:demo:operator-session', JSON.stringify({kind: 'operator', sessionId: 'qa', userId: 'op_001', role: 'super_admin', mfaVerified: true, expiresAt: '2999-01-01'}));
      window.print = () => {document.body.dataset.qaPrint = String(Date.now());};
      window.open = url => {document.body.dataset.qaOpen = String(url); return null;};
    });
    const page = await context.newPage(); page.setDefaultTimeout(5000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', async d => {errors.push(`dialog: ${d.message()}`); await d.dismiss();});
    const row = {route, file, http: 0, controls: [], errors};
    try {
      const response = await page.goto(origin + route, {waitUntil: 'networkidle', timeout: 60000}); row.http = response?.status() || 0;
      await page.waitForTimeout(150);
      row.title = await page.locator('h1').first().textContent().catch(() => '');
      const controls = await page.locator('button, a, select, summary, input:not([type=hidden]), textarea').evaluateAll(elements => elements.filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').map((e, i) => {
        e.setAttribute('data-qa-control', String(i));
        return {id: String(i), tag: e.tagName.toLowerCase(), name: (e.getAttribute('aria-label') || e.textContent || e.getAttribute('placeholder') || e.getAttribute('type') || '').trim().slice(0, 120), href: e.getAttribute('href'), type: e.getAttribute('type'), disabled: e.matches(':disabled') || e.getAttribute('aria-disabled') === 'true'};
      }));
      // Link targets are recorded here. Full navigations are covered by the route visits and flow tests.
      for (const control of controls) {
        if (control.disabled) {row.controls.push({...control, result: 'DISABLED(INTENTIONAL)'}); continue;}
        if (control.tag === 'a') {row.controls.push({...control, result: control.href ? 'DESTINATION' : 'NO_DESTINATION'}); continue;}
        const locator = page.locator(`[data-qa-control="${control.id}"]`);
        // Reset after earlier controls change the page; reassign the same visible inventory indices.
        if (!await locator.count() || new URL(page.url()).pathname !== new URL(origin + route).pathname) {
          await page.goto(origin + route, {waitUntil: 'networkidle'});
          await page.locator('button, a, select, summary, input:not([type=hidden]), textarea').evaluateAll(es => es.filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').forEach((e, i) => e.setAttribute('data-qa-control', String(i))));
        }
        if (!await locator.count()) {row.controls.push({...control, result: 'STATE_CHANGED'}); continue;}
        try {
          const snapshot = async () => JSON.stringify(await page.evaluate(() => ({url: location.href, html: document.querySelector('main')?.innerHTML || document.body.innerHTML, storage: {...localStorage}, print: document.body.dataset.qaPrint, open: document.body.dataset.qaOpen})));
          const before = await snapshot();
          if (control.tag === 'select') {
            const options = await locator.locator('option:not(:disabled)').evaluateAll(es => es.map(e => e.value));
            const value = await locator.inputValue(); const other = options.find(v => v !== value);
            if (other === undefined) {row.controls.push({...control, result: 'SINGLE_OPTION'}); continue;}
            await locator.selectOption(other);
          } else if (['input', 'textarea'].includes(control.tag)) {
            if (['checkbox', 'radio'].includes(control.type)) await locator.click();
            else if (control.type === 'file') {row.controls.push({...control, result: 'FILE_PICKER'}); continue;}
            else await locator.fill(control.type === 'date' ? '2026-09-01' : control.type === 'month' ? '2026-08' : control.type === 'number' ? '3' : control.type === 'time' ? '09:00' : 'QA');
          } else await locator.click();
          await page.waitForTimeout(220);
          const after = await snapshot();
          const value = ['input', 'textarea', 'select'].includes(control.tag) ? await locator.inputValue().catch(() => '') : '';
          row.controls.push({...control, result: before !== after || value ? 'PASS' : 'REVIEW_NO_CHANGE'});
        } catch (error) {row.controls.push({...control, result: 'REVIEW', reason: error.message.split('\n')[0]});}
      }
    } catch (error) {errors.push(error.message.split('\n')[0]);}
    results.push(row);
    fs.mkdirSync('qa', {recursive: true});
    fs.writeFileSync('qa/route-audit.json', JSON.stringify({sourceFindings, results}, null, 2));
    console.log(`${results.length}/${routes.length} ${route}: HTTP ${row.http}, ${row.controls.length} controls, ${row.controls.filter(c => c.result.startsWith('REVIEW')).length} review`);
    await context.close();
  }
}
try {await Promise.all([worker(), worker()]);} finally {await browser.close();}
