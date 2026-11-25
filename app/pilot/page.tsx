'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { careRequest, CareServerError } from '@/lib/care-server';
import { departments, organizationTypes } from '@/lib/recovery-program';

const fields = [
  { name: 'hospital', label: '병원명', type: 'text', max: 100, autoComplete: 'organization' },
  { name: 'contact', label: '담당자명', type: 'text', max: 60, autoComplete: 'name' },
  { name: 'phone', label: '연락처', type: 'tel', max: 25, autoComplete: 'tel', optional: true },
  { name: 'email', label: '업무용 이메일', type: 'email', max: 200, autoComplete: 'email' },
  { name: 'treatment', label: '주요 수술·시술 유형', type: 'text', max: 100, autoComplete: 'off', optional: true },
];
const selections = [
  { name: 'organizationType', label: '의료기관 유형', options: organizationTypes, required: true },
  { name: 'department', label: '진료과', options: departments, required: true },
  { name: 'monthlyVolume', label: '월간 회복관리 대상 환자 수', options: ['30명 이하', '31~50명', '51~100명', '101~200명', '201명 이상', '확인 중'] },
  { name: 'currentWorkflow', label: '현재 사후관리 방식', options: ['전화·문자', '외래 중심', '전용 시스템', '별도 관리 없음', '기타'] },
  { name: 'existingSolution', label: '기존 환자관리 솔루션 이용 여부', options: ['사용 중', '사용한 적 있음', '사용 경험 없음'] },
  { name: 'adoptionGoal', label: '도입 검토 목적', options: ['파일럿 상담', '제품 시연', '업무 흐름 검토', '리포트 검토'] },
  { name: 'timeline', label: '도입 희망 시기', options: ['1개월 이내', '1~3개월', '3개월 이후', '검토 중'] },
];

export default function Pilot() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submitting = useRef(false);
  const purpose = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('purpose') === 'demo' && purpose.current?.value === '') {
      purpose.current.value = '제품 시연';
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setMessage('');
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await careRequest('pilot', 'POST', { ...form, version: 'v3', consent: form.consent === 'on' });
      setDone(true);
    } catch (error) {
      setMessage(error instanceof CareServerError && error.status === 400
        ? '입력 내용과 개인정보 이용 동의를 확인해주세요.'
        : '접수 결과를 확인하지 못했습니다. 입력 내용은 그대로 있으니 다시 시도해주세요.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return <main className="care-ui min-h-screen px-5 py-6">
    <div className="mx-auto max-w-2xl">
      <CareBrandLogo />
      <h1 className="mt-6">병원 도입 문의</h1>
      <p className="care-subtext mt-3">수술·시술 후 회복관리 업무를 알려주세요. 진료과와 치료 유형에 맞는 시연 및 도입 범위를 상담합니다.</p>
      <section className="care-surface my-5 p-5 sm:p-7">
        <h2>도입 담당자 정보</h2>
        <p className="my-3">병원 업무와 담당자 연락처만 입력해주세요. 환자 이름, 진단, 진료기록은 받지 않습니다.</p>
        {done ? <p role="status" className="rounded-xl bg-[#EFF4FD] p-4">상담 요청을 접수했습니다. 남겨주신 연락처로 상담 일정을 조율합니다.</p> :
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(field => <div key={field.name}>
                <label htmlFor={'pilot-'+field.name}>{field.label}{field.optional ? ' (선택)' : ''}</label>
                <input id={'pilot-'+field.name} required={!field.optional} name={field.name} type={field.type} maxLength={field.max} autoComplete={field.autoComplete} className="mt-1 block w-full" />
              </div>)}
              {selections.map(field => <div key={field.name}>
                <label htmlFor={'pilot-'+field.name}>{field.label}{field.required ? '' : ' (선택)'}</label>
                <select id={'pilot-'+field.name} ref={field.name==='adoptionGoal' ? purpose : undefined} required={field.required} name={field.name} defaultValue="" className="mt-1 block w-full">
                  <option value="">선택해주세요</option>{field.options.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>)}
            </div>
            <p id="pilot-consent" className="mt-2 text-base">담당자명, 연락처, 이메일과 병원 업무 정보를 상담과 신청 관리에 사용합니다. 동의를 거부할 수 있으며, 이 양식의 상담 접수에는 동의가 필요합니다. <Link href="/care/privacy" className="underline">정보 처리 안내</Link></p>
            <label className="flex min-h-12 items-center gap-3"><input required type="checkbox" name="consent" aria-describedby="pilot-consent" />상담을 위한 개인정보 이용에 동의합니다.</label>
            <button type="submit" className="primary" disabled={busy} aria-busy={busy}>{busy ? '접수 확인 중…' : '파일럿 상담 요청 접수'}</button>
            {message && <p role="alert">{message}</p>}
          </form>}
      </section>
    </div>
  </main>;
}
