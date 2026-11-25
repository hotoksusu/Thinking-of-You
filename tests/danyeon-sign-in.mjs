import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { serveCare } from './helpers/care-http.mjs';
import { ADMIN, database, loadApi } from './helpers/care-server.mjs';

const output = 'outputs/danyeon-v22-auth';
const liveOrigin = 'https://danyeon.yos1015.chatgpt.site';
const signIn = '/signin-with-chatgpt?return_to=%2Fcare%2Fserver';
const signOut = '/signout-with-chatgpt?return_to=%2Fcare%2Fserver';
const routes = [
  { route: '/hospital/login', key: 'hospital-login', title: '다녀온 데스크', button: '병원 담당자 로그인' },
  { route: '/care/server', key: 'desk', title: '다녀온 데스크', button: '병원 담당자 로그인' },
  { route: '/admin/login', key: 'admin-login', title: '다녀온 운영관리', button: '운영관리자 로그인' },
];

test('staff sign-in routes explain the current provider and fit desktop and mobile', {
  skip: process.env.TEST_DANYEON_UI !== '1', timeout: 90000,
}, async () => {
  const { careApi } = await loadApi();
  const DB = database();
  const env = { DB, CARE_ADMIN_EMAIL: ADMIN, CARE_SMS_ENABLED: 'false' };
  const root = process.env.TEST_DANYEON_RELEASE === '1' ? 'dist/client' : 'out';
  const publicSite = await serveCare(careApi, env, { host: '127.0.0.1', root });
  const deniedSite = await serveCare(careApi, env, {
    host: '127.0.0.1', root,
    staffHeaders: { 'oai-authenticated-user-id': 'qa-unapproved', 'oai-authenticated-user-email': 'unapproved@example.test' },
  });
  let browser;
  try {
    await mkdir(output, { recursive: true });
    browser = await chromium.launch({ channel: process.env.TEST_BROWSER_CHANNEL || 'chrome' });
    const page = await browser.newPage({ serviceWorkers: 'block' });

    for (const width of [1440, 390, 360]) {
      await page.setViewportSize({ width, height: width > 500 ? 900 : 844 });
      for (const { route, key, title, button } of routes) {
        assert.equal((await page.goto(publicSite.base + route)).status(), 200);
        await page.getByRole('heading', { level: 1, name: title }).waitFor();
        const link = page.getByRole('link', { name: button, exact: true });
        await link.waitFor();
        assert.equal(await link.getAttribute('href'), signIn);
        assert.equal(await link.getAttribute('target'), '_top');
        assert.match(await page.getByText('현재 ChatGPT 계정으로 본인을 확인합니다.').innerText(), /ChatGPT/);
        assert.equal(await page.locator('input').count(), 0);
        assert.doesNotMatch(await page.locator('main').innerText(), /서버 연계 회복관리|서버에서 검증|테스트 데이터|비밀번호 찾기/);
        await page.getByRole('link', { name: '계정 이용 문의' }).waitFor();
        if (key !== 'admin-login') {
          await page.getByText('승인된 의료기관 담당자만 이용할 수 있습니다.').waitFor();
          await page.getByRole('link', { name: '병원 도입 문의' }).waitFor();
        } else {
          await page.getByText('승인된 운영관리자만 이용할 수 있습니다.').waitFor();
        }
        const box = await page.locator('.danyeon-sign-in-card').boundingBox();
        assert.equal(box.width, Math.min(420, width - 32));
        assert.ok(Math.abs(box.x - (width - box.width) / 2) < 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        if (width !== 360) {
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({ path: output + '/after-' + key + '-' + width + '.png', fullPage: true });
        }
      }
    }

    await page.goto(publicSite.base + '/hospital/login');
    for (const [label, destination, heading] of [
      ['계정 이용 문의', '/hospital/support#account', '계정 이용 문의'],
      ['이용약관 안내', '/hospital/support#terms', '이용약관 안내'],
      ['서비스 문의', '/hospital/support#contact', '서비스 문의'],
      ['개인정보 처리 안내', '/care/privacy', 'Care 정보 처리·운영 현황'],
      ['병원 도입 문의', '/pilot', '병원 도입 문의'],
    ]) {
      await page.getByRole('link', { name: label, exact: true }).click();
      await page.waitForURL(publicSite.base + destination);
      await page.getByRole('heading', { name: heading, exact: true }).waitFor();
      await page.goto(publicSite.base + '/hospital/login');
    }

    await page.goto(deniedSite.base + '/care/server');
    await page.getByRole('alert').filter({ hasText: '이 계정에는 이용 권한이 없습니다.' }).waitFor();
    assert.equal(await page.getByRole('link', { name: '병원 담당자 로그인' }).count(), 0);
    assert.equal(await page.getByRole('link', { name: '현재 계정 로그아웃' }).getAttribute('href'), signOut);

    const state = '**/api/care/staff/state';
    await page.route(state, route => route.abort());
    await page.goto(publicSite.base + '/care/server');
    await page.getByRole('alert').filter({ hasText: '로그인 상태를 확인하지 못했습니다.' }).waitFor();
    await page.unroute(state);
    await page.getByRole('button', { name: '다시 확인', exact: true }).click();
    await page.getByRole('link', { name: '병원 담당자 로그인', exact: true }).waitFor();
    assert.equal((await page.request.get(publicSite.base + '/api/care/staff/state')).status(), 401);
  } finally {
    await browser?.close();
    await Promise.all([publicSite.close(), deniedSite.close()]);
    DB.db.close();
  }
});

test('live sign-in baseline and provider redirect', {
  skip: process.env.TEST_DANYEON_LIVE_BASELINE !== '1', timeout: 90000,
}, async () => {
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.TEST_BROWSER_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage({ serviceWorkers: 'block' });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width > 500 ? 900 : 844 });
      for (const { route, key } of routes) {
        assert.equal((await page.goto(liveOrigin + route, { waitUntil: 'domcontentloaded' })).status(), 200);
        await page.locator('main a[href^="/signin-with-chatgpt"]').first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: output + '/before-' + key + '-' + width + '.png', fullPage: true });
      }
    }
    const redirect = await page.request.get(liveOrigin + signIn, { maxRedirects: 0 });
    assert.equal(redirect.status(), 302);
    assert.equal(new URL(redirect.headers().location).hostname, 'auth.openai.com');
  } finally {
    await browser.close();
  }
});
