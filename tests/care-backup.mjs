import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {sealBackup,openBackup} from '../scripts/care-backup.mjs';
test('encrypted synthetic backup restores SQLite integrity and rejects wrong keys or tampering',()=>{const dir=mkdtempSync(join(tmpdir(),'care-backup-')),key=randomBytes(32);try{let db=new DatabaseSync(join(dir,'source.sqlite'));db.exec("CREATE TABLE synthetic(id TEXT PRIMARY KEY,value TEXT);INSERT INTO synthetic VALUES('qa','synthetic-only')");db.close();const bytes=readFileSync(join(dir,'source.sqlite')),sealed=sealBackup(bytes,key);assert.equal(sealed.includes(Buffer.from('synthetic-only')),false);assert.throws(()=>openBackup(sealed,randomBytes(32)));const tampered=Buffer.from(sealed);tampered[30]^=1;assert.throws(()=>openBackup(tampered,key));writeFileSync(join(dir,'restored.sqlite'),openBackup(sealed,key));db=new DatabaseSync(join(dir,'restored.sqlite'));assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('SELECT value FROM synthetic').get().value,'synthetic-only');db.close();}finally{key.fill(0);rmSync(dir,{recursive:true,force:true});}});
