import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
const origin = process.env.TEST_BASE_URL || 'http://localhost:3100';
for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
 test(`entry flows and cold image layout at ${viewport.width}px`, {timeout:120000}, async()=>{
  const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL || 'msedge'});
  const context=await browser.newContext({viewport,serviceWorkers:'block'});
  const page=await context.newPage();
  try {
   await page.addInitScript(()=>{
    window.__shifts=[];
    new PerformanceObserver(list=>window.__shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
   });
   await page.goto(origin);
   assert.equal(await page.getByRole('link',{name:/체험하기|받은 링크/}).count(),0);
   await page.getByRole('link',{name:'환자 화면 미리보기',exact:true}).click();
   assert.equal(await page.locator('link[rel=preload][as=image][href="/assets/characters/care-companion.webp"]').count()>0,true);
   await page.getByRole('link',{name:'오늘 상태 입력하기'}).click();
   await page.getByText('오늘 회복 체크 · 약 1분',{exact:true}).waitFor();
   assert.equal(await page.evaluate(()=>localStorage.getItem('oneul-anbu:demo:patient-session')),null);
   await page.goto(origin);
   await page.getByRole('link',{name:/병원 관계자이신가요/}).click();
   await page.getByRole('link',{name:'병원 데모 보기',exact:true}).first().click();
   await page.getByLabel('역할 전환').waitFor();
   await page.evaluate(()=>localStorage.setItem('oneul-anbu:demo:invitations',JSON.stringify([{id:'qa-invite',patientId:'patient_001',hospitalId:'hospital_001',token:'qa-valid',status:'pending',createdAt:'2026-01-01',expiresAt:'2999-01-01'}])));
   await page.goto(origin+'/i?token=qa-valid');
   await page.getByRole('heading',{name:/보내드린 회복관리/}).waitFor();
   assert.equal(await page.getByRole('link',{name:/미리보기|체험|데모/}).count(),0);
   await page.getByRole('button',{name:'오늘 상태 알려주기 →'}).click();
   await page.getByRole('button',{name:'오늘 상태 입력하기'}).click();
   await page.waitForURL('**/app/patient');
   await page.getByRole('heading').first().waitFor();
   await page.goto(origin+'/i?token=qa-valid');
   await page.waitForURL('**/app/patient');
   await page.goto(origin);
   await page.waitForURL('**/app/patient/checkin');
   await page.goto(origin+'/i?token=missing');
   await page.getByRole('heading',{name:'초대 링크를 확인할 수 없어요'}).waitFor();
   assert.equal(await page.getByRole('link',{name:/미리보기|체험|데모/}).count(),0);
   // Independent cold direct visit, without the public landing's preloaded asset.
   const cold=await browser.newContext({viewport,serviceWorkers:'block'});
   const direct=await cold.newPage();
   await direct.addInitScript(()=>{window.__shifts=[];new PerformanceObserver(list=>window.__shifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});});
   await direct.goto(origin+'/demo/patient');
   await direct.getByRole('heading',{name:'오늘 회복 상태를 알려주세요.'}).waitFor();
   await direct.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   const metrics=await direct.evaluate(()=>({cls:window.__shifts.reduce((a,b)=>a+b,0),image:performance.getEntriesByType('resource').filter(e=>e.name.includes('care-companion.webp')).map(e=>({duration:e.duration,bytes:e.transferSize})),overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.ok(metrics.cls<0.1,JSON.stringify(metrics));assert.equal(metrics.overflow,false);
   console.log(viewport.width,JSON.stringify(metrics));
   await direct.screenshot({path:`qa/entry-${viewport.width}.png`,fullPage:true});
   await direct.reload();await direct.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   await cold.close();
  } finally {await browser.close();}
 });
}
