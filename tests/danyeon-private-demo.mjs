import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { test } from 'node:test';

test('loopback demo offers the legacy and expansion scenarios in an isolated process', {
  skip:process.env.TEST_DANYEON_PRIVATE_DEMO!=='1',timeout:30000,
},async()=>{
  const child=spawn(process.execPath,['scripts/danyeon-demo.mjs'],{stdio:['ignore','pipe','pipe'],windowsHide:true});
  let log='',errors='';
  try {
    child.stderr.on('data',chunk=>{errors+=chunk;});
    await Promise.race([
      new Promise(resolve=>child.stdout.on('data',chunk=>{log+=chunk;if(log.includes('Operator http://127.0.0.1:3312'))resolve();})),
      once(child,'exit').then(([code])=>{throw Error('Demo exited before readiness: '+code+' '+errors);}),
      new Promise((_,reject)=>setTimeout(()=>reject(Error('Loopback demo did not start')),12000).unref()),
    ]);
    const front='http://127.0.0.1:3310',desk='http://127.0.0.1:3311',operator='http://127.0.0.1:3312';
    const page=await (await fetch(front+'/demo')).text();
    assert.match(page,/\/__demo\/patient/);
    assert.match(page,/\/__demo\/expansion/);
    assert.match(page,/data-care-demo="local"/);
    assert.equal((await fetch(front+'/api/care/staff/state')).status,401);
    assert.equal((await fetch(desk+'/api/care/staff/pilots')).status,403);
    const {state}=await (await fetch(desk+'/api/care/staff/state')).json();
    assert.equal(state.patients.length,2);
    assert.ok(state.patients.some(p=>!p.enrollment));
    const program=state.patients.find(p=>p.enrollment).enrollment;
    assert.equal(program.demo,true);
    assert.equal(program.intervalDays,2);
    const ops=await (await fetch(operator+'/api/care/staff/state')).json();
    assert.equal(ops.state.patients.length,0);

    const redirect=await fetch(front+'/__demo/expansion',{redirect:'manual'});
    assert.equal(redirect.status,303);
    const url=new URL(redirect.headers.get('location'));
    assert.equal(url.origin,front);
    const preview=await fetch(front+'/api/care/invitation',{
      method:'POST',headers:{Origin:front,'Content-Type':'application/json'},
      body:JSON.stringify({token:url.searchParams.get('token')}),
    });
    assert.equal(preview.status,200);
    assert.equal((await preview.json()).programName,program.name);
    assert.equal((await fetch(desk+'/__demo/exit',{redirect:'manual'})).headers.get('location'),front+'/demo');
  } finally {
    if (child.exitCode===null) {child.kill();await once(child,'exit');}
  }
});
