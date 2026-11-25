'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { OverviewHeader } from '@/components/overview-header';
import { CareServerError, careRequest } from '@/lib/care-server';
import { carePaths } from '@/lib/care-urls';
import { businessContactOptions } from '@/lib/overview-content';

const fields = [
  {name:'hospital',label:'회사·기관명',type:'text',autoComplete:'organization',maxLength:100},
  {name:'contact',label:'담당자명',type:'text',autoComplete:'name',maxLength:60},
  {name:'email',label:'업무용 이메일',type:'email',autoComplete:'email',maxLength:200},
];

export function BusinessInquiry({ purpose }: {purpose:keyof typeof businessContactOptions}) {
  const lock=useRef(false);
  const [status,setStatus]=useState<'idle'|'submitting'|'done'>('idle');
  const [error,setError]=useState('');
  const {title}=businessContactOptions[purpose];

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(lock.current)return;
    lock.current=true;
    setStatus('submitting');
    setError('');
    const fields=Object.fromEntries(new FormData(event.currentTarget));
    try{
      await careRequest('pilot','POST',{...fields,version:'business-v1',businessPurpose:purpose,consent:fields.consent==='on'});
      setStatus('done');
    }catch(error){
      setStatus('idle');
      setError(error instanceof CareServerError&&error.status===400?'입력 내용과 개인정보 이용 동의를 확인해 주세요.':'접수 결과를 확인하지 못했습니다. 입력 내용 확인 후 다시 시도해 주세요.');
    }finally{lock.current=false;}
  }

  return <div className="overview-site">
    <OverviewHeader current=""/>
    <main className="overview-main">
      <section className="overview-wrap business-form">
        <p className="overview-eyebrow">다녀온 사업 문의</p>
        <h1>{title}</h1>
        <p className="overview-lead">담당자 연락처를 남겨 주세요. 접수 내용을 확인한 후 남겨주신 이메일을 통해 안내합니다.</p>
        {status==='done'?<p className="business-confirmation" role="status">요청을 접수했습니다.</p>:
          <form onSubmit={submit}>
            {fields.map(field=><div key={field.name}>
              <label htmlFor={'business-'+field.name}>{field.label}</label>
              <input id={'business-'+field.name} name={field.name} type={field.type} autoComplete={field.autoComplete} maxLength={field.maxLength} required/>
            </div>)}
            <p id="business-consent">회사·기관명, 담당자명과 이메일을 문의 접수 및 회신에 사용합니다. 동의하셔야 접수할 수 있습니다. <Link href={carePaths.carePrivacy}>정보 처리 안내</Link></p>
            <label className="business-consent"><input type="checkbox" name="consent" required aria-describedby="business-consent"/> 문의 접수를 위한 개인정보 이용에 동의합니다.</label>
            <button type="submit" className="overview-button overview-button-primary" disabled={status==='submitting'}>{status==='submitting'?'접수 확인 중…':'요청 접수'}</button>
            {error&&<p role="alert">{error}</p>}
          </form>}
        <Link className="overview-text-link" href={carePaths.businessOverview}>사업소개 돌아가기</Link>
      </section>
    </main>
  </div>;
}

