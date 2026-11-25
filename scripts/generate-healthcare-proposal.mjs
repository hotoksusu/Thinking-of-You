import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { serveCare } from '../tests/helpers/care-http.mjs';

const site=await serveCare(async()=>new Response(null,{status:404}),{}, {host:'127.0.0.1',root:process.env.PROPOSAL_STATIC_ROOT||'out'});
let browser;
try {
  browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||'chrome'});
  const page=await browser.newPage({viewport:{width:1440,height:960},serviceWorkers:'block'});
  const response=await page.goto(site.base+'/overview/healthcare');
  assert.equal(response.status(),200);
  const download=await page.locator('.proposal-page-title a[download]').getAttribute('href');
  assert.match(download||'', /^\/overview\/danyeon-healthcare-v\d+\.\d+\.pdf$/);
  const source=await page.locator('.proposal-sheet').count();
  assert.ok(source>=10,'proposal content missing');
  await page.emulateMedia({media:'print'});
  const result=await page.evaluate(async()=>{
    const images=[...document.querySelectorAll('.proposal-sheet img')];
    for(const image of images) image.loading='eager';
    await Promise.all(images.map(image=>image.decode()));
    const faces=await Promise.all([400,700].map(weight=>document.fonts.load(weight+' 16px "Pretendard Care"','의료기관 제안서')));
    await document.fonts.ready;
    return {
      font:faces.every(face=>face.length>0),
      clipped:[...document.querySelectorAll('.proposal-sheet')].filter(el=>el.scrollHeight>el.clientHeight+1).map(el=>el.id),
      visible:[...document.querySelectorAll('.proposal-sheet')].filter(el=>getComputedStyle(el).display!=='none').length,
    };
  });
  assert.equal(result.font,true);
  assert.deepEqual(result.clipped,[]);
  assert.equal(result.visible,source);
  await mkdir('public/overview',{recursive:true});
  await page.pdf({path:'public'+download,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,tagged:true});
  console.log('Generated healthcare proposal from '+source+' print sheets.');
} finally {
  await browser?.close();
  await site.close();
}

