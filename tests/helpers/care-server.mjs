import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const dataUrl=code=>'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
export async function loadApi() {
  if (process.env.TEST_SERVER_BUNDLE) {
    const compiled = await import(dataUrl(fs.readFileSync(process.env.TEST_SERVER_BUNDLE,'utf8')));
    return { careApi:(request,env,context)=>compiled.default.fetch(request,env,context) };
  }
  const read = file => fs.readFileSync(file,'utf8');
  const transpile = file => dataUrl(ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText);
  const program = transpile('src/lib/recovery-program.ts');
  const rules = transpile('src/lib/status-rules.ts');
  const sms = dataUrl(read('server/care-sms.mjs'));
  const programs = dataUrl(read('server/care-programs.mjs').replace("'./recovery-program.js'",JSON.stringify(program)));
  const ops = dataUrl(read('server/care-operations.mjs').replace("'./care-programs.js'",JSON.stringify(programs)).replace("'./care-sms.js'",JSON.stringify(sms)).replace("'./recovery-program.js'",JSON.stringify(program)));
  return import(dataUrl(read('server/care-api.mjs')
    .replace("'./care-sms.js'",JSON.stringify(sms))
    .replace("'./care-programs.js'",JSON.stringify(programs))
    .replace("'./recovery-program.js'",JSON.stringify(program))
    .replace("'./care-operations.js'",JSON.stringify(ops))
    .replace("'./status-rules.js'",JSON.stringify(rules))));
}
export function database(filename=':memory:',initialize=true){const db=new DatabaseSync(filename);db.exec('PRAGMA foreign_keys=ON');if(initialize){for(const name of fs.readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+name,'utf8'));}const prepare=sql=>({bind(...args){return statement(sql,args);},...statement(sql,[])});function statement(sql,args){return {async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};}return {db,prepare,async batch(statements){db.exec('BEGIN');try{const results=[];for(const stmt of statements)results.push(await stmt.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}}};}
export const ADMIN='owner-qa@example.test';
export function request(path,method='GET',body,headers={}){return new Request('https://care.example.test/api/care/'+path,{method,headers:{...method!=='GET'?{'Origin':'https://care.example.test','Content-Type':'application/json'}:{},...headers},body:body===undefined?undefined:JSON.stringify(body)});}
export const adminHeaders={'oai-authenticated-user-id':'site-owner-qa','oai-authenticated-user-email':ADMIN};
export async function provision(api,env){const call=async(path,body)=>{const r=await api(request(path,'POST',body,adminHeaders),env);if(!r.ok)throw new Error(await r.text());return r.json();};const hospital=await call('staff/hospitals',{name:'테스트 전용 병원',phone:'02-111-2222',address:'테스트 주소',openingHours:'테스트 운영시간'});env.DB.db.prepare("INSERT INTO care_staff(email,hospital_id,role) VALUES(?,?,'hospital_admin')").run(ADMIN,hospital.id);const patient=await call('staff/patients',{hospitalId:hospital.id,patient:{name:'QA 환자',phone:'010-0000-0000',age:60,surgeryType:'기타',dischargeDate:new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'})},confirmed:true}),invite=await call('staff/invitations',{hospitalId:hospital.id,patientId:patient.id});return {hospital,patient,invite};}
