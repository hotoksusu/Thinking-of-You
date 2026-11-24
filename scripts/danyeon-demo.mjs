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
};
const env = { DB, CARE_ADMIN_EMAIL: identities.operator['oai-authenticated-user-email'], CARE_SMS_ENABLED:'false' };

async function create(path, data, headers = identities.operator) {
  const response = await careApi(request(path, 'POST', data, headers), env);
  if (!response.ok) throw new Error('Demo initialization failed at ' + path);
  return response.json();
}

const hospital = await create('staff/hospitals',{name:'시연용 정형외과', openingHours:'평일 09:00~17:00'});
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

const host = '127.0.0.1';
const serverOptions = {host, root};
const front = await serveCare(careApi,env,{
  ...serverOptions,port:3310,redirects:{
    '/__demo/patient': url => new URL('/i' + new URL(initialInvite.url).search, url.origin).href,
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
