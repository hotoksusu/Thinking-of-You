import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://localhost:3100';
const title=/병원에서 오늘안부를 안내받으셨나요/;
const real='oneul-anbu:care-mvp:v1',sample='oneul-anbu:public-demo:care-mvp:v5',session='oneul-anbu:demo:patient-session',invites='oneul-anbu:demo:invitations';
test('hospital-linked entry hierarchy, CTA and mobile layout',{timeout:120000},async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});try{for(const width of [360,375,390,430,768,1440]){
  const p=await b.newPage({viewport:{width,height:900},serviceWorkers:'block'});await p.goto(base);assert.equal(await p.getByRole('link',{name:/미리보기|샘플|체험/}).count(),0);await p.getByRole('link',{name:'병원에서 링크를 받았어요 · 환자 이용 안내'}).click();await p.getByRole('heading',{name:title}).waitFor();
  assert.equal(await p.getByRole('link',{name:/체험|샘플|회원가입|병원 검색|발급/}).count(),0);assert.equal(await p.locator('section').count(),1);
  const cta=p.getByRole('button',{name:'링크 여는 방법 확인',exact:true});assert.equal(await cta.getAttribute('aria-expanded'),'false');assert.ok((await cta.boundingBox()).y<900);await cta.focus();await p.keyboard.press('Enter');await p.locator('#link-opening-help').waitFor();await cta.click();assert.equal(await p.locator('#link-opening-help').count(),0);
  await p.getByRole('button',{name:'도움말 보기',exact:true}).click();await p.locator('#missing-link-help').waitFor();await p.getByText(/병원에서 받은 문자에 적힌 연락처로 재안내/).waitFor();await p.getByRole('button',{name:'도움말 보기',exact:true}).click();
  await p.reload();await p.getByRole('heading',{name:title}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`qa/hospital-entry-${width}.png`,fullPage:true});await p.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.close();
 }}finally{await b.close();}
});
test('original invitations, scoped sessions, repeat visits and safe errors',{timeout:120000},async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:390,height:900},serviceWorkers:'block'});try{
  await p.goto(base+'/app/patient');await p.getByRole('heading',{name:'환자 연결이 필요해요.'}).waitFor();await p.getByRole('link',{name:'서비스 이용 경로 선택'}).click();await p.getByRole('heading',{name:title}).waitFor();
  await p.goto(base+'/demo/patient');await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).waitFor();
  await p.evaluate(({real,sample,invites})=>{localStorage.setItem(real,localStorage.getItem(sample));localStorage.setItem(invites,JSON.stringify([{id:'qa-valid',token:'qa-valid',patientId:'patient_001',hospitalId:'hospital_001',status:'pending',createdAt:'2026-01-01',expiresAt:'2999-01-01'},{id:'qa-expired',token:'qa-expired',patientId:'patient_001',hospitalId:'hospital_001',status:'pending',createdAt:'2026-01-01',expiresAt:'2000-01-01'}]));},{real,sample,invites});
  await p.goto(base+'/?token=qa-valid');await p.waitForURL('**/i?token=qa-valid');await p.getByRole('heading',{name:/보내드린 회복관리/}).waitFor();await p.getByRole('button',{name:'오늘 상태 알려주기 →'}).click();await p.getByRole('button',{name:'오늘 상태 입력하기',exact:true}).click();await p.waitForURL('**/app/patient');await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).waitFor();
  const original=await p.evaluate(k=>localStorage.getItem(k),session);
  for(const path of ['/patient','/patient?token=qa-valid','/i?token=qa-valid']){await p.goto(base+path);await p.waitForURL('**/app/patient');await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).waitFor();assert.equal(await p.getByRole('heading',{name:title}).count(),0);}
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),session),original);
  await p.getByRole('link',{name:'회복 기록',exact:true}).click();await p.getByRole('heading',{name:'회복 기록',exact:true}).waitFor();await p.getByRole('link',{name:'병원 안내',exact:true}).click();await p.getByRole('heading',{name:'내 병원',exact:true}).waitFor();await p.reload();await p.getByRole('heading',{name:'내 병원',exact:true}).waitFor();await p.goBack();await p.getByRole('heading',{name:'회복 기록',exact:true}).waitFor();
  for(const [token,error] of [['qa-expired','초대 링크의 이용 시간이 지났어요.'],['bad','초대 링크를 확인할 수 없어요'],['','초대 링크를 확인할 수 없어요']]){await p.goto(base+'/patient?token='+token);await p.getByRole('heading',{name:error,exact:true}).waitFor();await p.getByRole('heading',{name:'병원에서 받은 링크 찾기'}).waitFor();await p.reload();await p.getByRole('heading',{name:error,exact:true}).waitFor();}
  // A patientId query never overrides the authenticated patient identity.
  await p.goto(base+'/app/patient?patientId=patient_002');await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).waitFor();await p.getByText('김OO님, 안녕하세요.',{exact:true}).waitFor();
  await p.evaluate(session=>{const s=JSON.parse(localStorage.getItem(session));s.hospitalId='hospital_002';localStorage.setItem(session,JSON.stringify(s));},session);await p.goto(base+'/app/patient');await p.getByRole('heading',{name:'이 환자의 기록에 접근할 수 없어요.'}).waitFor();assert.equal(await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).count(),0);
  await p.evaluate(session=>{const s=JSON.parse(localStorage.getItem(session));s.expiresAt='2000-01-01';localStorage.setItem(session,JSON.stringify(s));},session);await p.goto(base+'/patient');await p.getByRole('heading',{name:title}).waitFor();await p.getByRole('status').filter({hasText:'기존 환자 연결의 이용 시간이 지났어요.'}).waitFor();
  await p.evaluate(session=>localStorage.setItem(session,'{invalid'),session);await p.reload();await p.getByRole('alert').filter({hasText:'이 기기의 연결 정보를 읽지 못했어요.'}).waitFor();
 }finally{await b.close();}
});
