import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
// Exercise the exported production bundle, not next dev's development-only demo.
test('production demo routes never mount sample clients',{timeout:90000},async()=>{
 const root=path.resolve('out');
 const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),target=path.resolve(root,'.'+pathname);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}let file;for(const candidate of [target,target+'.html',path.join(target,'index.html')]){try{if((await stat(candidate)).isFile()){file=candidate;break;}}catch{}}if(!file){res.writeHead(404).end();return;}const data=await readFile(file),ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.txt':'text/plain'})[ext]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch({channel:'msedge',headless:true});
 try{const p=await b.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});for(const route of ['/demo','/demo/patient?mode=checkin','/demo/hospital','/demo/hospital/patient','/demo/hospital/complete']){
  await p.goto(base+route);await p.getByRole('heading',{name:'개발 전용 화면입니다.'}).waitFor();await p.waitForLoadState('networkidle');assert.equal(await p.getByRole('button',{name:/오늘 기록|통증|역할/}).count(),0);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage).filter(k=>/care-mvp|public-demo|patient-session/.test(k))),[]);
 }
 await p.screenshot({path:'qa/demo-production-blocked-390.png',fullPage:true});
 await p.evaluate(()=>{localStorage.setItem('oneul-anbu:demo:hospital-session',JSON.stringify({kind:'hospital',sessionId:'qa',userId:'hu_a_nurse',hospitalId:'hospital_001',role:'nurse',expiresAt:'2999-01-01'}));});await p.goto(base+'/demo/patient');await p.getByRole('heading',{name:'개발 전용 화면입니다.'}).waitFor();assert.equal(await p.evaluate(()=>localStorage.getItem('oneul-anbu:public-demo:care-mvp:v5')),null);
 await p.getByRole('link',{name:'병원 링크 이용 안내',exact:true}).click();await p.getByRole('heading',{name:/병원에서 오늘안부를 안내받으셨나요/}).waitFor();assert.equal(await p.getByRole('link',{name:/체험|샘플/}).count(),0);
 }finally{await b.close();await new Promise(resolve=>server.close(resolve));}
});
