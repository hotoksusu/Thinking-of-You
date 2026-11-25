import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { ADMIN, adminHeaders, database, loadApi, request } from './helpers/care-server.mjs';
import { serveCare } from './helpers/care-http.mjs';

const output='outputs/danyeon-v25';
const requestForm={version:'business-v1',hospital:'합성 제휴기관',contact:'합성 담당자',email:'partner@example.test',consent:true};

test('business inquiries reuse the restricted inbox without ingesting arbitrary fields',async()=>{
  const {careApi}=await loadApi(),DB=database(),env={DB,CARE_ADMIN_EMAIL:ADMIN};
  const call=(path,method,body,headers)=>careApi(request(path,method,body,headers),env);
  try{
    for(const input of [{...requestForm,businessPurpose:'invalid'},{...requestForm,businessPurpose:'investment',consent:false}]){
      assert.equal((await call('pilot','POST',input)).status,400);
    }
    const a={...requestForm,businessPurpose:'investment',patientName:'합성 환자 식별값'};
    const b={...requestForm,businessPurpose:'partnership'};
    assert.equal((await call('pilot','POST',a)).status,201);
    assert.equal((await call('pilot','POST',a)).status,200);
    assert.equal((await call('pilot','POST',b)).status,201);
    assert.equal((await call('staff/pilots','GET')).status,401);
    assert.equal((await call('staff/pilots','GET',undefined,{'oai-authenticated-user-id':'outsider','oai-authenticated-user-email':'outsider@example.test'})).status,403);
    const summary=await call('staff/pilots','GET',undefined,adminHeaders);
    assert.equal(summary.status,200);
    const {requests}=await summary.json();
    assert.deepEqual(requests.map(row=>row.businessPurpose).sort(),['investment','partnership']);
    assert.ok(requests.every(row=>row.consentVersion==='business-contact-v1'&&!('patientName' in row)));
    assert.equal(DB.db.prepare('SELECT count(*) AS count FROM care_patients').get().count,0);
  }finally{DB.db.close();}
});

test('public proposal supports discovery, share links, viewing controls, PDF and inquiry routes',{
  timeout:150000,skip:process.env.TEST_DANYEON_UI!=='1',
},async()=>{
  const {careApi}=await loadApi(),DB=database(),env={DB,CARE_ADMIN_EMAIL:ADMIN,CARE_SMS_ENABLED:'false'};
  const root=process.env.TEST_DANYEON_RELEASE==='1'?'dist/client':'out';
  const site=await serveCare(careApi,env,{host:'127.0.0.1',root});
  const operator=await serveCare(careApi,env,{host:'127.0.0.1',root,staffHeaders:adminHeaders});
  let browser;
  try{
    await mkdir(output,{recursive:true});
    const channel=process.env.TEST_PROPOSAL_BROWSER||'chrome';
    browser=await chromium.launch({channel});
    const page=await browser.newPage({serviceWorkers:'block',acceptDownloads:true,viewport:{width:1440,height:960}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const shot=async(name)=>{
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:output+'/'+channel+'-'+name+'.png',fullPage:false});
    };

    await page.goto(site.base);
    await page.getByRole('navigation',{name:'주요 메뉴',exact:true}).getByRole('link',{name:'서비스 소개',exact:true}).click();
    await page.waitForURL(site.base+'/overview');
    await shot('overview-1440');
    await page.getByRole('link',{name:'의료기관용 제안서 열기'}).click();
    await page.getByRole('heading',{name:'다녀온 의료기관용 상품소개서'}).waitFor();
    assert.equal(await page.locator('.proposal-sheet').count(),12);
    assert.equal(await page.locator('.proposal-sheet:visible').count(),12);
    await shot('proposal-1440');

    const toc=page.locator('.proposal-toc');
    await toc.locator('summary').click();
    assert.equal(await toc.locator('ol li').count(),12);
    await toc.getByRole('link',{name:'예약 및 일정관리'}).click();
    await page.waitForURL('**/overview/healthcare#schedule');
    await page.getByText('7 / 12',{exact:true}).first().waitFor();
    await page.keyboard.press('ArrowRight');
    await page.waitForURL('**/overview/healthcare#insights');
    await page.getByRole('button',{name:'프레젠테이션',exact:true}).click();
    assert.equal(await page.locator('.proposal-sheet:visible').count(),1);
    await page.locator('#insights:visible').waitFor();
    await page.getByRole('button',{name:'다음 쪽',exact:true}).click();
    await page.waitForURL('**/overview/healthcare#workflow');
    await page.getByRole('button',{name:'이전 쪽',exact:true}).click();
    await page.waitForURL('**/overview/healthcare#insights');

    await page.getByRole('button',{name:'전체 화면 보기',exact:true}).click();
    await page.waitForFunction(()=>Boolean(document.fullscreenElement)||document.querySelector('.proposal-view')?.getAttribute('data-immersive')==='true');
    await shot('presentation-1440');
    await page.getByRole('button',{name:'전체 화면 종료',exact:true}).click();
    await page.waitForFunction(()=>!document.fullscreenElement&&document.querySelector('.proposal-view')?.getAttribute('data-immersive')==='false');
    await page.evaluate(()=>Object.defineProperty(document,'fullscreenEnabled',{value:false,configurable:true}));
    await page.getByRole('button',{name:'전체 화면 보기',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.proposal-view')?.getAttribute('data-immersive')==='true');
    await page.waitForFunction(()=>document.querySelector('.overview-header')?.inert===true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>document.querySelector('.proposal-view')?.getAttribute('data-immersive')==='false');
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.proposal-sheet:visible').count(),12);
    assert.equal(await page.locator('.proposal-tools').isVisible(),false);
    await page.emulateMedia({media:'screen'});
    await page.getByRole('button',{name:'문서 보기',exact:true}).click();

    await page.goto(site.base+'/overview/healthcare#schedule');
    await page.waitForFunction(()=>location.hash==='#schedule'&&document.getElementById('schedule').getBoundingClientRect().top<220);
    await page.getByText('7 / 12',{exact:true}).first().waitFor();

    for(const width of [360,390,768,1280,1440]) {
      await page.setViewportSize({width,height:900});
      for(const route of ['/overview','/overview/healthcare','/overview/business','/contact/investment']){
        assert.equal((await page.goto(site.base+route)).status(),200);
        await page.evaluate(()=>document.fonts.ready);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,route+' at '+width);
        if(width===390&&route.startsWith('/overview')) await shot((route.split('/').at(-1))+'-390');
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(site.base);
    await page.locator('.landing-mobile-menu summary').click();
    await page.getByRole('navigation',{name:'모바일 주요 메뉴'}).getByRole('link',{name:'서비스 소개',exact:true}).click();
    await page.waitForURL(site.base+'/overview');

    await page.setViewportSize({width:1440,height:960});
    await page.goto(site.base+'/overview/healthcare#next-step');
    const final=page.locator('#next-step');
    const pdf=final.getByRole('link',{name:'PDF 다운로드',exact:true});
    const [download]=await Promise.all([page.waitForEvent('download'),pdf.click()]);
    assert.equal(download.suggestedFilename(),'danyeon-healthcare-v2.5.pdf');
    const downloaded=await readFile(await download.path());
    assert.equal(downloaded.subarray(0,5).toString(),'%PDF-');
    assert.ok(downloaded.byteLength>50000);
    await final.getByRole('link',{name:'제품 시연 문의',exact:true}).click();
    await page.waitForURL(site.base+'/contact?purpose=demo');
    await page.waitForFunction(()=>document.querySelector('#pilot-adoptionGoal')?.value==='제품 시연');
    assert.equal((await page.request.get(site.base+'/pilot')).status(),200);
    await page.goto(site.base+'/overview/healthcare#next-step');
    await page.locator('#next-step').getByRole('link',{name:'병원 도입 문의',exact:true}).click();
    await page.waitForURL(site.base+'/contact');

    for(const [route,label] of [['partnership','사업 제휴 문의'],['investment','투자 및 상세자료 요청']]){
      await page.goto(site.base+'/overview/business');
      await page.getByRole('link',{name:label,exact:true}).click();
      await page.waitForURL(site.base+'/contact/'+route);
      await page.getByRole('heading',{name:label,exact:true}).waitFor();
      await page.getByLabel('회사·기관명').fill('합성 사업 문의');
      await page.getByLabel('담당자명').fill('합성 담당자');
      await page.getByLabel('업무용 이메일').fill(route+'@example.test');
      await page.getByRole('checkbox').check();
      await page.getByRole('button',{name:'요청 접수',exact:true}).click();
      await page.getByRole('status').filter({hasText:'요청을 접수했습니다.'}).waitFor();
    }
    await page.goto(operator.base+'/care/server');
    await page.getByText('병원 파일럿 신청 관리',{exact:true}).click();
    await page.getByText('사업 제휴 문의',{exact:true}).waitFor();
    await page.getByText('투자 및 상세자료 요청',{exact:true}).waitFor();

    assert.equal((await page.request.get(site.base+'/api/care/staff/pilots')).status(),401);
    assert.equal((await page.request.get(site.base+'/overview/business/private')).status(),404);
    assert.equal((await page.request.get(site.base+'/docs/market-entry-strategy.md')).status(),404);
    await page.goto(site.base+'/demo');
    await page.getByRole('heading',{name:'개발 전용 화면입니다.'}).waitFor();
    await page.goto(site.base+'/hospital/login');
    await page.getByRole('link',{name:'병원 담당자 로그인',exact:true}).waitFor();
    assert.deepEqual(errors,[]);
  }finally{
    await browser?.close();
    await Promise.all([site.close(),operator.close()]);
    DB.db.close();
  }
});

test('private proposal opens the existing demo entry',{
  timeout:60000,skip:process.env.TEST_PROPOSAL_PRIVATE_DEMO!=='1',
},async()=>{
  const stub=async()=>new Response(null,{status:401});
  const site=await serveCare(stub,{}, {host:'127.0.0.1',root:'out'});
  let browser;
  try{
    browser=await chromium.launch({channel:'chrome'});
    const page=await browser.newPage({serviceWorkers:'block'});
    await page.goto(site.base+'/overview/healthcare#next-step');
    await page.getByRole('link',{name:'제품 체험하기',exact:true}).click();
    await page.waitForURL(site.base+'/demo');
    await page.getByRole('link',{name:'환자 체험 시작',exact:true}).waitFor();
    await page.getByRole('link',{name:'병원 담당자 체험 시작',exact:true}).waitFor();
  }finally{
    await browser?.close();
    await site.close();
  }
});
