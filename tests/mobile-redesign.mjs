import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
const base='http://localhost:3100',key='oneul-anbu:public-demo:care-mvp:v5';
test('mobile redesign: responsive entry, real record lifecycle, help, persistence and failure',{timeout:240000},async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 for(const width of [360,375,390,430,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',permissions:['clipboard-read','clipboard-write']});const p=await context.newPage();
  await p.goto(base);await p.getByRole('heading',{name:/퇴원 후 환자관리.*확인이 필요한 환자부터/}).waitFor();
  await p.screenshot({path:`qa/redesign-landing-${width}.png`,fullPage:true});
  const cta=p.getByRole('link',{name:'병원에서 링크를 받았어요 · 환자 이용 안내'});assert.equal(await cta.getAttribute('href'),'/patient');assert.ok((await cta.boundingBox()).y<900);
  await p.getByText('메뉴',{exact:true}).click();await p.getByRole('link',{name:'병원 로그인',exact:true}).waitFor();await p.getByText('메뉴',{exact:true}).click();
  await p.goto(base+'/demo/patient'); // Internal development QA, never a public patient CTA.await p.getByRole('heading',{name:'오늘 몸은 좀 어떠세요?'}).waitFor();
  assert.equal(await p.getByRole('link',{name:'오늘 상태 기록하기'}).count(),0);
  await p.getByRole('button',{name:'보통이에요',exact:true}).click();assert.equal(await p.getByRole('button',{name:'보통이에요',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:`qa/redesign-today-${width}.png`,fullPage:true});
  await p.getByRole('link',{name:'오늘 상태 기록하기'}).click();await p.getByRole('button',{name:'통증 1점',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();
  await p.getByRole('button',{name:'어제와 비슷해요',exact:true}).waitFor();
  await p.getByRole('link',{name:'병원 안내',exact:true}).click();await p.getByRole('heading',{name:'도움이 필요할 때'}).waitFor();
  assert.equal(await p.getByRole('link',{name:'119 전화하기'}).getAttribute('href'),'tel:119');assert.equal(await p.getByText('02-000-0000',{exact:true}).count(),0);
  await p.screenshot({path:`qa/redesign-hospital-${width}.png`,fullPage:true});
  await p.getByRole('link',{name:'오늘',exact:true}).click();await p.getByRole('button',{name:'보통이에요',exact:true}).click();await p.getByRole('link',{name:'오늘 상태 기록하기'}).click();
  await p.getByRole('button',{name:'어제와 비슷해요',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'비슷해요',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'새롭게 불편해진 점은 없어요',exact:true}).click();
  if(width===360){await p.evaluate(()=>{window.__set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='oneul-anbu:public-demo:care-mvp:v5')throw new DOMException('quota','QuotaExceededError');return window.__set.call(this,k,v)}});await p.getByRole('button',{name:'오늘 기록 마치기'}).click();await p.getByRole('alert').filter({hasText:'저장하지 못했어요'}).waitFor();await p.evaluate(()=>Storage.prototype.setItem=window.__set);}
  await p.getByRole('button',{name:'오늘 기록 마치기'}).click();await p.getByRole('heading',{name:'샘플 안부를 기록했어요.'}).waitFor();
  await p.screenshot({path:`qa/redesign-completed-${width}.png`,fullPage:true});
  const count=()=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)).checkIns.filter(c=>c.patientId==='patient_001'&&c.initialCondition==='보통이에요').length,key);assert.equal(await count(),1);
  await p.getByRole('link',{name:'오늘 화면으로',exact:true}).click();await p.getByRole('heading',{name:'샘플 안부를 기록했어요.'}).waitFor();await p.getByText('보통이에요 · 통증 1점',{exact:false}).waitFor();
  await p.getByRole('link',{name:'오늘 기록 수정하기'}).click();await p.getByRole('button',{name:'통증 2점',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'다음',exact:true}).click();await p.getByRole('button',{name:'오늘 기록 마치기'}).click();await p.getByRole('heading',{name:'샘플 안부를 기록했어요.'}).waitFor();
  await p.goto(base+'/demo/patient?mode=checkin');await p.getByRole('heading',{name:'샘플 안부를 기록했어요.'}).waitFor();
  await p.getByRole('link',{name:'병원 안내',exact:true}).click();await p.getByRole('button',{name:'회복 중 불편한 증상이 있어요'}).click();await p.getByRole('link',{name:'병원 문의 경로 확인'}).waitFor();
  await p.getByText('의료진에게 보여줄 최근 상태 요약').click();await p.getByRole('button',{name:'요약 복사하기'}).click();await p.getByRole('status').filter({hasText:'상태 요약을 복사했어요.'}).waitFor();
  await p.getByRole('button',{name:'병원 연락처 찾는 방법'}).click();await p.getByRole('link',{name:'병원 공식 연락처 검색'}).waitFor();
  await p.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));Object.assign(s.hospitals.find(h=>h.id==='hospital_001'),{phone:'02-111-2222',address:'테스트 주소',openingHours:'평일 09:00–17:00'});localStorage.setItem(key,JSON.stringify(s));},key);await p.reload();await p.getByRole('link',{name:'전화하기',exact:true}).waitFor();assert.equal(await p.getByRole('link',{name:'전화하기',exact:true}).getAttribute('href'),'tel:021112222');assert.match(await p.getByRole('link',{name:'길찾기'}).getAttribute('href'),/destination=/);
  await p.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await context.close();console.log('PASS viewport',width);
 }
 }finally{await browser.close();}
});
