import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {test} from 'node:test';

const {chromium} = createRequire(import.meta.url)('playwright');
const origin = process.env.TEST_BASE_URL || 'http://localhost:3100';
const demoKey = 'oneul-anbu:public-demo:care-mvp:v5';
const careKey = 'oneul-anbu:care-mvp:v1';
const cases = [
  ['즉시 확인', 'needs_attention', '즉시 확인', ['patient_001'], true],
  ['오늘 연락', 'no_response', '오늘 연락 (미응답)', ['patient_003'], true],
  ['의사 확인 대기', 'doctor', '의사 확인 대기', ['patient_002'], true],
  ['미응답 환자 연락하기', 'no_response', '오늘 연락 (미응답)', ['patient_003']],
  ['오늘 퇴원환자 확인하기', 'discharged', '오늘 퇴원', ['patient_001']],
  ['의사 확인 요청 보기', 'doctor', '의사 확인 대기', ['patient_002']],
];

for (const demo of [true, false]) {
  test(`${demo ? 'demo' : 'hospital'}: home → filtered list → detail → action`, {timeout: 180000}, async () => {
    const browser = await chromium.launch({headless: true, ...(process.env.TEST_BROWSER_CHANNEL ? {channel: process.env.TEST_BROWSER_CHANNEL} : {})});
    try {
      const page = await browser.newPage();
      page.setDefaultTimeout(15000);
      const base = demo ? '/demo/hospital' : '/hospital/dashboard';
      await page.goto(origin + '/demo/hospital');
      await page.getByRole('heading', {level: 1}).waitFor();
      // Deterministic statuses, doctor workflow, today/yesterday/future discharges.
      await page.evaluate(({demoKey, careKey}) => {
        const state = JSON.parse(localStorage.getItem(demoKey));
        const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul'}).format(new Date());
        state.patients = state.patients.filter(p => ['patient_001', 'patient_002', 'patient_003'].includes(p.id));
        state.patients.forEach((p, i) => {p.dischargeDate = new Date(Date.parse(today) + [0, -1, 1][i] * 86400000).toISOString().slice(0, 10); p.careStatus = 'active';});
        state.statuses = state.patients.map((p, i) => ({patientId: p.id, level: ['needs_attention', 'watch', 'no_response'][i], reason: 'navigation fixture', updatedAt: today}));
        state.careTasks = [{id: 'nav-task', patientId: 'patient_002', signalIds: [], priority: 'normal', status: 'in_progress', createdAt: today}];
        state.decisions = []; state.followUps = []; state.careActions = [];
        state.episodes.forEach(e => {e.dataScope = 'navigation-test';});
        localStorage.setItem(demoKey, JSON.stringify(state));
        localStorage.setItem(careKey, JSON.stringify(state));
        localStorage.setItem('oneul-anbu:demo:hospital-session', JSON.stringify({kind: 'hospital', sessionId: 'test', userId: 'hu_a_nurse', hospitalId: 'hospital_001', role: 'nurse', expiresAt: '2999-01-01T00:00:00.000Z'}));
      }, {demoKey, careKey});

      for (const [label, filter, chip, ids, card] of cases) {
        console.log(`${base}: ${label}`);
        await page.goto(origin + base);
        const cta = page.getByRole('button', {name: card ? new RegExp(`^${label}.*대상 환자 보기`) : label});
        await cta.waitFor();
        if (filter === 'needs_attention') {await cta.focus(); await page.keyboard.press('Enter');}
        else await cta.click({position: {x: 12, y: 12}});
        await page.getByRole('region', {name: '환자목록 필터'}).waitFor();
        assert.equal(new URL(page.url()).searchParams.get('view'), 'patients');
        assert.equal(new URL(page.url()).searchParams.get('status'), filter);
        assert.equal(await page.getByRole('button', {name: chip, exact: true}).getAttribute('aria-pressed'), 'true');
        assert.match(await page.getByRole('status').innerText(), new RegExp(chip.replace(/[()]/g, '\\$&')));
        const actual = await page.getByRole('link', {name: '상세', exact: true}).evaluateAll(links => links.map(link => new URL(link.href).searchParams.get('patientId')));
        assert.deepEqual(actual, ids);
        const listUrl = page.url();
        await page.reload();
        await page.getByRole('link', {name: '상세', exact: true}).first().click();
        await page.getByRole('link', {name: '이전 목록으로'}).waitFor();
        assert.equal(new URL(page.url()).pathname, demo ? '/demo/hospital/patient' : '/care/hospital/kim');
        await page.getByRole('link', {name: '이전 목록으로'}).click();
        await page.getByRole('region', {name: '환자목록 필터'}).waitFor();
        assert.equal(page.url(), listUrl);
      }

      // Browser history restores the selected list and the home screen.
      await page.goto(origin + base);
      await page.getByRole('button', {name: '미응답 환자 연락하기'}).click();
      await page.goBack();
      await page.getByRole('heading', {name: '빠른 업무'}).waitFor();
      await page.goForward();
      await page.getByRole('button', {name: '오늘 연락 (미응답)', exact: true}).waitFor();

      // Additional filters survive the detail round trip, and the action is saved.
      await page.getByPlaceholder('환자 이름 또는 내부 ID 검색').fill('patient_003');
      await page.getByRole('link', {name: '연락 기록', exact: true}).click();
      await page.getByRole('link', {name: '이전 목록으로'}).waitFor();
      await page.getByRole('link', {name: '연락 기록', exact: true}).click();
      await page.getByRole('button', {name: '조치 기록 저장', exact: true}).click();
      await page.getByText('관리 기록에 반영했습니다.', {exact: true}).waitFor();
      await page.getByRole('link', {name: '이전 목록으로'}).click();
      await page.getByRole('region', {name: '환자목록 필터'}).waitFor();
      assert.equal(await page.getByPlaceholder('환자 이름 또는 내부 ID 검색').inputValue(), 'patient_003');
      assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).careActions.length, demo ? demoKey : careKey), 1);

      // Zero-count cards are disabled; quick actions still show a usable empty list.
      await page.evaluate(key => {const state = JSON.parse(localStorage.getItem(key)); state.patients = []; localStorage.setItem(key, JSON.stringify(state));}, demo ? demoKey : careKey);
      await page.goto(origin + base);
      for (const label of ['즉시 확인', '오늘 연락', '의사 확인 대기']) {
        const card = page.getByRole('button', {name: new RegExp(`^${label}.*대상 환자가 없습니다`)});
        await card.waitFor(); assert.equal(await card.isDisabled(), true);
      }
      await page.getByRole('button', {name: '오늘 퇴원환자 확인하기'}).click();
      await page.getByText('선택한 조건에 해당하는 환자가 없습니다.', {exact: false}).waitFor();
      assert.equal(await page.getByRole('button', {name: '오늘 퇴원', exact: true}).getAttribute('aria-pressed'), 'true');
    } finally {await browser.close();}
  });
}
