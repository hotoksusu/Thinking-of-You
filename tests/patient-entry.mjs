import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
const origin=process.env.TEST_BASE_URL||'http://localhost:3100';
const real='oneul-anbu:care-mvp:v1',sample='oneul-anbu:public-demo:care-mvp:v5',session='oneul-anbu:demo:patient-session',invites='oneul-anbu:demo:invitations';
for(const width of [390,1440])test(`entry paths and demo isolation ${width}`,{timeout:120000},async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),p=await context.newPage();
 try{
  await p.goto(origin);await p.getByRole('link',{name:'오늘 안부 시작하기'}).click();await p.getByRole('heading',{name:'어떻게 이용하시겠어요?'}).waitFor();
  await p.getByRole('heading',{name:'병원에서 링크를 받았어요'}).waitFor();await p.getByText('링크를 받지 못했거나 찾을 수 없어요',{exact:true}).click();await p.getByText(/이용 대상이라면 회복관리 링크 발급/).waitFor();
  assert.equal(await p.getByRole('link',{name:/회원가입|병원 검색|링크 발급/}).count(),0);
  await p.reload();await p.getByRole('heading',{name:'어떻게 이용하시겠어요?'}).waitFor();
  await p.getByRole('link',{name:'샘플로 체험하기'}).click();await p.getByRole('heading',{name:'오늘 컨디션은 어떠세요?'}).waitFor();await p.getByText('샘플 체험 · 실제 환자 기록에 저장되거나 병원에 전송되지 않아요.',{exact:true}).waitFor();
  await p.goBack();await p.getByRole('heading',{name:'어떻게 이용하시겠어요?'}).waitFor();await p.reload();await p.getByRole('link',{name:'랜딩페이지로 돌아가기'}).click();await p.getByRole('heading',{name:'오늘 몸은 어떠세요?'}).waitFor();
  await p.evaluate(({real,sample,invites})=>{const s=JSON.parse(localStorage.getItem(sample));localStorage.setItem(real,JSON.stringify(s));localStorage.setItem(invites,JSON.stringify([{id:'qa-valid',token:'qa-valid',patientId:'patient_001',hospitalId:'hospital_001',status:'pending',createdAt:'2026-01-01',expiresAt:'2999-01-01'},{id:'qa-expired',token:'qa-expired',patientId:'patient_001',hospitalId:'hospital_001',status:'pending',createdAt:'2026-01-01',expiresAt:'2000-01-01'}]));},{real,sample,invites});
  await p.goto(origin+'/patient?token=qa-valid');await p.waitForURL('**/i?token=qa-valid');await p.getByRole('heading',{name:/보내드린 회복관리/}).waitFor();await p.reload();await p.getByRole('button',{name:'오늘 상태 알려주기 →'}).click();await p.getByRole('button',{name:'오늘 상태 입력하기',exact:true}).click();await p.waitForURL('**/app/patient');await p.getByRole('heading',{name:'오늘 컨디션은 어떠세요?'}).waitFor();
  await p.goto(origin);await p.getByRole('heading',{name:'오늘 몸은 어떠세요?'}).waitFor();await p.getByRole('link',{name:'오늘 안부 시작하기'}).click();await p.waitForURL('**/app/patient');await p.reload();await p.getByRole('heading',{name:'오늘 컨디션은 어떠세요?'}).waitFor();
  for(const [token,title] of [['qa-expired','초대 링크의 이용 시간이 지났어요.'],['bad','초대 링크를 확인할 수 없어요'],['','초대 링크를 확인할 수 없어요']]){
   await p.goto(origin+'/?token='+token);await p.getByRole('heading',{name:title,exact:true}).waitFor();await p.getByRole('heading',{name:'병원에서 받은 링크 찾기'}).waitFor();await p.getByText(/퇴원 안내문 또는 병원에서 받은 문자에 적힌 연락처로 새 링크/).waitFor();await p.reload();await p.getByRole('heading',{name:title,exact:true}).waitFor();assert.equal(await p.getByRole('link',{name:'서비스 이용 경로 선택'}).getAttribute('href'),'/patient');assert.equal(await p.getByRole('link',{name:'랜딩페이지로 돌아가기'}).getAttribute('href'),'/');
  }
  // Demo saves only synthetic records; a live session must never leak into demo auditing.
  await p.evaluate(()=>{localStorage.setItem('oneul-anbu:demo:hospital-session',JSON.stringify({kind:'hospital',sessionId:'qa',userId:'qa-staff',hospitalId:'hospital_001',role:'nurse',expiresAt:'2999-01-01'}));});
  const keys=[real,session,invites,'oneul-anbu:demo:hospital-session','oneul-anbu:demo:audit','oneul-anbu:care-analytics:v1'];
  const snapshot=()=>p.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),keys),before=await snapshot();
  await p.goto(origin+'/demo/patient');await p.getByRole('button',{name:'보통이에요',exact:true}).click();await p.getByRole('link',{name:'오늘 상태 기록하기'}).click();await p.getByRole('button',{name:'통증 1점',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'어제와 비슷해요',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'비슷해요',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'새롭게 불편해진 점은 없어요',exact:true}).click();await p.getByRole('button',{name:'오늘 기록 마치기'}).click();await p.getByRole('heading',{name:'오늘 회복 기록을 남겼어요'}).waitFor();assert.deepEqual(await snapshot(),before);
  await p.evaluate(session=>{const s=JSON.parse(localStorage.getItem(session));s.expiresAt='2000-01-01';localStorage.setItem(session,JSON.stringify(s));},session);await p.goto(origin+'/patient');await p.getByRole('heading',{name:'어떻게 이용하시겠어요?'}).waitFor();await p.getByRole('status').filter({hasText:'기존 환자 연결의 이용 시간이 지났어요.'}).waitFor();
  await p.evaluate(session=>localStorage.setItem(session,'{invalid'),session);await p.reload();await p.getByRole('alert').filter({hasText:'이 기기의 연결 정보를 읽지 못했어요.'}).waitFor();
  await p.evaluate(session=>localStorage.removeItem(session),session);await p.reload();await p.getByRole('heading',{name:'어떻게 이용하시겠어요?'}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`qa/patient-entry-${width}.png`,fullPage:true});
 }finally{await browser.close();}
});
