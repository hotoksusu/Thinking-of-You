import { evaluatePatientStatus } from './status-rules.js';
import { careOperations } from './care-operations.js';
import { sendCareNotice,careSmsConfigured } from './care-sms.js';
const COOKIE = '__Host-care_session';
const DAY = 86400000;
const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', ...extra } });
const fail = (code, status = 400) => { throw Object.assign(new Error(code), { status }); };
const id = () => crypto.randomUUID();
const random = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), v => v.toString(16).padStart(2, '0')).join('');
const digest = async (value) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), v => v.toString(16).padStart(2, '0')).join('');
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
const text = (v, max = 200) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const validDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v + 'T12:00:00Z')) && new Date(v + 'T12:00:00Z').toISOString().slice(0, 10) === v;
async function body(request){if(!request.headers.get('content-type')?.startsWith('application/json'))fail('JSON_REQUIRED',415);const reader=request.body?.getReader(),chunks=[];let length=0;if(!reader)fail('INVALID_JSON');for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>100000){await reader.cancel();fail('BODY_TOO_LARGE',413);}chunks.push(value);}const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}let parsed;try{parsed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{fail('INVALID_JSON');}if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')fail('INVALID_JSON');return parsed;}
async function staff(request, env) { const user=request.headers.get('oai-authenticated-user-id'), email=request.headers.get('oai-authenticated-user-email')?.toLowerCase(); if(!user||!email)fail('STAFF_SIGN_IN_REQUIRED',401); const admin=!!env.CARE_ADMIN_EMAIL&&email===env.CARE_ADMIN_EMAIL.toLowerCase();const {results}=await env.DB.prepare('SELECT hospital_id,role FROM care_staff WHERE email=? AND active=1 AND role IN (?,?,?) AND (expires_at IS NULL OR expires_at>?)').bind(email,'nurse','doctor','hospital_admin',Date.now()).all();if(!admin&&!results.length)fail('STAFF_ACCESS_DENIED',403);return {user,email,admin,hospitals:results.map(r=>r.hospital_id),roles:Object.fromEntries(results.map(r=>[r.hospital_id,r.role]))}; }
const authorize=(s,hospital,permission='clinical')=>{const role=s.roles[hospital];if(!role)fail('HOSPITAL_ACCESS_DENIED',403);if(permission==='admin'&&role!=='hospital_admin')fail('ROLE_ACCESS_DENIED',403);};
async function patientAccess(env,s,hospital,patient){authorize(s,hospital);if(s.roles[hospital]==='nurse'){const row=await env.DB.prepare("SELECT patient_id FROM care_work WHERE tenant_id=? AND patient_id=? AND json_extract(payload,'$.assignee')=?").bind(hospital,patient,s.email).first();if(!row)fail('PATIENT_ACCESS_DENIED',403);}}
async function staffState(env,s){const state=await stateFor(env,s.hospitals),allowed=new Set();for(const p of state.patients){try{await patientAccess(env,s,p.hospitalId,p.id);allowed.add(p.id);}catch{}}return {...state,patients:state.patients.filter(p=>allowed.has(p.id)),checkIns:state.checkIns.filter(c=>allowed.has(c.patientId)),statuses:state.statuses.filter(c=>allowed.has(c.patientId)),careSignals:state.careSignals.filter(c=>allowed.has(c.patientId))};}
async function audit(env,request,action,outcome,tenant=null){await env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),tenant,await digest(request.headers.get('oai-authenticated-user-id')||request.headers.get('cookie')||'anonymous'),action,outcome,Date.now()).run();}
async function patientSession(request, env) { const token = request.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1); if (!token)
    fail('PATIENT_SESSION_REQUIRED', 401); const row = await env.DB.prepare('SELECT s.* FROM care_sessions s JOIN care_invitations i ON i.id=s.invitation_id WHERE s.token_hash=? AND s.expires_at>? AND i.revoked=0').bind(await digest(token), Date.now()).first(); if (!row)
    fail('PATIENT_SESSION_EXPIRED', 401); if((row.last_seen_at||row.confirmed_at)<Date.now()-14*DAY)fail('PATIENT_SESSION_EXPIRED',401);await env.DB.prepare('UPDATE care_sessions SET last_seen_at=? WHERE token_hash=?').bind(Date.now(),await digest(token)).run(); return row; }
async function invitation(token, env) { if (typeof token !== 'string' || !/^srv_[a-f0-9]{64}$/.test(token))
    fail('INVALID_INVITATION', 404); const row = await env.DB.prepare('SELECT * FROM care_invitations WHERE token_hash=?').bind(await digest(token)).first(); if (!row || row.revoked)
    fail('INVALID_INVITATION', 404); if (row.expires_at <= Date.now())
    fail('EXPIRED_INVITATION', 410); return row; }
async function stateFor(env, hospitalIds, patientId) {
    if (!hospitalIds.length)
        return { hospitals: [], patients: [], episodes: [], checkIns: [], statuses: [], careSignals: [], careTasks: [], followUps: [], decisions: [] };
    const placeholders = hospitalIds.map(() => '?').join(','), args = patientId ? [...hospitalIds, patientId] : hospitalIds, scope = `hospital_id IN (${placeholders})${patientId ? ' AND patient_id=?' : ''}`;
    const hospitals = await env.DB.prepare(`SELECT payload FROM care_hospitals WHERE id IN (${placeholders})`).bind(...hospitalIds).all();
    const patients = await env.DB.prepare(`SELECT payload FROM care_patients WHERE hospital_id IN (${placeholders})${patientId ? ' AND id=?' : ''}`).bind(...args).all();
    const checks = await env.DB.prepare(`SELECT payload FROM care_checkins WHERE ${scope} ORDER BY day`).bind(...args).all(), alerts = await env.DB.prepare(`SELECT payload FROM care_alerts WHERE ${scope}`).bind(...args).all();
    const parse = r => JSON.parse(r.payload), ps = patients.results.map(parse), cs = checks.results.map(parse), statuses = ps.flatMap(p => { const list = cs.filter(c => c.patientId === p.id); return list.length ? [{ ...evaluatePatientStatus(list.at(-1), list.at(-2)), source: 'system', ruleVersion: 'demo-v1' }] : []; });
    const classifications=await env.DB.prepare(`SELECT source_id,source_updated_at,payload FROM care_classifications WHERE tenant_id IN (${placeholders})${patientId?' AND patient_id=?':''}`).bind(...args).all();
    const persisted=statuses.map(status=>{const last=cs.filter(c=>c.patientId===status.patientId).at(-1),row=classifications.results.find(r=>r.source_id===last?.id&&r.source_updated_at===last?.updatedAt);return row?{...JSON.parse(row.payload),source:'system'}:status;});
    const hospitalPayloads=[];for(const r of hospitals.results){const h=parse(r),p=await env.DB.prepare('SELECT payload FROM care_policies WHERE tenant_id=?').bind(h.id).first();if(p&&JSON.parse(p.payload).monitoringHours)h.openingHours=JSON.parse(p.payload).monitoringHours;hospitalPayloads.push(h);}
    return { hospitals: hospitalPayloads, patients: ps, episodes: [], checkIns: cs, statuses:persisted, careSignals: alerts.results.map(parse), careTasks: [], followUps: [], decisions: [] };
}
function normalizeCheck(input, patientId, day, existing) { if (!Number.isInteger(input.painScore) || input.painScore < 0 || input.painScore > 10 || ![0, 1, 2].includes(input.mobilityScore) || !['better', 'same', 'worse'].includes(input.dayComparison) || typeof input.hasConcern !== 'boolean')
    fail('INVALID_CHECKIN'); const pain = input.painScore, now = new Date(Math.max(Date.now(), (Date.parse(existing?.updatedAt || '') || 0) + 1)).toISOString(); return { id: existing?.id || id(), patientId, date: day, checkInDate: day, pain: pain <= 2 ? 0 : pain <= 4 ? 1 : pain <= 6 ? 2 : 3, painScore: pain, mobility: input.mobilityScore, mobilityScore: input.mobilityScore, dayComparison: input.dayComparison, initialCondition: ['좋아요', '보통이에요', '불편해요'].includes(input.initialCondition) ? input.initialCondition : existing?.initialCondition, hasConcern: input.hasConcern, concernText: input.hasConcern ? text(input.concernText, 200) : '', customConcern: text(input.customConcern, 100), concerns: Array.isArray(input.concerns) ? input.concerns.filter(x => ['swelling', 'fever', 'incision_discomfort', 'sleep', 'numbness', 'walking', 'medication', 'dizziness', 'fall', 'other', 'none'].includes(x)).slice(0, 3) : [], painContext: ['rest', 'moving', 'walking', 'night', 'constant', 'unsure'].includes(input.painContext) ? input.painContext : undefined, movementDifficulty: text(input.movementDifficulty, 100),
        episodeId: 'episode_'+patientId,
        mobilityComparison: input.mobilityScore===0?'better':input.mobilityScore===2?'worse':'same',
        concernStatus: input.hasConcern?'reported':'none',
        swellingChange: ['none','same','more','sudden'].includes(input.swellingChange)?input.swellingChange:undefined,
        warmth: ['none','some','clear','unsure'].includes(input.warmth)?input.warmth:undefined,
        woundChange: ['same','redder','fluid','blood','unsure'].includes(input.woundChange)?input.woundChange:undefined,
        sleep: ['well','once_or_twice','often','hardly'].includes(input.sleep)?input.sleep:undefined,
        dailyFunction: ['independent','some_help','much_help'].includes(input.dailyFunction)?input.dailyFunction:undefined, source: input.source === 'guardian' ? 'guardian' : 'patient', submittedByType: input.source === 'guardian' ? 'guardian' : 'patient', submittedById: patientId, createdAt: existing?.createdAt || now, updatedAt: now }; }
export async function careApi(request, env, context) {
    const url = new URL(request.url), route = url.pathname;
    if (!route.startsWith('/api/care/'))
        return null;
    try {
        const publicOrigin=env.CARE_PUBLIC_ORIGIN?new URL(env.CARE_PUBLIC_ORIGIN).origin:url.origin;
        if(route==='/api/care/disconnect'&&request.method==='POST'){
            if(request.headers.get('origin')!==publicOrigin)fail('ORIGIN_REJECTED',403);
            const token=request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
            if(token&&env.DB)await env.DB.prepare('DELETE FROM care_sessions WHERE token_hash=?').bind(await digest(token)).run();
            return json({connected:false},200,{'Set-Cookie':COOKIE+'=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'});
        }
        if (!env.DB)fail('SERVER_NOT_CONFIGURED',503);
        const actor=request.headers.get('oai-authenticated-user-id')||request.headers.get('cf-connecting-ip')||'anonymous';
        const minute=Math.floor(Date.now()/60000),bucket=await digest(actor+':'+minute+':'+(route.includes('/staff/')?'staff':'public'));
        await env.DB.prepare('INSERT INTO care_rate_limits(bucket,count,reset_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1').bind(bucket,(minute+1)*60000).run();
        const rate=await env.DB.prepare('SELECT count FROM care_rate_limits WHERE bucket=?').bind(bucket).first();
        if(rate.count>(route.includes('/staff/')?240:120))fail('RATE_LIMITED',429);
        await env.DB.prepare('DELETE FROM care_rate_limits WHERE reset_at<?').bind(Date.now()-60000).run();
        if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method))
            fail('METHOD_NOT_ALLOWED', 405);
        if (request.method !== 'GET' && request.headers.get('origin') !== publicOrigin)
            fail('ORIGIN_REJECTED', 403);
        const operation=await careOperations(request,env,{staff,authorize,patientAccess,body,fail,json,id,text,validDate,today,digest,audit,stateFor,staffState});
        if(operation)return operation;
        if (route === '/api/care/invitation' && request.method === 'POST') {
            const { token } = await body(request), inv = await invitation(token, env), p = await env.DB.prepare('SELECT payload FROM care_patients WHERE id=? AND hospital_id=?').bind(inv.patient_id, inv.hospital_id).first(), h = await env.DB.prepare('SELECT payload FROM care_hospitals WHERE id=?').bind(inv.hospital_id).first();
            if (!p || !h)
                fail('INVALID_INVITATION', 404);
            return json({ hospitalName: JSON.parse(h.payload).name, patientId: inv.patient_id, hospitalId: inv.hospital_id });
        }
        if (route === '/api/care/connect' && request.method === 'POST') {
            const input = await body(request);
            if (input.confirmed !== true)
                fail('CONFIRMATION_REQUIRED');
            const inv = await invitation(input.token, env), token = random();
            const patientRow=await env.DB.prepare('SELECT payload FROM care_patients WHERE id=? AND hospital_id=?').bind(inv.patient_id,inv.hospital_id).first();if(!patientRow||JSON.parse(patientRow.payload).careStatus==='completed')fail('CARE_COMPLETED',409);
            await env.DB.prepare('INSERT INTO care_sessions(token_hash,invitation_id,patient_id,hospital_id,expires_at,confirmed_at) VALUES(?,?,?,?,?,?)').bind(await digest(token), inv.id, inv.patient_id, inv.hospital_id, Date.now() + 30 * DAY, Date.now()).run();
            await audit(env,request,'patient.connect','success',inv.hospital_id);
            return json({ connected: true }, 200, { 'Set-Cookie': `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 86400}` });
        }
        if (route === '/api/care/state' && request.method === 'GET') {
            const s = await patientSession(request, env);
            const state=await stateFor(env,[s.hospital_id],s.patient_id),policy=await env.DB.prepare('SELECT payload FROM care_policies WHERE tenant_id=?').bind(s.hospital_id).first(),days=policy?JSON.parse(policy.payload).careDays:14;
            state.patients=state.patients.map(p=>Date.parse(today())-Date.parse(p.dischargeDate)>=days*DAY?{...p,careStatus:'completed'}:p);
            await audit(env,request,'patient.read','success',s.hospital_id);return json(state);
        }
        if (route === '/api/care/checkins' && (request.method === 'POST' || request.method === 'PUT')) {
            const s = await patientSession(request, env), input = await body(request), day = today();
            const patientRow=await env.DB.prepare('SELECT payload FROM care_patients WHERE id=? AND hospital_id=?').bind(s.patient_id,s.hospital_id).first();
            if(!patientRow)fail('PATIENT_NOT_FOUND',404);
            const patientData=JSON.parse(patientRow.payload),policyRow=await env.DB.prepare('SELECT payload FROM care_policies WHERE tenant_id=?').bind(s.hospital_id).first(),careDays=policyRow?JSON.parse(policyRow.payload).careDays:14;if(patientData.careStatus==='completed'||today()<patientData.dischargeDate||Date.parse(today())-Date.parse(patientData.dischargeDate)>=careDays*DAY)fail('CARE_COMPLETED',409);
            if (input.date !== day || input.patientId && input.patientId !== s.patient_id)
                fail('CHECKIN_SCOPE_REJECTED', 403);
            const existingRow = await env.DB.prepare('SELECT payload,updated_at FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day=?').bind(s.patient_id, s.hospital_id, day).first(), existing = existingRow ? JSON.parse(existingRow.payload) : null;
            if (request.method === 'POST' && existing)
                return json({ record: existing, duplicate: true });
            if (request.method === 'PUT' && (!existing || input.expectedUpdatedAt !== existingRow.updated_at))
                fail('RECORD_CHANGED', 409);
            const check = normalizeCheck(input, s.patient_id, day, existing),eventKey=s.hospital_id+":"+s.patient_id+":"+check.id;
            const stmt = request.method === 'PUT' ? env.DB.prepare('UPDATE care_checkins SET payload=?,updated_at=? WHERE patient_id=? AND hospital_id=? AND day=? AND updated_at=?').bind(JSON.stringify(check), check.updatedAt, s.patient_id, s.hospital_id, day, input.expectedUpdatedAt) : env.DB.prepare('INSERT INTO care_checkins(patient_id,hospital_id,day,payload,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(patient_id,hospital_id,day) DO NOTHING').bind(s.patient_id, s.hospital_id, day, JSON.stringify(check), check.updatedAt);
            const priorRow = await env.DB.prepare('SELECT payload FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day<? ORDER BY day DESC LIMIT 1').bind(s.patient_id, s.hospital_id, day).first(), status = evaluatePatientStatus(check, priorRow ? JSON.parse(priorRow.payload) : undefined), statements = [stmt];
            const classification={...status,ruleVersion:'demo-v1',evaluatedAt:check.updatedAt,approved:!!policyRow&&JSON.parse(policyRow.payload).approved===true};
            statements.push(env.DB.prepare('INSERT INTO care_classifications(tenant_id,patient_id,source_id,source_updated_at,payload) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day=? AND updated_at=?) ON CONFLICT DO NOTHING').bind(s.hospital_id,s.patient_id,check.id,check.updatedAt,JSON.stringify(classification),s.patient_id,s.hospital_id,day,check.updatedAt));
            if (status.level !== 'stable') {
                const alert = { id: id(), patientId: s.patient_id, type: 'other', severity: status.level === 'needs_attention' ? 'priority' : 'check', reason: status.reason, detectedAt: check.updatedAt, sourceCheckInIds: [check.id], status: 'open' };
                statements.push(env.DB.prepare("INSERT INTO care_alerts(id,patient_id,hospital_id,payload) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day=? AND updated_at=? AND json_extract(payload,'$.id')=?)").bind(alert.id, s.patient_id, s.hospital_id, JSON.stringify(alert), s.patient_id, s.hospital_id, day, check.updatedAt, check.id));
                statements.push(env.DB.prepare("INSERT INTO care_notifications(id,tenant_id,patient_id,event_key,status,updated_at) SELECT ?,?,?,?,'not_configured',? WHERE EXISTS(SELECT 1 FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day=? AND updated_at=?) ON CONFLICT(event_key) DO NOTHING").bind(id(),s.hospital_id,s.patient_id,eventKey,Date.now(),s.patient_id,s.hospital_id,day,check.updatedAt));
            }
            statements.push(env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),s.hospital_id,await digest(s.token_hash),'checkin.save','success',Date.now()));
            const results = await env.DB.batch(statements);
            if (request.method === 'PUT' && !results[0].meta.changes)
                fail('RECORD_CHANGED', 409);
            const savedRow = await env.DB.prepare('SELECT payload FROM care_checkins WHERE patient_id=? AND hospital_id=? AND day=?').bind(s.patient_id, s.hospital_id, day).first(), saved = JSON.parse(savedRow.payload);
            if(context?.waitUntil&&careSmsConfigured(env)){const job=(async()=>{const notice=await env.DB.prepare('SELECT id FROM care_notifications WHERE tenant_id=? AND event_key=?').bind(s.hospital_id,eventKey).first();if(notice)await sendCareNotice(env,s.hospital_id,notice.id);})();context.waitUntil(job.catch(()=>{}));}
            return json({ record: saved });
        }
        if (route === '/api/care/staff/state' && request.method === 'GET') {
            const s=await staff(request,env);for(const tenant of s.hospitals)await audit(env,request,'staff.read','success',tenant);if(!s.hospitals.length)await audit(env,request,'platform.catalog.read','success');
            const catalog=s.admin?(await env.DB.prepare('SELECT payload FROM care_hospitals').all()).results.map(r=>{const h=JSON.parse(r.payload);return {id:h.id,name:h.name};}):[];
            return json({ state:await staffState(env,s),admin:s.admin,email:s.email,roles:s.roles,catalog });
        }
        if (route === '/api/care/staff/hospitals' && request.method === 'POST') {
            const s = await staff(request, env);
            if (!s.admin)
                fail('ADMIN_REQUIRED', 403);
            const input = await body(request), hospital = { id: id(), name: text(input.name, 100), phone: text(input.phone, 30), openingHours: text(input.openingHours, 300), address: text(input.address, 200), status: 'active' };
            if (!hospital.name)
                fail('HOSPITAL_NAME_REQUIRED');
            await env.DB.batch([env.DB.prepare('INSERT INTO care_hospitals(id,payload) VALUES(?,?)').bind(hospital.id, JSON.stringify(hospital)),env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),hospital.id,await digest(s.user),'hospital.create','success',Date.now())]);
            return json(hospital, 201);
        }
        if (route === '/api/care/staff/members' && request.method === 'POST') {
            const s = await staff(request, env);
            const input = await body(request), email = text(input.email).toLowerCase();
            if(!s.admin)authorize(s,input.hospitalId,'admin');
            if(s.admin&&email===s.email&&!s.roles[input.hospitalId])fail('HOSPITAL_APPROVAL_REQUIRED',403);
            const role=['nurse','doctor','hospital_admin'].includes(input.role)?input.role:'nurse';
            if(input.expiresOn&&(!validDate(input.expiresOn)||input.expiresOn<today()))fail('INVALID_EXPIRY');const expiresAt=input.expiresOn?Date.parse(input.expiresOn+'T23:59:59+09:00'):null;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                fail('INVALID_EMAIL');
            const h = await env.DB.prepare('SELECT id FROM care_hospitals WHERE id=?').bind(input.hospitalId).first();
            if (!h)
                fail('HOSPITAL_NOT_FOUND', 404);
            await env.DB.batch([env.DB.prepare('INSERT INTO care_staff(email,hospital_id,role,active,expires_at) VALUES(?,?,?,1,?) ON CONFLICT(email,hospital_id) DO UPDATE SET role=excluded.role,active=1,expires_at=excluded.expires_at').bind(email,h.id,role,expiresAt),env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),h.id,await digest(s.user),'member.grant.'+role,'success',Date.now())]);
            return json({ added: true });
        }
        if (route === '/api/care/staff/patients' && request.method === 'POST') {
            const s = await staff(request, env), input = await body(request);
            authorize(s, input.hospitalId,'admin');
            const h = await env.DB.prepare('SELECT id FROM care_hospitals WHERE id=?').bind(input.hospitalId).first();
            if (!h)
                fail('HOSPITAL_NOT_FOUND', 404);
            if (input.confirmed !== true)
                fail('REAL_DATA_CONFIRMATION_REQUIRED');
            const sourceRef = text(input.sourceRef, 200) || null;
            if(sourceRef){const existing=await env.DB.prepare('SELECT payload FROM care_patients WHERE hospital_id=? AND source_ref=?').bind(h.id,sourceRef).first();if(existing)return json(JSON.parse(existing.payload));}
            const p = input.patient || {}, patient = { id: id(), hospitalId: h.id, name: text(p.name, 100), phone: text(p.phone, 30), age: Number(p.age), surgeryType: ['인공관절', '척추', '골절', '기타'].includes(p.surgeryType) ? p.surgeryType : '기타', dischargeDate: p.dischargeDate, surgeryDate: p.surgeryDate || undefined, department: text(p.department, 100), nextAppointment: p.nextAppointment || undefined, status: 'invited', careStatus: 'active', createdAt: new Date().toISOString() };
            for(const key of ['bodyPart','conditionCategory','procedureCategory','procedureDetail','customProcedureName','laterality','assignedNurse','assignedDoctor','hospitalPatientId','externalPatientId','externalEncounterId','externalSurgeryId']){if(typeof p[key]==='string')patient[key]=text(p[key],200);}
            if(['active','invited','follow_up','completion_due','completed'].includes(p.careStatus))patient.careStatus=p.careStatus;
            if (!patient.name || !patient.phone || !Number.isInteger(patient.age) || patient.age < 0 || patient.age > 130 || !validDate(patient.dischargeDate) || patient.surgeryDate && !validDate(patient.surgeryDate) || patient.nextAppointment && !validDate(patient.nextAppointment))
                fail('INVALID_PATIENT');
            const checks = Array.isArray(input.records) ? input.records : [];
            if (checks.length > 3650)
                fail('TOO_MANY_RECORDS');
            const seen = new Set();
            const statements = [env.DB.prepare('INSERT INTO care_patients(id,hospital_id,payload,source_ref) VALUES(?,?,?,?)').bind(patient.id, h.id, JSON.stringify(patient), sourceRef)];
            for (const old of checks) {
                const day = old.checkInDate || old.date;
                if (!validDate(day) || day > today() || seen.has(day))
                    fail('INVALID_IMPORTED_RECORD');
                seen.add(day);
                if (!Number.isInteger(old.mobilityScore ?? old.mobility) || (old.mobilityScore ?? old.mobility) < 0 || (old.mobilityScore ?? old.mobility) > 3 || typeof old.hasConcern !== 'boolean' || !(old.painScore === null || typeof old.painScore === 'number' && old.painScore >= 0 && old.painScore <= 10 || old.painScore === undefined && Number.isInteger(old.pain) && old.pain >= 0 && old.pain <= 3))
                    fail('INVALID_IMPORTED_RECORD');
                const record = { ...old, id: typeof old.id === 'string' ? old.id : id(), patientId: patient.id, date: day, checkInDate: day, createdAt: old.createdAt || new Date(day + 'T12:00:00+09:00').toISOString(), updatedAt: new Date().toISOString() };
                statements.push(env.DB.prepare('INSERT INTO care_checkins(patient_id,hospital_id,day,payload,updated_at) VALUES(?,?,?,?,?)').bind(patient.id, h.id, day, JSON.stringify(record), record.updatedAt));
            }
            statements.push(env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),h.id,await digest(s.user),'patient.register','success',Date.now()));
            await env.DB.batch(statements);
            return json(patient, 201);
        }
        if (route === '/api/care/staff/invitations' && request.method === 'POST') {
            const s = await staff(request, env), input = await body(request);
            await patientAccess(env,s,input.hospitalId,input.patientId);
            const p = await env.DB.prepare('SELECT id FROM care_patients WHERE id=? AND hospital_id=?').bind(input.patientId, input.hospitalId).first();
            if (!p)
                fail('PATIENT_NOT_FOUND', 404);
            const token = 'srv_' + random(), invId = id();
            await env.DB.batch([env.DB.prepare('UPDATE care_invitations SET revoked=1 WHERE patient_id=? AND hospital_id=?').bind(p.id,input.hospitalId),env.DB.prepare('INSERT INTO care_invitations(id,token_hash,patient_id,hospital_id,expires_at,created_at) VALUES(?,?,?,?,?,?)').bind(invId,await digest(token),p.id,input.hospitalId,Date.now()+7*DAY,Date.now()),env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),input.hospitalId,await digest(s.user),'invitation.issue','success',Date.now())]);
            return json({ id: invId, url: publicOrigin + '/i?token=' + token, expiresAt: new Date(Date.now() + 7 * DAY).toISOString() }, 201);
        }
        if (route === '/api/care/staff/invitations' && request.method === 'DELETE') {
            const s = await staff(request, env), input = await body(request);
            const inv = await env.DB.prepare('SELECT hospital_id,patient_id FROM care_invitations WHERE id=?').bind(input.id).first();
            if (!inv)
                fail('INVITATION_NOT_FOUND', 404);
            await patientAccess(env,s,inv.hospital_id,inv.patient_id);
            await env.DB.batch([env.DB.prepare('UPDATE care_invitations SET revoked=1 WHERE id=?').bind(input.id),env.DB.prepare('INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)').bind(id(),inv.hospital_id,await digest(s.user),'invitation.revoke','success',Date.now())]);
            return json({ revoked: true });
        }
        fail('NOT_FOUND', 404);
    }
    catch (error) {
        if(env.DB&&error.status&&[401,403,429].includes(error.status)){try{await audit(env,request,route,'denied');}catch{return json({error:'AUDIT_UNAVAILABLE'},503);}}
        return json({ error: error.status ? error.message : 'SERVER_ERROR' }, error.status || 500,error.status===429?{'Retry-After':'60'}:{});
    }
}
