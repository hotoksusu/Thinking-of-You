import { adoptionStates, departments, organizationTypes } from './recovery-program.js';

export const isProgramDemo = env => env.CARE_PROGRAM_DEMO === true;
const programEnabled = (env, demo) => demo ? isProgramDemo(env) : !isProgramDemo(env) && env.CARE_PROGRAM_ASSIGNMENTS === 'approved';

export function organizationProfile(input, fail, text) {
  const profile = {};
  if (input.organizationType) {
    if (!organizationTypes.includes(input.organizationType)) fail('INVALID_ORGANIZATION');
    profile.organizationType = input.organizationType;
  }
  if (input.departments !== undefined || input.primaryDepartment) {
    if (input.departments !== undefined && (!Array.isArray(input.departments) || input.departments.some(value => !departments.includes(value)))) fail('INVALID_DEPARTMENT');
    if (input.primaryDepartment && !departments.includes(input.primaryDepartment)) fail('INVALID_DEPARTMENT');
    profile.departments = [...new Set([input.primaryDepartment, ...(input.departments || [])].filter(Boolean))];
    profile.primaryDepartment = profile.departments[0] || null;
  }
  if (input.contactName !== undefined) profile.contactName = text(input.contactName, 60);
  if (input.contactEmail !== undefined) {
    profile.contactEmail = text(input.contactEmail, 200).toLowerCase();
    if (profile.contactEmail && !/^\S+@\S+\.\S+$/.test(profile.contactEmail)) fail('INVALID_EMAIL');
  }
  if (input.monthlyPatients !== undefined && input.monthlyPatients !== '') {
    const n = Number(input.monthlyPatients);
    if (!Number.isInteger(n) || n < 0 || n > 100000) fail('INVALID_ORGANIZATION');
    profile.monthlyPatients = n;
  }
  if (input.adoptionStatus) {
    if (!adoptionStates.includes(input.adoptionStatus)) fail('INVALID_ORGANIZATION');
    profile.adoptionStatus = input.adoptionStatus;
  }
  return profile;
}

export function departmentAllows(role, scope, patient, hospital) {
  if (role === 'hospital_admin') return true;
  if (!patient) return false;
  const needsScope = patient.enrollment || (hospital?.departments?.length || 0) > 1 || scope;
  if (!needsScope) return true;
  const department = patient.enrollment?.department || patient.department || hospital?.primaryDepartment;
  return Boolean(scope && department === scope);
}

export function organizationSummary(h) {
  const { id, name, organizationType, primaryDepartment, departments, adoptionStatus, monthlyPatients } = h;
  return { id, name, organizationType, primaryDepartment, departments, adoptionStatus, monthlyPatients };
}

function normalizeQuestions(input, fail, text) {
  const seen = new Set();
  if (!Array.isArray(input) || input.length === 0 || input.length > 8) fail('INVALID_QUESTIONS');
  return input.map(q => {
    if (!q || typeof q.id !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(q.id) || ['constructor','prototype','__proto__'].includes(q.id) || seen.has(q.id)) fail('INVALID_QUESTIONS');
    seen.add(q.id);
    const label = text(q.label, 180);
    if (!label || typeof q.required !== 'boolean') fail('INVALID_QUESTIONS');
    const base = { id:q.id, label, required:q.required, kind:q.kind };
    if (q.kind === 'single') {
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 8) fail('INVALID_QUESTIONS');
      const options = q.options.map(value => text(value, 60));
      if (options.some(value => !value) || new Set(options).size !== options.length) fail('INVALID_QUESTIONS');
      return { ...base, options };
    }
    if (q.kind === 'number') {
      if (!Number.isInteger(q.min) || !Number.isInteger(q.max) || q.min >= q.max || q.min < -1000 || q.max > 1000) fail('INVALID_QUESTIONS');
      return { ...base, min:q.min, max:q.max };
    }
    if (q.kind !== 'text' && q.kind !== 'boolean') fail('INVALID_QUESTIONS');
    return base;
  });
}

function normalizeProgram(b, hospital, env, fail, text) {
  const { department, careDays, intervalDays, followupDays, completion } = b;
  const name = text(b.name, 100), treatment = text(b.treatment, 100);
  if (!name || !treatment || !departments.includes(department) || (hospital.departments?.length && !hospital.departments.includes(department))) fail('INVALID_PROGRAM');
  if (!Number.isInteger(careDays) || careDays < 1 || careDays > 365 || !Number.isInteger(intervalDays) || intervalDays < 1 || intervalDays > careDays) fail('INVALID_PROGRAM');
  if (followupDays !== null && (!Number.isInteger(followupDays) || followupDays < 1 || followupDays > 365)) fail('INVALID_PROGRAM');
  if (!['end_on','staff'].includes(completion)) fail('INVALID_PROGRAM');
  return {
    name, department, treatment, careDays, intervalDays, followupDays, completion,
    description:text(b.description, 400),
    instructions:text(b.instructions, 800),
    reviewInstructions:text(b.reviewInstructions, 400),
    questions:normalizeQuestions(b.questions, fail, text),
    demo:isProgramDemo(env),
  };
}

function parseProgram(row) {
  return { ...JSON.parse(row.payload), id:row.program_id, version:row.version, state:row.status };
}

export async function listRecoveryPrograms(env, hospitalId) {
  const result = await env.DB.prepare('SELECT program_id,version,status,payload FROM care_program_versions WHERE tenant_id=? ORDER BY program_id, version DESC').bind(hospitalId).all();
  return result.results.map(parseProgram);
}

export async function assignedProgram(env, hospitalId, ref, startOn, validDate, fail) {
  if (!ref || typeof ref.id !== 'string' || !Number.isInteger(ref.version) || !validDate(startOn)) fail('INVALID_PROGRAM_SELECTION');
  const row = await env.DB.prepare("SELECT program_id,version,status,payload FROM care_program_versions WHERE tenant_id=? AND program_id=? AND version=? AND status='active'").bind(hospitalId,ref.id,ref.version).first();
  if (!row) fail('PROGRAM_NOT_ASSIGNABLE',409);
  const p = parseProgram(row);
  if (!p.approvalRef || !p.approvedAt || !programEnabled(env,p.demo)) fail('PROGRAM_NOT_ASSIGNABLE',409);
  const { id, version, name, department, treatment, careDays, intervalDays, questions, instructions, reviewInstructions, followupDays, completion, demo } = p;
  return { enrollment:{id,version,name,department,treatment,careDays,intervalDays,questions,instructions,reviewInstructions,followupDays,completion,demo,startOn}, payload:row.payload };
}

export function checkedProgramAnswers(questions, input, fail) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !questions.some(q => q.id === key))) fail('INVALID_PROGRAM_ANSWERS');
  const answers = {};
  for (const q of questions) {
    const value = input[q.id];
    if (value === undefined || typeof value === 'string' && !value.trim()) {
      if (q.required) fail('INVALID_PROGRAM_ANSWERS');
      continue;
    }
    const valid = q.kind === 'single' ? q.options.includes(value)
      : q.kind === 'number' ? Number.isInteger(value) && value >= q.min && value <= q.max
      : q.kind === 'boolean' ? typeof value === 'boolean'
      : typeof value === 'string' && value.trim().length <= 120;
    if (!valid) fail('INVALID_PROGRAM_ANSWERS');
    answers[q.id] = q.kind === 'text' ? value.trim() : value;
  }
  if (Object.keys(answers).length === 0) fail('INVALID_PROGRAM_ANSWERS');
  return answers;
}

export async function programOperations(request, env, d) {
  const { staff, authorize, body, fail, json, id, text, digest } = d;
  const url = new URL(request.url);
  if (url.pathname !== '/api/care/staff/programs') return null;
  const s = await staff(request,env);
  const method = request.method;
  const b = method === 'GET' ? {hospitalId:url.searchParams.get('hospitalId')} : await body(request);
  const { hospitalId } = b;
  authorize(s,hospitalId);
  const role = s.roles[hospitalId], scope = s.departments[hospitalId];
  const hospitalRow = await env.DB.prepare('SELECT payload FROM care_hospitals WHERE id=?').bind(hospitalId).first();
  if (!hospitalRow) fail('HOSPITAL_NOT_FOUND',404);
  const hospital = JSON.parse(hospitalRow.payload);
  if (method === 'GET') {
    const programs = await listRecoveryPrograms(env,hospitalId);
    return json({
      programs:programs.filter(p => role === 'hospital_admin' || scope === p.department && (role === 'doctor' || p.state === 'active')),
      demo:isProgramDemo(env),
      assignmentEnabled:programEnabled(env,isProgramDemo(env)),
    });
  }
  const log = (action,actorHash) => env.DB.prepare("INSERT INTO care_audit(id,tenant_id,actor_hash,action,outcome,created_at) VALUES(?,?,?,?,?,?)").bind(id(),hospitalId,actorHash,action,'attempted',Date.now());
  if (method === 'POST') {
    authorize(s,hospitalId,'admin');
    const actorHash = await digest(s.user);
    const definition = {...normalizeProgram(b,hospital,env,fail,text),createdBy:actorHash};
    const programId = b.programId || id();
    const programs = await listRecoveryPrograms(env,hospitalId);
    if (programs.length >= 120) fail('PROGRAM_LIMIT_REACHED',409);
    const versions = programs.filter(p => p.id === programId);
    if (b.programId && !versions.length) fail('PROGRAM_NOT_FOUND',404);
    if (versions.some(p => p.department !== definition.department || p.demo !== definition.demo)) fail('INVALID_PROGRAM');
    const version = (versions[0]?.version || 0) + 1;
    const result = await env.DB.batch([
      env.DB.prepare("INSERT INTO care_program_versions(tenant_id,program_id,version,status,payload) SELECT ?,?,?,'draft',? WHERE EXISTS (SELECT 1 FROM care_hospitals WHERE id=? AND payload=?) ON CONFLICT(tenant_id,program_id,version) DO NOTHING").bind(hospitalId,programId,version,JSON.stringify(definition),hospitalId,hospitalRow.payload),
      log('program.create',actorHash),
    ]);
    if (!result[0].meta.changes) fail('RECORD_CHANGED',409);
    return json({ ...definition, id:programId, version, state:'draft' },201);
  }
  if (method !== 'PUT') fail('NOT_FOUND',404);
  const row = await env.DB.prepare('SELECT program_id,version,status,payload FROM care_program_versions WHERE tenant_id=? AND program_id=? AND version=?').bind(hospitalId,b.programId,b.version).first();
  if (!row) fail('PROGRAM_NOT_FOUND',404);
  const p = parseProgram(row);
  if (role !== 'hospital_admin' && scope !== p.department) fail('PROGRAM_REVIEW_REQUIRED',403);
  const from = { review:'draft', approved:'review', active:'approved', stopped:'active' }[b.state];
  if (!from || p.state !== from) fail('INVALID_PROGRAM_TRANSITION',409);
  const definition = JSON.parse(row.payload), actorHash = await digest(s.user);
  if (b.state === 'approved') {
    if (role !== 'doctor' || scope !== p.department || definition.createdBy === actorHash) fail('PROGRAM_REVIEW_REQUIRED',403);
    const approvalRef = text(b.approvalRef,150);
    if (!approvalRef || b.confirmed !== true) fail('PROGRAM_REVIEW_REQUIRED');
    Object.assign(definition,{approvalRef,approvedAt:new Date().toISOString(),approvedBy:actorHash});
  } else {
    authorize(s,hospitalId,'admin');
  }
  if (b.state === 'active' && (!p.approvalRef || !p.approvedAt || !programEnabled(env,p.demo))) fail('PROGRAM_NOT_ASSIGNABLE',409);
  const activation = b.state === 'active' ? " AND NOT EXISTS (SELECT 1 FROM care_program_versions WHERE tenant_id=? AND program_id=? AND status='active')" : '';
  const params = [b.state,JSON.stringify(definition),hospitalId,p.id,p.version,from];
  if (activation) params.push(hospitalId,p.id);
  const result = await env.DB.batch([
    env.DB.prepare('UPDATE care_program_versions SET status=?,payload=? WHERE tenant_id=? AND program_id=? AND version=? AND status=?'+activation).bind(...params),
    log('program.'+b.state,actorHash),
  ]);
  if (!result[0].meta.changes) fail('RECORD_CHANGED',409);
  return json({ saved:true });
}

