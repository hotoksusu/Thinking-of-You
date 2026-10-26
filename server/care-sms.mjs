// SOLAPI REST v4, fixed provider origin. No clinical data or patient identifiers leave this service.
const smsText='오늘안부 Care 확인할 업무가 있습니다. 병원 담당자 화면을 확인해주세요.';
const smsPhone=v=>typeof v==='string'&&/^0\d{8,10}$/.test(v);
export const careSmsConfigured=env=>env.CARE_SMS_ENABLED==='true'&&!!env.SOLAPI_API_KEY&&!!env.SOLAPI_API_SECRET&&smsPhone(env.CARE_SMS_FROM);
async function smsAuth(env){const date=new Date().toISOString(),salt=crypto.randomUUID().replaceAll('-',''),key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SOLAPI_API_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']),bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(date+salt)),signature=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');return `HMAC-SHA256 apiKey=${env.SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;}
async function smsResult(env,row,status,code=null,providerId=null){await env.DB.batch([env.DB.prepare('UPDATE care_notifications SET status=?,error_code=?,provider_id=COALESCE(?,provider_id),next_attempt_at=?,updated_at=? WHERE id=? AND tenant_id=? AND lease=?').bind(status,code,providerId,Date.now()+Math.min(3600000,60000*2**row.attempts),Date.now(),row.id,row.tenant_id,row.lease),env.DB.prepare('INSERT INTO care_notification_attempts(id,tenant_id,notification_id,status,code,created_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),row.tenant_id,row.id,status,code,Date.now())]);return {status,code};}
export async function sendCareNotice(env,tenant,noticeId){
 const row=await env.DB.prepare('SELECT * FROM care_notifications WHERE id=? AND tenant_id=?').bind(noticeId,tenant).first();if(!row)return {status:'not_found'};
 if(!careSmsConfigured(env))return {status:'not_configured'};
 const p=await env.DB.prepare('SELECT payload FROM care_policies WHERE tenant_id=?').bind(tenant).first(),policy=p?JSON.parse(p.payload):{};
 if(!policy.smsEnabled||!policy.smsApprovedAt||!smsPhone(policy.alertPhone))return {status:'not_configured'};
 if(!['not_configured','queued','failed'].includes(row.status)||row.attempts>=3||row.next_attempt_at>Date.now())return {status:row.status};
 const dailyLimit=Math.max(1,Math.min(1000,Number(env.CARE_SMS_DAILY_LIMIT)||50)),dayStart=Date.parse(new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'})+'T00:00:00+09:00');
 const lease=crypto.randomUUID(),claimed=await env.DB.prepare("UPDATE care_notifications SET status='sending',attempts=attempts+1,lease=?,updated_at=? WHERE id=? AND tenant_id=? AND status=? AND attempts=? AND (SELECT COALESCE(SUM(attempts),0) FROM care_notifications WHERE updated_at>=?)<?").bind(lease,Date.now(),row.id,tenant,row.status,row.attempts,dayStart,dailyLimit).run();if(!claimed.meta.changes)return {status:'busy_or_daily_limit'};row.lease=lease;row.attempts++;
 try{const response=await (env.CARE_SMS_FETCH||fetch)('https://api.solapi.com/messages/v4/send-many/detail',{method:'POST',headers:{'Content-Type':'application/json',Authorization:await smsAuth(env)},body:JSON.stringify({messages:[{to:policy.alertPhone,from:env.CARE_SMS_FROM,type:'SMS',text:smsText}],allowDuplicates:false}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)return smsResult(env,row,response.status>=500?'unknown':'failed','HTTP_'+response.status);
  const data=await response.json(),message=data.messageList?.[0];if(message?.messageId&&message.statusCode==='2000')return smsResult(env,row,'accepted',null,message.messageId);
  if(data.failedMessageList?.length)return smsResult(env,row,'failed','PROVIDER_REJECTED');return smsResult(env,row,'unknown','UNCONFIRMED_RESPONSE');
 }catch{return smsResult(env,row,'unknown','NETWORK_OR_TIMEOUT');}
}
export async function syncCareNotice(env,tenant,noticeId){
 const row=await env.DB.prepare('SELECT * FROM care_notifications WHERE id=? AND tenant_id=?').bind(noticeId,tenant).first();if(!row||!careSmsConfigured(env))return {status:'not_configured'};
 if(row.status==='sending'&&row.updated_at<Date.now()-60000){await env.DB.prepare("UPDATE care_notifications SET status='unknown',error_code='INTERRUPTED' WHERE id=? AND tenant_id=? AND status='sending'").bind(noticeId,tenant).run();return {status:'unknown'};}
 if(!row.provider_id)return {status:row.status};
 try{const response=await (env.CARE_SMS_FETCH||fetch)('https://api.solapi.com/messages/v4/list?'+new URLSearchParams({criteria:'messageId',cond:'eq',value:row.provider_id,limit:'1'}),{headers:{Authorization:await smsAuth(env)},signal:AbortSignal.timeout(12000)});if(!response.ok)return {status:row.status};const data=await response.json(),message=data.messageList?.[row.provider_id];if(!message)return {status:row.status};if(message.status==='COMPLETE'){const status=message.statusCode==='4000'?'delivered':'failed';return smsResult(env,row,status,message.statusCode==='4000'?null:'DELIVERY_FAILED');}return {status:row.status};}catch{return {status:row.status};}
}
