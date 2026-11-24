import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdir, readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {database, loadApi, provision, request, ADMIN, adminHeaders} from './helpers/care-server.mjs';
import {serveCare} from './helpers/care-http.mjs';

const pilot = {version:'v2',hospital:'시연 문의 병원',contact:'시연 담당자',email:'pilot@example.test',
  phone:'02-000-0000',department:'정형외과',monthlyVolume:'30명 이하',currentWorkflow:'전화·문자',adoptionGoal:'제품 시연',consent:true};

test('v2 inquiry validates, deduplicates and exposes only accepted fields to the operator', async () => {
  const {careApi} = await loadApi();
  const DB = database(), env = {DB,CARE_ADMIN_EMAIL:ADMIN};
  const call = (path, method, body, headers) => careApi(request(path,method,body,headers),env);
  try {
    assert.equal((await call('pilot','POST',{...pilot,consent:false})).status,400);
    assert.equal((await call('pilot','POST',{...pilot,phone:'invalid'})).status,400);
    assert.equal((await call('pilot','POST',{...pilot,adoptionGoal:'unexpected'})).status,400);
    const responses = await Promise.all([
      call('pilot','POST',{...pilot,patientName:'discard this'}),
      call('pilot','POST',{...pilot,email:'PILOT@example.test',phone:'020000000'}),
    ]);
    assert.deepEqual(responses.map(r=>r.status).sort(),[200,201]);
    const [a,b] = await Promise.all(responses.map(r=>r.json()));
    assert.equal(a.id,b.id);
    assert.equal((await call('staff/pilots','GET')).status,401);
    const {requests} = await (await call('staff/pilots','GET',undefined,adminHeaders)).json();
    assert.equal(requests.length,1);
    assert.equal(requests[0].consentVersion,'pilot-contact-v2');
    assert.equal(requests[0].adoptionGoal,'제품 시연');
    assert.equal(requests[0].patientName,undefined);
  } finally { DB.db.close(); }
});

test('care termination during a check-in prevents the late write and success audit', async () => {
  const {careApi} = await loadApi();
  const DB = database(), env = {DB,CARE_ADMIN_EMAIL:ADMIN};
  try {
    const {patient,hospital,invite} = await provision(careApi,env);
    const token = new URL(invite.url).searchParams.get('token');
    const connect = await careApi(request('connect','POST',{token,confirmed:true}),env);
    const cookie = connect.headers.get('set-cookie').split(';')[0];
    const date = new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
    const racing = {...env, DB:{...DB, batch:async statements => {
      await careApi(request('staff/care-status','PUT',{hospitalId:hospital.id,patientId:patient.id,status:'completed'},adminHeaders),env);
      return DB.batch(statements);
    }}};
    const saved = await careApi(request('checkins','POST',{patientId:patient.id,date,painScore:1,mobilityScore:0,dayComparison:'same',hasConcern:false},{Cookie:cookie}),racing);
    assert.equal(saved.status,409);
    assert.deepEqual(await saved.json(),{error:'CARE_COMPLETED'});
    assert.equal(DB.db.prepare('SELECT COUNT(*) n FROM care_checkins').get().n,0);
    assert.equal(DB.db.prepare("SELECT COUNT(*) n FROM care_audit WHERE action='checkin.save'").get().n,0);
  } finally { DB.db.close(); }
});

test('configured launch origin issues links on the new host and keeps the same-origin boundary', async () => {
  const {careApi} = await loadApi();
  const DB = database(), env = {DB, CARE_ADMIN_EMAIL:ADMIN};
  try {
    const {hospital,patient} = await provision(careApi,env);
    const origin = 'https://danyeon.yos1015.chatgpt.site';
    env.CARE_PUBLIC_ORIGIN = origin;
    const call = (path, body, from = origin, headers = {}) =>
      careApi(new Request(origin+'/api/care/'+path, {method:'POST',headers:{Origin:from, 'Content-Type':'application/json', ...headers},body:JSON.stringify(body)}),env);
    const issued = await call('staff/invitations',{hospitalId:hospital.id,patientId:patient.id},origin,adminHeaders);
    assert.equal(issued.status,201);
    const invite = new URL((await issued.json()).url);
    assert.equal(invite.origin,origin);
    assert.equal(invite.pathname,'/i');
    const token = invite.searchParams.get('token');
    const denied = await call('connect',{token,confirmed:true},'https://oneul-anbu.yos1015.chatgpt.site');
    assert.equal(denied.status,403);
    assert.equal(denied.headers.has('Access-Control-Allow-Origin'),false);
    assert.equal(DB.db.prepare('SELECT COUNT(*) n FROM care_sessions').get().n,0);
    const connected = await call('connect',{token,confirmed:true});
    assert.equal(connected.status,200);
    const cookie = connected.headers.get('Set-Cookie');
    assert.match(cookie,/^__Host-care_session=/);
    for (const attribute of ['HttpOnly','Secure','SameSite=Lax','Path=/']) assert.ok(cookie.includes(attribute));
    assert.doesNotMatch(cookie,/Domain=/i);
  } finally { DB.db.close(); }
});

test('DANYEON export and browser check-in-to-report workflow', {timeout:150000,skip:process.env.TEST_DANYEON_UI!=='1'}, async () => {
  const release = process.env.TEST_DANYEON_RELEASE === '1';
  const root = release ? 'dist/client' : 'out';
  const screenshots = release ? 'outputs/danyeon-release-qa' : 'outputs/danyeon-qa';
  const html = await readFile(root+'/index.html','utf8');
  assert.match(html,/data-care-brand="danyeon"/);
  assert.match(html,/danyeon-og\.png/);
  const manifest = JSON.parse(await readFile(root+'/manifest.webmanifest','utf8'));
  if (release) {
    assert.doesNotMatch(html,/data-care-demo="local"|noindex/);
    const origin = process.env.NEXT_PUBLIC_CARE_SITE_ORIGIN || 'https://danyeon.yos1015.chatgpt.site';
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.equal(new URL(canonical).href, new URL('/',origin).href);
    assert.ok(html.includes(new URL('/brand/danyeon-og.png',origin).href));
    assert.deepEqual(JSON.parse(await readFile(root+'/manifest.json','utf8')),manifest);
  }
  assert.equal(manifest.name,'다녀온');
  assert.equal(manifest.theme_color,'#2455CD');

  const {careApi} = await loadApi();
  const DB = database(), env = {DB,CARE_ADMIN_EMAIL:ADMIN,CARE_SMS_ENABLED:'false'};
  const fixture = await provision(careApi, env);
  const publicSite = await serveCare(careApi,env,{host:'127.0.0.1',root});
  const hospitalUser = 'desk@example.test';
  DB.db.prepare('UPDATE care_staff SET email=? WHERE email=?').run(hospitalUser,ADMIN);
  const deskSite = await serveCare(careApi,env,{host:'127.0.0.1',root,staffHeaders:{'oai-authenticated-user-id':'demo-desk','oai-authenticated-user-email':hospitalUser}});
  const operatorSite = await serveCare(careApi,env,{host:'127.0.0.1',root,staffHeaders:adminHeaders});
  const browser = await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL || 'chrome'});
  try {
    const patient = await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
    const desk = await browser.newPage({viewport:{width:1440,height:900},serviceWorkers:'block'});
    await mkdir(screenshots,{recursive:true});
    await patient.goto(publicSite.base);
    await patient.getByRole('heading',{name:'병원을 다녀온 후에도.'}).waitFor();
    assert.ok((await patient.title()).includes('다녀온'));
    assert.match(await patient.locator('link[rel="shortcut icon"]').getAttribute('href'),/danyeon\.svg/);
    await patient.getByText('환자가 앱을 설치해야 하나요?',{exact:true}).click();
    assert.equal(await patient.getByText(/병원에서 받은 전용 링크를 브라우저에서/).isVisible(),true);
    for (const width of [360,390,768,1440]) {
      await patient.setViewportSize({width,height:900});
      assert.equal(await patient.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'landing width '+width);
    }
    await patient.evaluate(()=>document.fonts.ready);
    await patient.screenshot({path:screenshots+'/landing-1440.png',fullPage:true});
    await patient.setViewportSize({width:390,height:844});
    await patient.screenshot({path:screenshots+'/landing-390.png',fullPage:true});
    await patient.route('**/fonts/**', route => route.abort());
    await patient.reload();
    await patient.evaluate(()=>document.fonts.ready);
    assert.match(await patient.locator('body').evaluate(body => getComputedStyle(body).fontFamily), /Malgun Gothic/);
    await patient.evaluate(()=>{document.documentElement.style.zoom='2';});
    assert.equal(await patient.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth),false,'200% CSS zoom with font fallback');
    await patient.unroute('**/fonts/**');
    await patient.goto(publicSite.base+'/demo');
    if (release) {
      await patient.getByRole('heading',{name:'개발 전용 화면입니다.'}).waitFor();
      assert.equal(await patient.getByText('다녀온',{exact:true}).count(),1);
      assert.equal(await patient.getByRole('link',{name:'서비스 운영관리자 체험 시작'}).count(),0);
    } else await patient.getByRole('link',{name:'서비스 운영관리자 체험 시작'}).waitFor();

    const token = new URL(fixture.invite.url).searchParams.get('token');
    await patient.goto(publicSite.base+'/i?token='+token);
    const connect = patient.getByRole('button',{name:'내 기록으로 연결하기'});
    await connect.waitFor();
    assert.equal(await connect.isDisabled(),true);
    await patient.getByText('회복관리 프로그램 · 14일',{exact:false}).waitFor();
    await patient.getByRole('checkbox').check();
    await connect.click();
    await patient.waitForURL('**/app/patient');
    const start = patient.getByRole('link',{name:'오늘 회복기록 남기기'});
    const begin = Date.now();
    await start.click();
    assert.equal(await patient.getByRole('button',{name:'다음',exact:true}).isDisabled(),true);
    await patient.getByRole('button',{name:'통증 1점',exact:true}).click();
    await patient.getByRole('button',{name:'다음',exact:true}).click();
    const movement = patient.getByRole('button',{name:'어제와 비슷해요',exact:true});
    await movement.focus();
    await patient.keyboard.press('Enter');
    assert.equal(await movement.getAttribute('aria-pressed'),'true');
    await patient.getByRole('button',{name:'다음',exact:true}).click();
    await patient.getByRole('button',{name:'비슷해요',exact:true}).click();
    await patient.getByRole('button',{name:'다음',exact:true}).click();
    await patient.getByRole('button',{name:'새롭게 불편해진 점은 없어요',exact:true}).click();
    await patient.getByRole('button',{name:'기록 확인하기'}).click();
    await patient.getByRole('heading',{name:'제출할 기록을 확인해주세요.'}).waitFor();
    assert.equal(DB.db.prepare('SELECT COUNT(*) n FROM care_checkins').get().n,0);
    await patient.screenshot({path:screenshots+'/review-390.png',fullPage:true});
    const submit = patient.getByRole('button',{name:'회복기록 제출하기'});
    publicSite.failNextSave();
    await submit.click();
    await patient.getByRole('alert').filter({hasText:'저장하지 못했어요.'}).waitFor();
    assert.equal(DB.db.prepare('SELECT COUNT(*) n FROM care_checkins').get().n,0);
    await submit.click();
    await patient.getByRole('heading',{name:'오늘의 회복기록을 남겼어요.'}).waitFor();
    console.log('Automated check-in with screenshot and simulated retry: '+(Date.now()-begin)+' ms');
    assert.equal(DB.db.prepare('SELECT COUNT(*) n FROM care_checkins').get().n,1);
    await patient.getByRole('link',{name:'회복 추이 보기'}).click();
    await patient.getByRole('heading',{name:'회복 기록',exact:true}).waitFor();
    await patient.getByRole('link',{name:'병원 안내',exact:true}).click();
    await patient.getByRole('heading',{name:'내 병원'}).waitFor();
    await patient.goto(publicSite.base+'/pilot');
    await patient.getByLabel('병원명',{exact:true}).fill(pilot.hospital);
    await patient.getByLabel('담당자명',{exact:true}).fill(pilot.contact);
    await patient.getByLabel('연락처',{exact:true}).fill(pilot.phone);
    await patient.getByLabel('이메일',{exact:true}).fill(pilot.email);
    await patient.getByLabel('주요 진료과').selectOption(pilot.department);
    await patient.getByLabel('월 수술·퇴원환자 규모').selectOption(pilot.monthlyVolume);
    await patient.getByLabel('현재 사후관리 방식').selectOption(pilot.currentWorkflow);
    await patient.getByLabel('도입 희망 사항').selectOption(pilot.adoptionGoal);
    await patient.getByRole('checkbox').check();
    await patient.getByRole('button',{name:'파일럿 상담 요청 접수'}).click();
    await patient.getByRole('status').filter({hasText:'상담 요청을 접수했습니다'}).waitFor();

    await desk.goto(deskSite.base+'/care/server');
    await desk.getByRole('heading',{name:'오늘 확인할 환자'}).waitFor();
    const active = desk.getByRole('button',{name:/현재 관리 중.*대상 환자 보기/});
    await active.click();
    assert.equal(await active.getAttribute('aria-pressed'),'true');
    await desk.getByRole('button',{name:/QA 환자.*응답 확인/}).click();
    const detail = desk.getByRole('article',{name:'서버 환자 업무 상세'});
    await detail.getByRole('button',{name:'응답 확인 기록'}).click();
    await desk.getByText('의료진 확인 저장 완료',{exact:true}).waitFor();
    await detail.getByLabel('조치 메모').fill('합성 시연 메모');
    await detail.getByRole('button',{name:'조치 기록 저장'}).click();
    await desk.getByText('조치 기록 저장 완료',{exact:true}).waitFor();
    const date = new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
    await detail.getByLabel('Follow-up 예정일').fill(date);
    await detail.getByRole('button',{name:'Follow-up 예약'}).click();
    await desk.getByText('Follow-up 예약 저장 완료',{exact:true}).waitFor();
    await desk.getByRole('tab',{name:'후속관리'}).click();
    await desk.getByText('오늘 예정',{exact:true}).waitFor();
    await desk.getByRole('button',{name:/QA 환자/}).first().click();
    await detail.getByRole('button',{name:'Follow-up 완료 처리'}).click();
    await desk.getByText('Follow-up 완료 저장 완료',{exact:true}).waitFor();
    await desk.getByRole('tab',{name:'오늘의 업무'}).click();
    await desk.screenshot({path:screenshots+'/desk-1440.png',fullPage:true});
    await desk.getByRole('tab',{name:'리포트',exact:true}).click();
    await desk.getByRole('button',{name:'월간 리포트 생성'}).click();
    await desk.getByRole('article',{name:'서버 리포트 결과'}).waitFor();
    await desk.getByText('100.0% (1/1건)',{exact:true}).first().waitFor();
    const downloadLink = desk.getByRole('link',{name:/CSV/});
    const [download] = await Promise.all([desk.waitForEvent('download'),downloadLink.click()]);
    assert.equal(download.suggestedFilename(),'care-report.csv');
    assert.match(await readFile(await download.path(),'utf8'),/followupsCompleted,1/);

    const publicApi = await patient.request.get(publicSite.base+'/api/care/staff/pilots');
    assert.equal(publicApi.status(),401);
    assert.equal((await desk.request.get(deskSite.base+'/api/care/staff/pilots')).status(),403);
    const operator = await browser.newPage({viewport:{width:1280,height:900},serviceWorkers:'block'});
    await operator.goto(operatorSite.base+'/care/server');
    await operator.getByRole('heading',{name:'다녀온 운영관리'}).waitFor();
    await operator.getByText('병원 파일럿 신청 관리',{exact:true}).click();
    await operator.getByText(pilot.hospital,{exact:true}).waitFor();
    await operator.getByText('최근 접근 거부 감사 기록',{exact:true}).click();
    await operator.getByText(/pilot.*접근 거부/).first().waitFor();
    const response = await operator.request.get(operatorSite.base+'/api/care/staff/work?hospitalId='+fixture.hospital.id);
    assert.equal(response.status(),403);
    await desk.getByRole('tab',{name:'오늘의 업무'}).click();
    await desk.getByRole('button',{name:/QA 환자.*최근 응답/}).click();
    await detail.getByText('환자 회복관리 종료',{exact:true}).click();
    await detail.getByRole('checkbox').check();
    await detail.getByRole('button',{name:'회복관리 종료 저장'}).click();
    await desk.getByRole('status').filter({hasText:'환자의 회복관리를 종료했습니다.'}).waitFor();
    await patient.goto(publicSite.base+'/i?token='+token);
    await patient.getByRole('heading',{name:'초대 링크를 확인할 수 없어요'}).waitFor();
  } finally {
    await browser.close();
    await Promise.all([publicSite.close(),deskSite.close(),operatorSite.close()]);
    DB.db.close();
  }
});
