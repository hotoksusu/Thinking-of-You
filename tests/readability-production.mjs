import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {loadApi,database,ADMIN} from './helpers/care-server.mjs';
import {serveCare} from './helpers/care-http.mjs';
test('production export: public route assets, local font, menu and privacy work without script errors',{timeout:90000},async()=>{
 const {careApi}=await loadApi(),DB=database(),server=await serveCare(careApi,{DB,CARE_ADMIN_EMAIL:ADMIN}),browser=await chromium.launch({channel:'chrome',headless:true});const errors=[],badAssets=[],results=[];
 try{const page=await browser.newPage({viewport:{width:390,height:900},serviceWorkers:'block'});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(['script','stylesheet','font','image'].includes(r.request().resourceType())&&r.status()>=400&&new URL(r.url()).origin===server.base)badAssets.push({url:new URL(r.url()).pathname,status:r.status()});});
 for(const route of ['/','/patient','/hospital','/hospital/login','/company','/settings/privacy','/help','/care/server','/care/privacy','/demo/patient','/demo/hospital']){const response=await page.goto(server.base+route);assert.equal(response.status(),200,route);await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);results.push({route,status:response.status()});}
 await page.goto(server.base+'/patient');assert.equal(await page.evaluate(()=>document.fonts.check('18px "Pretendard Care"')),true);assert.equal(await page.getByRole('button',{name:'링크 여는 방법 확인'}).evaluate(e=>getComputedStyle(e).fontSize),'18px');await page.getByRole('button',{name:'큰 글씨',exact:true}).click();await page.reload();await page.waitForFunction(()=>document.querySelector('.patient-ui')?.getAttribute('data-text-size')==='large');
 await page.goto(server.base+'/hospital/login');assert.equal(await page.getByRole('textbox',{name:'비밀번호'}).count(),0);const login=page.getByRole('link',{name:'병원 담당자 로그인',exact:true});assert.match(await login.getAttribute('href'),/^\/signin-with-chatgpt/);assert.equal(await login.getAttribute('target'),'_top');assert.equal((await page.request.get(server.base+'/api/care/staff/state')).status(),401);
 assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);fs.writeFileSync('qa/readability/production-assets.json',JSON.stringify({results,pageErrors:errors,failedSameOriginAssets:badAssets,unverified:'Real hosted SSO and real device screen readers'},null,2));
 }finally{await browser.close();await server.close();DB.db.close();}
});
