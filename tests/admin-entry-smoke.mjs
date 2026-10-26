import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chromium} from 'playwright';
test('existing administrator access remains scoped',{timeout:60000},async()=>{const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage();try{await p.goto('http://localhost:3100/admin');await p.getByRole('heading',{name:'이 화면을 이용할 권한이 없습니다.'}).waitFor();await p.evaluate(()=>localStorage.setItem('oneul-anbu:demo:operator-session',JSON.stringify({kind:'operator',sessionId:'qa',userId:'op_001',role:'super_admin',expiresAt:'2999-01-01',mfaVerified:true})));await p.reload();await p.getByRole('heading',{name:'병원 운영 현황'}).waitFor();assert.equal(await p.getByRole('heading',{name:'이 화면을 이용할 권한이 없습니다.'}).count(),0);}finally{await b.close()}});
