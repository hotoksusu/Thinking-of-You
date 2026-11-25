import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { ADMIN, adminHeaders, database, loadApi, request } from './helpers/care-server.mjs';
import { serveCare } from './helpers/care-http.mjs';

const day = () => new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
const previousDay = () => new Date(Date.parse(day()) - 86400000).toISOString().slice(0,10);
const roleHeaders = name => ({'oai-authenticated-user-id':'qa-'+name,'oai-authenticated-user-email':name+'@example.test'});
const desk = roleHeaders('desk-program');
const reviewer = roleHeaders('doctor-eye');
const otherDoctor = roleHeaders('doctor-ortho');
const nurse = roleHeaders('nurse-eye');

const draft = {
  name:'가상 확장 프로그램',department:'안과',treatment:'가상 시술',description:'합성 전용',
  careDays:8,intervalDays:2,followupDays:2,completion:'end_on',instructions:'가상 안내',
  reviewInstructions:'응답을 확인하는 구조 검증',
  questions:[
    {id:'choice',kind:'single',required:true,label:'예시 항목을 골라주세요.',options:['첫 번째','두 번째']},
    {id:'number',kind:'number',required:true,label:'예시 숫자를 입력해 주세요.',min:1,max:5},
    {id:'boolean',kind:'boolean',required:true,label:'예시 확인 여부',},
    {id:'note',kind:'text',required:false,label:'예시 추가 기록',},
  ],
};

async function fixture() {
  const DB = database(), {careApi} = await loadApi();
  const env = {DB,CARE_ADMIN_EMAIL:ADMIN,CARE_PROGRAM_DEMO:true,CARE_SMS_ENABLED:'false'};
  const call = (path,method='GET',body,headers=desk,context=env) => careApi(request(path,method,body,headers),context);
  async function send(path,method,body,headers,status,context) {
    const response = await call(path,method,body,headers,context), data = await response.json();
    assert.equal(response.status,status,path+': '+JSON.stringify(data));
    return data;
  }
  try {
    const hospital=await send('staff/hospitals','POST',{name:'합성 복수 진료과 병원',organizationType:'병원',primaryDepartment:'정형외과',departments:['안과'],contactEmail:'qa-contact@example.test',openingHours:'평일 09:00~17:00'},adminHeaders,201);
    const other=await send('staff/hospitals','POST',{name:'합성 외과 의원',organizationType:'의원',primaryDepartment:'외과'},adminHeaders,201);
    const hospitalId=hospital.id;
    for (const [headers,role,departmentScope] of [[desk,'hospital_admin',null],[reviewer,'doctor','안과'],[otherDoctor,'doctor','정형외과'],[nurse,'nurse','안과']]) {
      await send('staff/members','POST',{hospitalId,email:headers['oai-authenticated-user-email'],role,departmentScope},adminHeaders,200);
    }
    const details = (programName,startOn=day(),assignee=undefined) => ({
      name:programName,phone:'010-0000-0000',age:58,dischargeDate:startOn,careStartOn:startOn,assignee,
    });
    const activate = async (program,approve=true) => {
      const ref={hospitalId,programId:program.id,version:program.version};
      await send('staff/programs','PUT',{...ref,state:'review'},desk,200);
      if (approve) {
        await send('staff/programs','PUT',{...ref,state:'approved',approvalRef:'QA 문서 01',confirmed:true},reviewer,200);
        await send('staff/programs','PUT',{...ref,state:'active'},desk,200);
      }
    };
    const register=(p,patient=details('구조 검증 환자'),headers=desk,status=201,context=env)=>send('staff/patients','POST',{hospitalId,confirmed:true,program:p&&{id:p.id,version:p.version},patient},headers,status,context);
    const invite=async p=>{
      const invitation=await send('staff/invitations','POST',{hospitalId,patientId:p.id},desk,201);
      return new URL(invitation.url).searchParams.get('token');
    };
    return { DB,careApi,env,send,call,hospital,other,hospitalId,activate,register,invite,details };
  } catch (error) {
    DB.db.close();
    throw error;
  }
}

test('version approval, scoping, schedule, history and reports share the common recovery workflow', async () => {
  const f=await fixture();
  const {DB,send,call,hospital,other,hospitalId,register,details,invite,activate,env}=f;
  try {
    assert.deepEqual(hospital.departments,['정형외과','안과']);
    assert.equal(other.organizationType,'의원');
    await send('staff/hospitals','PUT',{hospitalId,monthlyPatients:35},desk,200);

    const p=await send('staff/programs','POST',{hospitalId,...draft},desk,201);
    await register(p,undefined,desk,409);
    await send('staff/programs','PUT',{hospitalId,programId:p.id,version:1,state:'active'},desk,409);
    await activate(p,false);
    const approval={hospitalId,programId:p.id,version:1,state:'approved',approvalRef:'QA 문서 01',confirmed:true};
    await send('staff/programs','PUT',approval,otherDoctor,403);
    await send('staff/programs','PUT',approval,desk,403);
    await send('staff/programs','PUT',approval,reviewer,200);
    const nonDemoEnv={...env,CARE_PROGRAM_DEMO:false,CARE_PROGRAM_ASSIGNMENTS:'approved'};
    await send('staff/programs','PUT',{...approval,state:'active'},desk,409,nonDemoEnv);
    await send('staff/programs','PUT',{...approval,state:'active'},desk,200);
    await register(p,undefined,desk,409,nonDemoEnv);
    const liveDraft=await send('staff/programs','POST',{hospitalId,...draft,name:'운영 모드 차단 확인'},desk,201,{...env,CARE_PROGRAM_DEMO:false});
    const liveRef={hospitalId,programId:liveDraft.id,version:1};
    await send('staff/programs','PUT',{...liveRef,state:'review'},desk,200,{...env,CARE_PROGRAM_DEMO:false});
    await send('staff/programs','PUT',{...liveRef,state:'approved',approvalRef:'합성 테스트',confirmed:true},reviewer,200,{...env,CARE_PROGRAM_DEMO:false});
    await send('staff/programs','PUT',{...liveRef,state:'active'},desk,409,{...env,CARE_PROGRAM_DEMO:false});

    const patient=await register(p,details('확장 환자',day(),nurse['oai-authenticated-user-email']));
    assert.equal(patient.enrollment.careDays,8);
    assert.equal(patient.enrollment.intervalDays,2);
    const offDay=await register(p,details('일정 없는 환자',previousDay()));
    const legacy=await register(undefined,{...details('기존 정형외과'),surgeryType:'인공관절'});
    assert.equal(legacy.enrollment,undefined);
    await register(p,details('잘못된 담당 범위',day(),otherDoctor['oai-authenticated-user-email']),desk,400);
    await register(undefined,{...details('승인 없는 진료과'),department:'안과'},desk,409);
    await send('staff/hospitals','PUT',{hospitalId,departments:['정형외과']},desk,409);

    const connect=async candidate=>{
      const token=await invite(candidate),response=await call('connect','POST',{token,confirmed:true},{});
      assert.equal(response.status,200);
      return {Cookie:response.headers.get('set-cookie').split(';')[0]};
    };
    const cookie=await connect(patient), otherCookie=await connect(offDay), legacyCookie=await connect(legacy);
    const check={patientId:patient.id,date:day(),programId:p.id,programVersion:1,answers:{choice:'첫 번째',number:3,boolean:false}};
    await send('checkins','POST',check,otherCookie,409);
    await send('checkins','POST',{...check,patientId:offDay.id},cookie,403);
    await send('checkins','POST',{...check,answers:{choice:'첫 번째',boolean:false}},cookie,400);
    await send('checkins','POST',{...check,answers:{...check.answers,stray:0}},cookie,400);
    await send('checkins','POST',{...check,answers:{...check.answers,number:0}},cookie,400);
    const saved=await send('checkins','POST',check,cookie,200);
    assert.equal(saved.record.answers.boolean,false);
    assert.equal(saved.record.answers.note,undefined);
    assert.equal(saved.record.pain,undefined);
    assert.equal((await send('checkins','POST',check,cookie,200)).duplicate,true);
    await send('checkins','POST',{patientId:legacy.id,date:day(),painScore:1,mobilityScore:1,dayComparison:'same',hasConcern:false},legacyCookie,200);
    const personal=await send('state','GET',undefined,cookie,200);
    assert.equal(personal.patients.length,1);
    assert.equal(personal.patients[0].enrollment.reviewInstructions,undefined);
    assert.equal(personal.hospitals[0].contactEmail,undefined);
    assert.equal(personal.checkIns.length,0);
    assert.equal(personal.programCheckIns[0].program.version,1);
    assert.equal(DB.db.prepare('SELECT COUNT(*) AS count FROM care_classifications WHERE patient_id=?').get(patient.id).count,0);
    assert.equal(DB.db.prepare('SELECT COUNT(*) AS count FROM care_notifications WHERE patient_id=?').get(patient.id).count,0);

    const scopedWork=await send('staff/work?hospitalId='+hospitalId,'GET',undefined,nurse,200);
    assert.deepEqual(scopedWork.queue.map(row=>row.patient.id),[patient.id]);
    assert.equal(scopedWork.queue[0].status,'submitted');
    assert.equal((await send('staff/state','GET',undefined,otherDoctor,200)).state.patients.some(row=>row.id===patient.id),false);
    assert.equal((await send('staff/state','GET',undefined,adminHeaders,200)).state.patients.length,0);
    await send('staff/work?hospitalId='+other.id,'GET',undefined,desk,403);
    const otherDesk=roleHeaders('desk-surgery');
    await send('staff/members','POST',{hospitalId:other.id,email:otherDesk['oai-authenticated-user-email'],role:'hospital_admin'},adminHeaders,200);
    await send('staff/patients','POST',{hospitalId:other.id,confirmed:true,patient:{...details('잘못된 진료과'),department:'정형외과'}},otherDesk,409);
    await send('staff/report?hospitalId='+hospitalId+'&start='+day()+'&end='+day(),'GET',undefined,reviewer,403);
    await send('staff/work','PUT',{hospitalId,patientId:patient.id,kind:'acknowledge',revision:1,eventId:'qa-denied'},otherDoctor,403);
    await send('staff/work','PUT',{hospitalId,patientId:patient.id,kind:'acknowledge',revision:1,eventId:'qa-review'},nurse,200);
    const reportParams=new URLSearchParams({hospitalId,start:day(),end:day(),program:p.id,department:'안과'}).toString();
    const report=await send('staff/report?'+reportParams,'GET',undefined,desk,200);
    assert.equal(report.expectedDays,1);
    assert.equal(report.responseDays,1);
    assert.equal(report.confirmedResponses,1);
    assert.match(await (await call('staff/report?'+reportParams+'&format=csv')).text(),/responseDays,1/);

    const p2=await send('staff/programs','POST',{hospitalId,...draft,programId:p.id,careDays:20,questions:[{...draft.questions[0],label:'새 버전 질문'}]},desk,201);
    await activate(p2,false);
    await send('staff/programs','PUT',{hospitalId,programId:p.id,version:2,state:'approved',approvalRef:'합성 검토',confirmed:true},reviewer,200);
    await send('staff/programs','PUT',{hospitalId,programId:p.id,version:2,state:'active'},desk,409);
    await send('staff/programs','PUT',{hospitalId,programId:p.id,version:1,state:'stopped'},desk,200);
    await send('staff/programs','PUT',{hospitalId,programId:p.id,version:2,state:'active'},desk,200);
    await register(p,undefined,desk,409);
    const newer=await register(p2,details('새 버전 환자'));
    assert.equal(newer.enrollment.careDays,20);
    const older=await send('state','GET',undefined,cookie,200);
    assert.equal(older.patients[0].enrollment.careDays,8);
    assert.equal(older.programCheckIns[0].program.questions[0].label,draft.questions[0].label);
    const edited=await send('checkins','PUT',{...check,expectedUpdatedAt:saved.record.updatedAt,answers:{...check.answers,number:4}},cookie,200);
    assert.equal(edited.record.answers.number,4);
    assert.equal(edited.record.program.version,1);
    assert.ok(DB.db.prepare("SELECT count(*) AS count FROM care_audit WHERE action='program.approved'").get().count>=2);

    const expiredToken=await invite(newer);
    DB.db.prepare('UPDATE care_invitations SET expires_at=1 WHERE patient_id=?').run(newer.id);
    await send('invitation','POST',{token:expiredToken},{},410);
    await send('state','GET',undefined,{},401);
    await send('staff/programs?hospitalId='+hospitalId,'GET',undefined,{},401);
  } finally { DB.db.close(); }
});

test('v3 inquiries require organization and department and keep unknown fields out', async () => {
  const f=await fixture();
  const {DB,send}=f;
  try {
    const input={version:'v3',hospital:'합성 외과 의원',organizationType:'의원',department:'외과',contact:'합성 담당자',email:'contact@example.test',consent:true,treatment:'가상 시술',existingSolution:'사용 경험 없음',patientName:'배제할 값'};
    await send('pilot','POST',{...input,department:'잘못된 값'},{},400);
    await send('pilot','POST',input,{},201);
    await send('pilot','POST',input,{},200);
    const inbox=await send('staff/pilots','GET',undefined,adminHeaders,200);
    assert.equal(inbox.requests[0].consentVersion,'pilot-contact-v3');
    assert.equal(inbox.requests[0].existingSolution,'사용 경험 없음');
    assert.equal(inbox.requests[0].phone,undefined);
    assert.equal(inbox.requests[0].patientName,undefined);
    await send('staff/pilots','PUT',{id:inbox.requests[0].id,revision:inbox.requests[0].revision,status:'demonstrated'},adminHeaders,200);
    await send('staff/pilots','GET',undefined,desk,403);
  } finally { DB.db.close(); }
});

test('browser verifies program assignment, shared work and patient program UX across screen sizes', {
  skip:process.env.TEST_DANYEON_UI!=='1',timeout:150000,
},async()=>{
  const f=await fixture();
  const {DB,env,careApi,send,hospitalId,activate,invite,details,register}=f;
  const root=process.env.TEST_DANYEON_RELEASE==='1'?'dist/client':'out';
  const publicSite=await serveCare(careApi,env,{host:'127.0.0.1',root});
  const deskSite=await serveCare(careApi,env,{host:'127.0.0.1',root,staffHeaders:desk});
  const operatorSite=await serveCare(careApi,env,{host:'127.0.0.1',root,staffHeaders:adminHeaders});
  let browser;
  try {
    const p=await send('staff/programs','POST',{hospitalId,...draft},desk,201);
    await activate(p);
    const patient=await register(p,details('브라우저 확장 환자'));
    await register(undefined,{...details('브라우저 정형외과'),surgeryType:'척추'});
    const token=await invite(patient);

    browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||'chrome'});
    const page=await browser.newPage({serviceWorkers:'block'});
    const output='outputs/danyeon-v23';
    await mkdir(output,{recursive:true});
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal((await page.goto(publicSite.base+'/pilot')).status(),200);
      await page.getByRole('heading',{name:'병원 도입 문의'}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      if(width===390) await page.screenshot({path:output+'/pilot-390.png',fullPage:true});
    }
    await page.getByLabel('병원명').fill('합성 문의 병원');
    await page.getByLabel('담당자명').fill('합성 담당자');
    await page.getByLabel('업무용 이메일').fill('browser@example.test');
    await page.getByLabel('의료기관 유형').selectOption('종합병원');
    await page.getByLabel('진료과',{exact:true}).selectOption('대장항문');
    await page.getByRole('checkbox').check();
    await page.getByRole('button',{name:'파일럿 상담 요청 접수'}).click();
    await page.getByRole('status').filter({hasText:'상담 요청을 접수했습니다.'}).waitFor();

    await page.goto(publicSite.base+'/i?token='+token);
    await page.getByRole('checkbox').check();
    await page.getByRole('button',{name:'내 기록으로 연결하기'}).click();
    await page.getByRole('link',{name:'오늘 체크인 시작'}).click();
    await page.getByRole('heading',{name:'오늘의 체크인'}).waitFor();
    assert.equal(await page.getByRole('navigation',{name:'환자 메뉴'}).count(),0);
    assert.doesNotMatch(await page.locator('main').innerText(),/움직임|통증/);
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      if(width===390) await page.screenshot({path:output+'/patient-program-390.png',fullPage:true});
    }
    await page.getByRole('radio',{name:'첫 번째'}).check();
    await page.getByLabel('예시 숫자를 입력해 주세요.').fill('3');
    await page.getByRole('radio',{name:'아니오',exact:true}).check();
    await page.getByRole('button',{name:'답변 확인'}).click();
    await page.getByRole('button',{name:'회복 체크인 제출'}).click();
    await page.getByRole('status').filter({hasText:'오늘 회복기록을 저장했어요'}).waitFor();
    await page.getByRole('link',{name:'지난 회복기록'}).click();
    await page.getByRole('heading',{name:'나의 회복기록'}).waitFor();
    await page.getByRole('meter').waitFor();

    await page.goto(deskSite.base+'/care/server');
    await page.getByLabel('진료과 필터').selectOption('안과');
    await page.getByLabel('프로그램 필터').selectOption(p.id);
    const worklist=page.locator('.care-work-list');
    await worklist.getByRole('button',{name:/브라우저 확장 환자/}).click();
    assert.equal(await worklist.getByRole('button',{name:/브라우저 정형외과/}).count(),0);
    await page.getByText('원본 응답',{exact:false}).click();
    await page.getByText('예시 항목을 골라주세요.',{exact:true}).waitFor();
    await page.screenshot({path:output+'/desk-program-1440.png',fullPage:true});
    await page.getByText('환자 등록',{exact:true}).click();
    await page.getByRole('combobox',{name:/^회복 프로그램/}).selectOption(p.id+':1');
    await page.getByLabel('관리 시작일',{exact:true}).waitFor();
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'desk and patient registration: '+width);
    }
    await page.getByRole('tab',{name:'회복 프로그램'}).click();
    await page.getByRole('heading',{name:'가상 확장 프로그램 · v1'}).waitFor();
    await page.getByRole('tab',{name:'리포트'}).click();
    await page.getByLabel('리포트 프로그램').selectOption(p.id);
    await page.getByRole('button',{name:'월간 리포트 생성'}).click();
    await page.getByRole('article',{name:'서버 리포트 결과'}).waitFor();
    await page.getByRole('link',{name:/CSV/}).waitFor();
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'report: '+width);
    }

    await page.goto(operatorSite.base+'/care/server');
    await page.getByLabel('유형별 보기').selectOption('의원');
    const overview=page.getByRole('region',{name:'서비스 운영 및 감사'});
    await overview.getByText('합성 외과 의원',{exact:true}).waitFor();
    assert.equal(await overview.getByText('합성 복수 진료과 병원',{exact:true}).count(),0);
    await page.getByText('실제 병원 등록',{exact:true}).click();
    await page.getByLabel('의료기관 유형').selectOption('의원');
    for(const width of [360,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'organization registration: '+width);
    }
    await page.getByLabel('주요 진료과').selectOption('치과');
    await page.getByText('추가 진료과 선택',{exact:true}).click();
    await page.getByRole('checkbox',{name:'안과',exact:true}).check();
    await page.getByLabel('병원명',{exact:true}).fill('브라우저 신규 의원');
    await page.getByRole('button',{name:'병원 정보 저장'}).click();
    await overview.getByText('브라우저 신규 의원',{exact:true}).waitFor();
    await page.screenshot({path:output+'/operator-1440.png',fullPage:true});
  } finally {
    await browser?.close();
    await Promise.all([publicSite.close(),deskSite.close(),operatorSite.close()]);
    DB.db.close();
  }
});
