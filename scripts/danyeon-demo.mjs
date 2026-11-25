import { readFile } from 'node:fs/promises';
import { serveCare } from '../tests/helpers/care-http.mjs';
import { database, loadApi, request } from '../tests/helpers/care-server.mjs';

const root = 'out';
const page = await readFile(root + '/demo.html','utf8');
if (!page.includes('data-care-brand="danyeon"') || !page.includes('/__demo/patient')) {
  throw new Error('Build the private DANYEON export before starting this demo.');
}

delete process.env.TEST_SERVER_BUNDLE;
const { careApi } = await loadApi();
const DB = database();
const identities = {
  operator: {'oai-authenticated-user-email':'operator@danyeon.example.test','oai-authenticated-user-id':'demo-operator'},
  hospital: {'oai-authenticated-user-email':'desk@danyeon.example.test','oai-authenticated-user-id':'demo-hospital'},
  reviewer: {'oai-authenticated-user-email':'review@danyeon.example.test','oai-authenticated-user-id':'demo-reviewer'},
};
const env = { DB, CARE_ADMIN_EMAIL: identities.operator['oai-authenticated-user-email'], CARE_SMS_ENABLED:'false', CARE_PROGRAM_DEMO:true };

async function create(path, data, headers = identities.operator, method = 'POST') {
  const response = await careApi(request(path, method, data, headers), env);
  if (!response.ok) throw new Error('Demo initialization failed at ' + path);
  return response.json();
}

const hospital = await create('staff/hospitals',{name:'시연용 정형외과',organizationType:'병원',primaryDepartment:'정형외과',departments:['안과'],openingHours:'평일 09:00~17:00'});
await create('staff/members',{hospitalId:hospital.id,email:identities.hospital['oai-authenticated-user-email'],role:'hospital_admin'});
const sample = await create('staff/patients', {
  hospitalId:hospital.id, confirmed:true,
  patient:{name:'시연 환자 A',phone:'010-0000-0000',age:62,surgeryType:'인공관절',dischargeDate:new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'})},
}, identities.hospital);
await create('pilot', {
  hospital:'시연 문의 병원',contact:'시연 담당자',email:'pilot@danyeon.example.test',phone:'02-000-0000',
  version:'v2',department:'정형외과',monthlyVolume:'30명 이하',currentWorkflow:'전화·문자',adoptionGoal:'제품 시연',consent:true,
}, {});
const initialInvite = await create('staff/invitations',{hospitalId:hospital.id,patientId:sample.id},identities.hospital);

await create('staff/members',{hospitalId:hospital.id,email:identities.reviewer['oai-authenticated-user-email'],role:'doctor',departmentScope:'안과'});
const testProgram = await create('staff/programs',{
  hospitalId:hospital.id, name:'안과 구조 검증용 프로그램', department:'안과', treatment:'가상 시술', careDays:8, intervalDays:2,
  description:'질문 형식과 일정 전환을 확인하는 테스트 전용 설정', followupDays:2, completion:'end_on',
  instructions:'가상 문항입니다. 제품 구조 확인을 위해 예시 답변을 입력해 주세요.',
  questions:[
    {id:'example-choice',kind:'single',label:'가상 선택 항목을 골라주세요.',required:true,options:['예시 A','예시 B']},
    {id:'example-count',kind:'number',label:'예시 숫자를 입력해 주세요.',required:true,min:1,max:5},
  ],
},identities.hospital);
const version = {hospitalId:hospital.id,programId:testProgram.id,version:testProgram.version};
await create('staff/programs',{...version,state:'review'},identities.hospital,'PUT');
await create('staff/programs',{...version,state:'approved',approvalRef:'합성 QA 전용',confirmed:true},identities.reviewer,'PUT');
await create('staff/programs',{...version,state:'active'},identities.hospital,'PUT');
const expansion = await create('staff/patients',{
  hospitalId:hospital.id,confirmed:true,program:{id:testProgram.id,version:testProgram.version},
  patient:{name:'구조 검증 환자 B',phone:'010-0000-0000',age:54,careStartOn:sample.dischargeDate,dischargeDate:sample.dischargeDate},
},identities.hospital);
const expansionInvite = await create('staff/invitations',{hospitalId:hospital.id,patientId:expansion.id},identities.hospital);
const host = '127.0.0.1';
const serverOptions = {host, root};
const front = await serveCare(careApi,env,{
  ...serverOptions,port:3310,redirects:{
    '/__demo/patient': url => new URL('/i' + new URL(initialInvite.url).search, url.origin).href,
    '/__demo/expansion': url => new URL('/i' + new URL(expansionInvite.url).search, url.origin).href,
    '/__demo/hospital':'http://127.0.0.1:3311/care/server',
    '/signin-with-chatgpt':'http://127.0.0.1:3311/care/server',
    '/__demo/operator':'http://127.0.0.1:3312/care/server',
  },
});
async function deskApi(req, context) {
  const response = await careApi(req, context);
  if (req.method !== 'POST' || !req.url.endsWith('/staff/invitations') || !response.ok) return response;
  const invite = await response.json();
  const patientUrl = new URL('/i', front.base);
  patientUrl.search = new URL(invite.url).search;
  return new Response(JSON.stringify({...invite,url:patientUrl.href}),{status:response.status,headers:response.headers});
}

const redirects = {'/__demo/exit':front.base+'/demo'};
const desk = await serveCare(deskApi,env,{...serverOptions,port:3311,staffHeaders:identities.hospital,redirects});
const operator = await serveCare(careApi,env,{...serverOptions,port:3312,staffHeaders:identities.operator,redirects});
console.log('DANYEON local demo ' + front.base + '/demo');
console.log('Desk ' + desk.base + '/care/server');
console.log('Operator ' + operator.base + '/care/server');

for (const signal of ['SIGINT','SIGTERM']) process.once(signal,async()=>{
  await Promise.all([front.close(),desk.close(),operator.close()]);
  DB.db.close();
});
