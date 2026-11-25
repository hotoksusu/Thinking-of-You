import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { ADMIN, database, loadApi, provision } from './helpers/care-server.mjs';
import { serveCare } from './helpers/care-http.mjs';

const output='outputs/danyeon-v24';

test('landing shows the product workflow and routes each audience at six sizes', {
  skip:process.env.TEST_DANYEON_UI!=='1',timeout:150000,
}, async()=>{
  const {careApi}=await loadApi(), DB=database(), env={DB,CARE_ADMIN_EMAIL:ADMIN,CARE_SMS_ENABLED:'false'};
  const fixture=await provision(careApi,env);
  const demo=process.env.TEST_LANDING_DEMO==='1';
  const site=await serveCare(careApi,env,{host:'127.0.0.1',root:demo?'out':'dist/client'});
  let browser;
  try {
    await mkdir(output,{recursive:true});
    browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||'chrome'});
    const page=await browser.newPage({serviceWorkers:'block'});
    const brokenAssets=[],errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{
      if(['script','stylesheet','font','image'].includes(response.request().resourceType()) && response.status()>=400 && new URL(response.url()).origin===site.base) brokenAssets.push(new URL(response.url()).pathname);
    });
    await page.addInitScript(()=>{
      window.landingShift=0;
      if(PerformanceObserver.supportedEntryTypes.includes('layout-shift')){
        new PerformanceObserver(list=>{
          for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.landingShift+=entry.value;
        }).observe({type:'layout-shift',buffered:true});
      }
    });

    if(demo) {
      await page.goto(site.base);
      await page.getByRole('link',{name:'무료 데모 체험',exact:true}).click();
      await page.waitForURL(site.base+'/demo');
      await page.getByRole('link',{name:'환자 체험 시작',exact:true}).waitFor();
      await page.getByRole('link',{name:'병원 담당자 체험 시작',exact:true}).waitFor();
      return;
    }

    const data=[];
    for(const width of [360,390,768,1280,1440,1920]) {
      await page.setViewportSize({width,height:width>900?1000:844});
      const response=await page.goto(site.base);
      assert.equal(response.status(),200);
      const heading=page.getByRole('heading',{level:1,name:/환자관리는 더 체계적으로/});
      await heading.waitFor();
      await page.evaluate(()=>document.fonts.ready);
      const metrics=await heading.evaluate(element=>{
        const style=getComputedStyle(element), lead=document.querySelector('.landing-lead'), hero=document.querySelector('.landing-hero'), button=hero.querySelector('.landing-button-primary');
        const lines=[...element.children].map(span=>{
          const range=document.createRange(); range.selectNodeContents(span);
          return range.getClientRects().length;
        });
        const color=(node,key)=>getComputedStyle(node)[key];
        const relative=colorString=>{
          const values=colorString.match(/[\d.]+/g).slice(0,3).map(x=>Number(x)/255);
          return values.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((t,x,i)=>t+x*[.2126,.7152,.0722][i],0);
        };
        const contrast=(a,b)=>{
          const c=[relative(a),relative(b)].sort((x,y)=>y-x);
          return (c[0]+.05)/(c[1]+.05);
        };
        const bg=color(hero,'backgroundColor');
        return {
          width:innerWidth,documentWidth:document.documentElement.scrollWidth,
          headingSize:parseFloat(style.fontSize),lines,family:style.fontFamily,tracking:style.letterSpacing,
          loaded:document.fonts.check('700 16px "Pretendard Care"','다녀온'),
          ctaHeight:button.getBoundingClientRect().height,
          bodyColor:color(lead,'color'),bodyContrast:contrast(color(lead,'color'),bg),headlineContrast:contrast(color(element.children[1],'color'),bg),
          ctaContrast:contrast(color(button,'color'),color(button,'backgroundColor')),
          elapsed:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),
          initialCLS:window.landingShift,
        };
      });
      assert.equal(metrics.documentWidth,width);
      assert.deepEqual(metrics.lines,[1,1],'hero line wrap at '+width);
      assert.match(metrics.family,/Pretendard Care/);
      assert.equal(metrics.loaded,true);
      assert.ok(metrics.ctaHeight>=48 && metrics.ctaHeight<=56);
      assert.equal(metrics.bodyColor,'rgb(82, 101, 128)');
      for(const value of [metrics.bodyContrast,metrics.headlineContrast,metrics.ctaContrast]) assert.ok(value>=4.5);
      assert.ok(metrics.initialCLS<=.1,'initial CLS '+metrics.initialCLS);

      assert.equal(await page.locator('.landing-values > div').count(),3);
      assert.equal(await page.locator('#how-it-works li').count(),4);
      assert.equal(await page.locator('#get-started li').count(),3);
      assert.equal(await page.locator('#products article').count(),3);
      const visual=page.locator('img[src^="/brand/product/"]');
      for(const img of await visual.all()) {
        await img.scrollIntoViewIfNeeded();
        const sharp=await img.evaluate(async image=>{
          await image.decode();
          return image.naturalWidth>=image.getBoundingClientRect().width && image.naturalHeight>0;
        });
        assert.equal(sharp,true);
      }
      data.push(metrics);
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:output+'/after-landing-'+width+'.png',fullPage:true});
      if([390,1440].includes(width)) {
        await page.locator('.landing-hero').screenshot({path:output+'/after-hero-'+width+'.png'});
        for(const [id,name] of [['how-it-works','how'],['products','products'],['get-started','get-started']]){
          await page.locator('#'+id).screenshot({path:output+'/after-'+name+'-'+width+'.png'});
        }
      }
    }
    await writeFile(output+'/metrics.json',JSON.stringify(data,null,2));
    await page.setViewportSize({width:390,height:844});
    await page.goto(site.base);
    const menu=page.locator('.landing-mobile-menu');
    await menu.locator('summary').press('Enter');
    const mobileNav=page.getByRole('navigation',{name:'모바일 주요 메뉴'});
    await mobileNav.getByRole('link',{name:'도입 안내',exact:true}).click();
    await page.waitForURL(site.base+'/#get-started');
    assert.equal(await menu.evaluate(element=>element.open),false);
    await menu.locator('summary').press('Enter');
    await menu.locator('summary').press('Escape');
    assert.equal(await menu.evaluate(element=>element.open),false);
    const faq=page.getByText('환자가 앱을 설치해야 하나요?',{exact:true});
    await faq.press('Enter');
    assert.equal(await faq.locator('..').evaluate(element=>element.open),true);
    await page.goto(site.base+'/overview');
    await page.goto(site.base+'/#how-it-works');
    await page.getByRole('heading',{name:/환자 등록부터 후속관리까지/}).waitFor();
    await page.waitForFunction(()=>Math.abs(document.getElementById('how-it-works').getBoundingClientRect().top)<90);

    await page.locator('.landing-hero').getByRole('link',{name:'데모 시연 문의'}).click();
    await page.waitForURL(site.base+'/pilot?purpose=demo');
    await page.waitForFunction(()=>document.querySelector('#pilot-adoptionGoal')?.value==='제품 시연');
    await page.goto(site.base);
    await page.locator('.landing-hero').getByRole('link',{name:'병원 도입 문의'}).click();
    await page.waitForURL(site.base+'/pilot');
    assert.equal(await page.locator('#pilot-adoptionGoal').inputValue(),'');
    await page.goto(site.base);
    await page.locator('.landing-mobile-menu summary').click();
    await mobileNav.getByRole('link',{name:'병원 로그인',exact:true}).click();
    await page.getByRole('link',{name:'병원 담당자 로그인',exact:true}).waitFor();
    await page.goto(site.base);
    await page.getByRole('link',{name:'병원에서 안내받은 환자이신가요?'}).click();
    await page.waitForURL(site.base+'/patient');

    await page.goto(site.base+'/?token='+new URL(fixture.invite.url).searchParams.get('token'));
    await page.waitForURL('**/i?token=*');
    await page.getByRole('button',{name:'내 기록으로 연결하기'}).waitFor();
    await page.route('**/fonts/**',route=>route.abort());
    await page.goto(site.base);
    await page.evaluate(()=>document.fonts.ready);
    const fallback=await page.locator('.danyeon-landing').evaluate(el=>getComputedStyle(el).fontFamily);
    assert.match(fallback,/Malgun Gothic/);
    await page.evaluate(()=>{document.documentElement.style.zoom='2';});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),false);
    assert.deepEqual(errors,[]);
    assert.deepEqual(brokenAssets,[]);
  } finally {
    await browser?.close();
    await site.close();
    DB.db.close();
  }
});
