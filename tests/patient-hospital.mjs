import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
import fs from 'node:fs';
import ts from 'typescript';
const compiled=ts.transpileModule(fs.readFileSync('src/lib/patient-appointment.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {patientAppointment}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
test('appointment uses Seoul date, separates past, today, upcoming and missing',()=>{
 const now=new Date('2026-09-28T15:30:00Z');
 assert.equal(patientAppointment('2026-09-29',now).state,'today');
 assert.equal(patientAppointment('2026-09-28',now).state,'past');
 assert.equal(patientAppointment('2026-10-08T10:30:00+09:00',now).days,9);
 assert.match(patientAppointment('2026-10-08T10:30:00+09:00',now).label,/10:30/);
 for(const v of [undefined,'','invalid','2026-02-30'])assert.equal(patientAppointment(v,now).state,'noAppointment');
});
for(const width of [1440,390])test(`hospital guide ${width}`,{timeout:120000},async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width,height:900}});
 try{
  await page.goto('http://127.0.0.1:3200/demo/patient?mode=hospital');
  await page.getByRole('heading',{name:'어떤 도움이 필요하세요?'}).waitFor();
  assert.equal(await page.locator('nav [aria-current="page"]').innerText(),'병원 안내');
  await page.getByText('데모용 예시 정보 · 실제 병원 연락처가 아닙니다.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('link',{name:'119 전화하기'}).count(),0);
  await page.getByRole('button',{name:'전화하기',exact:true}).click();await page.getByRole('status').waitFor();
  await page.getByRole('button',{name:'긴급한 증상이 있어요'}).click();
  assert.equal(await page.getByRole('link',{name:'119 전화하기'}).getAttribute('href'),'tel:119');
  await page.getByRole('button',{name:'긴급한 증상이 있어요'}).click();assert.equal(await page.getByRole('link',{name:'119 전화하기'}).count(),0);
  await page.getByRole('button',{name:'보호자 도움 안내'}).click();
  assert.equal(await page.getByRole('link',{name:'이 기기에서 함께 입력하기 →'}).count(),0);
  await page.getByRole('checkbox').check();
  await page.getByRole('link',{name:'이 기기에서 함께 입력하기 →'}).click();
  await page.waitForURL(/proxy=guardian/);assert.ok(page.url().includes('/demo/patient'));
  await page.goto('http://127.0.0.1:3200/demo/patient?mode=hospital');
  // Test-only registered contact fixture; never publish invented contact details.
  await page.evaluate(()=>{const k='oneul-anbu:public-demo:care-mvp:v5',s=JSON.parse(localStorage.getItem(k));Object.assign(s.hospitals.find(h=>h.id==='hospital_001'),{phone:'02-000-0000',address:'서울시 테스트 주소',openingHours:'평일 09:00–18:00'});s.patients.find(p=>p.id==='patient_001').nextAppointment='2000-01-01';localStorage.setItem(k,JSON.stringify(s));});
  await page.reload();await page.getByRole('heading',{name:'예정된 다음 진료가 없어요.'}).waitFor();
  assert.equal(await page.locator('#past-appointment').count(),0);await page.getByRole('button',{name:'지난 진료 보기'}).click();await page.locator('#past-appointment').waitFor();await page.getByRole('button',{name:'지난 진료 접기'}).click();
  assert.equal(await page.getByRole('link',{name:'전화하기',exact:true}).getAttribute('href'),'tel:020000000');
  assert.match(await page.getByRole('link',{name:'길찾기 · 새 창 →'}).getAttribute('href'),/^https:\/\/www.google.com\/maps\/dir/);
  await page.getByRole('link',{name:'병원에 문의하기'}).click();assert.ok(page.url().endsWith('#hospital-contact'));
  for(const [value,heading] of [[new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date()),'오늘 진료가 있어요'],['2999-10-08','다음 진료'],['','예정된 다음 진료가 없어요.']]){
   await page.evaluate(value=>{const k='oneul-anbu:public-demo:care-mvp:v5',s=JSON.parse(localStorage.getItem(k));s.patients.find(p=>p.id==='patient_001').nextAppointment=value;localStorage.setItem(k,JSON.stringify(s));},value);
   await page.reload();await page.getByText(heading,{exact:true}).waitFor();
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  const boxes=await page.evaluate(()=>({nav:document.querySelector('nav').getBoundingClientRect().top,last:document.querySelector('main section:last-of-type').getBoundingClientRect().bottom,width:document.querySelector('main>div').getBoundingClientRect().width}));assert.ok(boxes.last<=boxes.nav);if(width===1440)assert.equal(boxes.width,640);
  await page.screenshot({path:`qa/patient-hospital-${width}.png`,fullPage:true});
  await page.getByRole('link',{name:'회복 기록 보기 →',exact:true}).click();
  await page.getByRole('heading',{name:'회복 기록',exact:true}).waitFor();
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('oneul-anbu:public-demo:care-mvp:v5'));delete s.hospitals.find(h=>h.id==='hospital_001').phone;localStorage.setItem('oneul-anbu:care-mvp:v1',JSON.stringify(s));localStorage.setItem('oneul-anbu:demo:patient-session',JSON.stringify({kind:'patient',patientId:'patient_001',hospitalId:'hospital_001',expiresAt:'2999-01-01'}));});
  await page.goto('http://127.0.0.1:3200/app/patient/hospital');
  await page.getByRole('button',{name:'병원 연락처 찾는 방법 →'}).click();
  assert.match(await page.getByRole('link',{name:'병원 공식 연락처 검색 · 새 창 →'}).getAttribute('href'),/^https:\/\/www.google.com\/search/);
  assert.equal(await page.getByText('데모용 예시 정보 · 실제 병원 연락처가 아닙니다.',{exact:true}).count(),0);
  // Manager registration must persist to the patient-visible hospital data.
  await page.goto('http://127.0.0.1:3200/demo/hospital');
  await page.getByLabel('역할 전환').selectOption('owner');
  await page.goto('http://127.0.0.1:3200/demo/hospital?view=settings');
  await page.getByLabel('대표전화',{exact:true}).fill('02-111-2222');
  await page.getByLabel('진료시간',{exact:true}).fill('평일 09:00–17:00');
  await page.getByLabel('주소',{exact:true}).fill('테스트 등록 주소');
  await page.getByRole('button',{name:'연락 정보 저장'}).click();
  await page.getByText('병원 연락 정보를 저장했어요.',{exact:true}).waitFor();
  await page.goto('http://127.0.0.1:3200/demo/patient?mode=hospital');
  assert.equal(await page.getByRole('link',{name:'전화하기',exact:true}).getAttribute('href'),'tel:021112222');
 }finally{await browser.close();}
});
