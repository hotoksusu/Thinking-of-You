// Offline encryption utility. Call only with an approved export; never prints data or keys.
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
export function sealBackup(bytes,key){if(key.length!==32)throw Error('32-byte key required');const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);return Buffer.concat([Buffer.from('CAREBK01'),iv,cipher.update(bytes),cipher.final(),cipher.getAuthTag()]);}
export function openBackup(bytes,key){if(bytes.subarray(0,8).toString()!=='CAREBK01'||key.length!==32)throw Error('Invalid backup or key');const decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(8,20));decipher.setAuthTag(bytes.subarray(-16));return Buffer.concat([decipher.update(bytes.subarray(20,-16)),decipher.final()]);}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [mode,input,output]=process.argv.slice(2),secret=process.env.CARE_BACKUP_KEY;if(!['encrypt','decrypt'].includes(mode)||!input||!output||!/^[a-f0-9]{64}$/i.test(secret||''))throw Error('Use encrypt|decrypt INPUT NEW_OUTPUT and CARE_BACKUP_KEY (64 hex characters)');const key=Buffer.from(secret,'hex');try{writeFileSync(output,(mode==='encrypt'?sealBackup:openBackup)(readFileSync(input),key),{flag:'wx',mode:0o600});}finally{key.fill(0);}}
