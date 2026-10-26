import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,sep,basename} from 'node:path';
import {randomBytes} from 'node:crypto';
import {sealBackup,openBackup} from '../scripts/care-backup.mjs';
const originalTables=['care_hospitals','care_staff','care_patients','care_invitations','care_sessions','care_checkins','care_alerts'];
const sql=name=>readFileSync('drizzle/'+name,'utf8');
function seed(db){
 db.exec('PRAGMA foreign_keys=ON');db.exec(sql('0000_care_server.sql'));
 for(const n of [1,2]){
  const hospital='synthetic-hospital-'+n,patient='synthetic-patient-'+n;
  db.prepare('INSERT INTO care_hospitals VALUES(?,?)').run(hospital,JSON.stringify({id:hospital,name:'합성 병원 '+n}));
  db.prepare('INSERT INTO care_staff VALUES(?,?)').run('synthetic-staff-'+n+'@example.test',hospital);
  db.prepare('INSERT INTO care_patients VALUES(?,?,?,?)').run(patient,hospital,JSON.stringify({id:patient,hospitalId:hospital,name:'합성 환자 '+n,careStatus:n===1?'active':'completed'}),'synthetic-source-'+n);
  db.prepare('INSERT INTO care_invitations VALUES(?,?,?,?,?,?,?)').run('invite-'+n,'synthetic-hash-'+n,patient,hospital,n===1?Date.now()+86400000:1,n===1?0:1,1);
  db.prepare('INSERT INTO care_sessions VALUES(?,?,?,?,?,?)').run('session-hash-'+n,'invite-'+n,patient,hospital,Date.now()+86400000,1);
  db.prepare('INSERT INTO care_checkins VALUES(?,?,?,?,?)').run(patient,hospital,'2026-10-01',JSON.stringify({id:'original-check-'+n,patientId:patient,date:'2026-10-01',painScore:n===1?null:0,mobilityScore:1,hasConcern:false,updatedAt:'2026-10-01T01:00:00Z'}),'2026-10-01T01:00:00Z');
  db.prepare('INSERT INTO care_alerts VALUES(?,?,?,?)').run('alert-'+n,patient,hospital,JSON.stringify({id:'alert-'+n,patientId:patient,status:n===1?'open':'resolved',reason:'합성 신호'}));
 }
}
function snapshot(db){return Object.fromEntries(originalTables.map(table=>[table,db.prepare('SELECT * FROM '+table+' ORDER BY rowid').all().map(row=>({...row}))]));}
function cleanup(dir){const root=resolve(tmpdir());if(!resolve(dir).startsWith(root+sep)||!basename(dir).startsWith('care-migration-qa-'))throw Error('Unsafe cleanup target');rmSync(dir,{recursive:true,force:true});}
test('file-backed migration rehearsal: all original data survives, encrypted baseline restores and reopens',()=>{
 const dir=mkdtempSync(join(tmpdir(),'care-migration-qa-')),key=randomBytes(32);let db;
 try{
  const source=join(dir,'isolated.sqlite');db=new DatabaseSync(source);seed(db);const before=snapshot(db);db.close();db=null;
  const encrypted=sealBackup(readFileSync(source),key);writeFileSync(join(dir,'baseline.encrypted'),encrypted);
  db=new DatabaseSync(source);db.exec('PRAGMA foreign_keys=ON');db.exec('BEGIN');try{db.exec(sql('0001_care_operations.sql'));db.exec(sql('0002_care_sms.sql'));db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
  const after=snapshot(db);for(const row of after.care_staff){assert.equal(row.role,'nurse');assert.equal(row.active,1);assert.equal(row.expires_at,null);delete row.role;delete row.active;delete row.expires_at;}for(const row of after.care_sessions){assert.equal(row.last_seen_at,0);delete row.last_seen_at;}
  assert.deepEqual(after,before);assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('SELECT count(*) n FROM care_work').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM care_notifications').get().n,0);db.close();db=null;
  db=new DatabaseSync(source);assert.equal(db.prepare('SELECT count(*) n FROM care_patients').get().n,2);db.close();db=null;
  const restored=join(dir,'restored-baseline.sqlite');writeFileSync(restored,openBackup(readFileSync(join(dir,'baseline.encrypted')),key));db=new DatabaseSync(restored);assert.deepEqual(snapshot(db),before);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('PRAGMA table_info(care_staff)').all().some(c=>c.name==='role'),false);
 }finally{db?.close();key.fill(0);cleanup(dir);}
});
test('failed schema migration rolls back both DDL and original data in isolated SQLite transaction',()=>{
 const db=new DatabaseSync(':memory:');try{seed(db);const before=snapshot(db);db.exec('BEGIN');try{db.exec(sql('0001_care_operations.sql'));db.exec('INSERT INTO deliberately_missing_table VALUES(1)');assert.fail('Expected injected migration failure');}catch{db.exec('ROLLBACK');}assert.deepEqual(snapshot(db),before);assert.equal(db.prepare('PRAGMA table_info(care_staff)').all().some(c=>c.name==='role'),false);assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE name='care_work'").get().n,0);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');}finally{db.close();}
});
