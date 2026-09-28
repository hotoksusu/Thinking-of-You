import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {test} from 'node:test';
const {chromium} = createRequire(import.meta.url)('playwright');
const origin = process.env.TEST_BASE_URL || 'http://localhost:3100';
const launch = () => chromium.launch({headless: true, channel: process.env.TEST_BROWSER_CHANNEL || undefined});
const key = 'oneul-anbu:public-demo:care-mvp:v5';

test('all demo roles: navigation, report generation/empty/error/print and permissions', {timeout: 180000}, async () => {
  const browser = await launch();
  try {
    for (const role of ['nurse', 'doctor', 'owner', 'hospital_admin']) {
      const page = await browser.newPage();
      await page.goto(origin + '/demo/hospital');
      await page.getByLabel('역할 전환').selectOption(role);
      await page.getByRole('button', {name: '리포트', exact: true}).click();
      await page.getByRole('button', {name: '월간 리포트 생성', exact: true}).click();
      await page.getByRole('article', {name: '리포트 결과'}).waitFor();
      assert.match(await page.getByRole('article', {name: '리포트 결과'}).innerText(), /응답률[\s\S]*전월 대비[\s\S]*회복 변화[\s\S]*의료진 조치 건수[\s\S]*Follow-up 건수/);
      await page.evaluate(() => {window.print = () => document.body.dataset.printed = 'yes';});
      await page.getByRole('button', {name: '인쇄 / PDF로 저장', exact: true}).click();
      assert.equal(await page.locator('body').getAttribute('data-printed'), 'yes');
      assert.equal(await page.getByRole('button', {name: 'PDF 파일 다운로드 · 준비 중'}).isDisabled(), true);
      await page.getByLabel('리포트 기간').fill('2000-01');
      await page.getByRole('button', {name: '월간 리포트 생성', exact: true}).click();
      await page.getByText('선택한 기간에 관리한 환자가 없습니다.').waitFor();
      await page.getByLabel('리포트 기간').fill('2999-01');
      await page.getByRole('button', {name: '월간 리포트 생성', exact: true}).click();
      await page.getByRole('alert').waitFor();
      await page.goto(origin + '/demo/hospital/patient?patientId=patient_001');
      await page.getByRole('heading', {name: '다음 조치', exact: true}).waitFor();
      const readOnly = ['owner', 'hospital_admin'].includes(role);
      assert.equal(await page.getByRole('button', {name: '전화 확인', exact: true}).isDisabled(), readOnly);
      if (readOnly) {
        await page.getByText('열람 전용 계정입니다.', {exact: false}).waitFor();
        assert.equal(await page.getByRole('button', {name: '관리 종료 · 권한 없음'}).isDisabled(), true);
      }
      await page.close();
    }
  } finally {await browser.close();}
});

test('nurse follow-up creation → list → completion; next patient changes actual detail', {timeout: 120000}, async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.goto(origin + '/demo/hospital');
    await page.getByLabel('역할 전환').waitFor();
    await page.evaluate(key => {const state = JSON.parse(localStorage.getItem(key)); state.careActions = []; state.followUps = []; state.decisions = []; state.careTasks = []; localStorage.setItem(key, JSON.stringify(state));}, key);
    await page.goto(origin + '/demo/hospital/patient?patientId=patient_001&returnTo=%2Fdemo%2Fhospital%3Fview%3Dfollowup%26status%3Dfollowup');
    await page.getByRole('button', {name: '전화 확인', exact: true}).click();
    await page.getByRole('button', {name: 'Follow-up 필요', exact: true}).click();
    await page.getByRole('button', {name: '내일', exact: true}).click();
    await page.getByRole('button', {name: '조치 기록 저장', exact: true}).click();
    await page.getByText('관리 기록에 반영했습니다.', {exact: true}).waitFor();
    await page.getByRole('link', {name: '이전 목록으로'}).click();
    await page.getByRole('button', {name: 'Follow-up 예정', exact: true}).waitFor();
    assert.equal(await page.getByRole('link', {name: '상세', exact: true}).count(), 1);
    await page.getByRole('link', {name: '상세', exact: true}).click();
    await page.getByLabel('결과 메모', {exact: true}).fill('재확인 완료');
    await page.getByRole('button', {name: 'Follow-up 완료 기록'}).click();
    await page.getByText('재확인 완료', {exact: true}).waitFor();
    const nextLink = page.getByRole('link', {name: /다음 환자/});
    const href = await nextLink.getAttribute('href');
    await nextLink.click();
    await page.waitForURL(url => url.searchParams.get('patientId') === new URL(href, origin).searchParams.get('patientId'));
    await page.getByRole('heading', {name: '다음 조치', exact: true}).waitFor();
    assert.equal(await page.getByText('재확인 완료', {exact: true}).count(), 0);
    const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    assert.equal(state.followUps[0].status, 'completed');
  } finally {await browser.close();}
});

test('authenticated role cannot switch permissions and registration validates missing inputs', {timeout: 60000}, async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('oneul-anbu:demo:hospital-session', JSON.stringify({kind: 'hospital', sessionId: 'qa', userId: 'hu_a_nurse', hospitalId: 'hospital_001', role: 'nurse', expiresAt: '2999-01-01'})));
    await page.goto(origin + '/hospital/dashboard');
    await page.getByLabel('역할 전환').waitFor();
    assert.equal(await page.getByLabel('역할 전환').isDisabled(), true);
    await page.goto(origin + '/care/hospital/register');
    await page.getByRole('button', {name: '환자 등록하기'}).click();
    await page.getByRole('alert').waitFor();
  } finally {await browser.close();}
});
