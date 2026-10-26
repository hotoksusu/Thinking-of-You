// Read only the staged blobs, never local secret environment files or credential helpers.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
const root=process.cwd().replaceAll('\\','/');
const git=(...args)=>execFileSync('git',['-c','safe.directory='+root,...args],{maxBuffer:32*1024*1024});
const branch=git('branch','--show-current').toString().trim();
if(!branch.startsWith('codex/'))throw Error('Review must run on a separate codex branch');
if(git('diff','--cached','--name-only','--diff-filter=U').toString().trim())throw Error('Unmerged staged files');
const names=git('diff','--cached','--name-only','--diff-filter=ACMR','-z').toString().split('\0').filter(Boolean);
const reportPath='qa/prepush-review.json',findings=[],manifest=[];
const patterns=[
 ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g],
 ['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
 ['openai-token',/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g],
 ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
 ['literal-patient-token',/\bsrv_[a-f0-9]{64}\b/g],
 ['merge-marker',/^(?:<{7}|={7}|>{7})(?: |$)/gm],
];
for(const name of names){
 if(name===reportPath)continue; // The generated manifest cannot hash itself.
 const bytes=git('show',':'+name);manifest.push({path:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 if(/(?:^|\/)\.env(?:$|\.)/.test(name)&&!name.endsWith('.env.example')||/\.(?:sqlite(?:3)?|db|pem|p12|pfx|key)$/i.test(name))findings.push({path:name,rule:'prohibited-secret-or-database-file'});
 if(bytes.includes(0)||bytes.subarray(0,4).equals(Buffer.from([137,80,78,71])))continue;
 const content=bytes.toString('utf8');
 for(const [rule,pattern] of patterns){pattern.lastIndex=0;for(const match of content.matchAll(pattern))findings.push({path:name,rule,line:content.slice(0,match.index).split('\n').length});}
 if(name==='.env.example')for(const [index,line] of content.split('\n').entries()){const match=/^\s*([A-Z0-9_]*(?:SECRET|TOKEN|API_KEY|PASSWORD)[A-Z0-9_]*)\s*=\s*(\S+)/.exec(line);if(match)findings.push({path:name,rule:'nonempty-example-secret',line:index+1});}
}
const vercel=JSON.parse(git('show',':vercel.json').toString());
if(vercel.git?.deploymentEnabled!==false)findings.push({path:'vercel.json',rule:'automatic-deployment-not-disabled'});
const workflows=git('ls-files','.github/workflows').toString().trim();
if(workflows)findings.push({path:'.github/workflows',rule:'workflow-needs-manual-deployment-review'});
const result={branch,baseCommit:git('rev-parse','origin/main').toString().trim(),scope:'staged blobs; generated report excluded from self hash',files:manifest.length,findings,automaticDeploymentGuard:{vercelGitDeploymentEnabled:vercel.git?.deploymentEnabled,githubWorkflowsPresent:!!workflows,sitesPublishInvoked:false},limitations:['Pattern scan and manual source review; not a complete secret/PII certification.','Synthetic QA screenshots were reviewed separately.','External repository administration/webhooks are not completely inventoried by this scanner.'],manifest};
writeFileSync(reportPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({branch,files:result.files,findings:findings.length,report:reportPath}));
if(findings.length)process.exitCode=1;
