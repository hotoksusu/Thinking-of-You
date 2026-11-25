'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { careBrand, careDemo } from '@/lib/care-brand';
import { carePaths, careUrls } from '@/lib/care-urls';
import { healthcareProposal, proposalEdition } from '@/lib/overview-content';

const total=healthcareProposal.length;
const demoHref=careDemo.available?carePaths.demo:carePaths.contact+'?purpose=demo';
const demoLabel=careDemo.available?'제품 체험하기':'제품 시연 문의';
const printInquiry=new URL(carePaths.inquiry,careUrls.productionOrigin).href;

function pageFromHash() {
  const index=healthcareProposal.findIndex(page=>'#'+page.id===window.location.hash);
  return index<0?0:index;
}

export function HealthcareProposal() {
  const documentView=useRef<HTMLElement>(null);
  const toc=useRef<HTMLDetailsElement>(null);
  const [index,setIndex]=useState(0);
  const [presenting,setPresenting]=useState(false);
  const [fullscreen,setFullscreen]=useState(false);
  const [immersive,setImmersive]=useState(false);

  const jump=useCallback((target:number)=>{
    if(target<0||target>=total)return;
    const id=healthcareProposal[target].id;
    if(window.location.hash!=='#'+id) window.history.pushState(null,'','#'+id);
    setIndex(target);
    if(!presenting) document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});
  },[presenting]);

  useEffect(()=>{
    const sync=()=>setIndex(pageFromHash());
    sync();
    window.addEventListener('hashchange',sync);
    window.addEventListener('popstate',sync);
    return ()=>{
      window.removeEventListener('hashchange',sync);
      window.removeEventListener('popstate',sync);
    };
  },[]);

  useEffect(()=>{
    if(presenting)return;
    let frame=0;
    const syncScroll=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const line=Math.min(window.innerHeight*.32,220);
        const last=healthcareProposal.findLastIndex(page=>(document.getElementById(page.id)?.getBoundingClientRect().top??Infinity)<=line);
        setIndex(Math.max(0,last));
      });
    };
    window.addEventListener('scroll',syncScroll,{passive:true});
    return ()=>{window.removeEventListener('scroll',syncScroll);cancelAnimationFrame(frame);};
  },[presenting]);

  useEffect(()=>{
    const sync=()=>setFullscreen(document.fullscreenElement===documentView.current);
    document.addEventListener('fullscreenchange',sync);
    return ()=>document.removeEventListener('fullscreenchange',sync);
  },[]);

  useEffect(()=>{
    if(!immersive)return;
    const overflow=document.body.style.overflow;
    const surrounding=documentView.current?.closest('.overview-site')?.querySelectorAll<HTMLElement>('.overview-header,.proposal-page-title');
    const targets=[...(surrounding||[])].filter(element=>!element.inert);
    document.body.style.overflow='hidden';
    targets.forEach(element=>{element.inert=true;});
    return ()=>{
      document.body.style.overflow=overflow;
      targets.forEach(element=>{element.inert=false;});
    };
  },[immersive]);

  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'&&immersive){setImmersive(false);return;}
      if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.defaultPrevented)return;
      if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
        event.preventDefault();
        jump(index+(event.key==='ArrowLeft'?-1:1));
      }
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[immersive,index,jump]);

  async function changeFullscreen() {
    if(fullscreen){await document.exitFullscreen?.();return;}
    if(immersive){setImmersive(false);return;}
    setPresenting(true);
    if(document.fullscreenEnabled&&documentView.current?.requestFullscreen){
      try{await documentView.current.requestFullscreen();return;}catch{}
    }
    setImmersive(true);
  }

  async function changeView() {
    if(!presenting){
      setPresenting(true);
      documentView.current?.scrollIntoView({block:'start',behavior:'instant'});
      return;
    }
    if(fullscreen) await document.exitFullscreen?.();
    setImmersive(false);
    setPresenting(false);
    const id=healthcareProposal[index].id;
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}));
  }

  return <section className="proposal-view" aria-label="의료기관용 상품소개서" data-presenting={presenting} data-immersive={immersive} ref={documentView}>
    <div className="proposal-tools no-print">
      <details ref={toc} className="proposal-toc">
        <summary>전체 목차</summary>
        <ol>
          {healthcareProposal.map((page,i)=><li key={page.id}><a href={'#'+page.id} aria-current={index===i?'location':undefined} onClick={event=>{
            if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
            event.preventDefault();
            jump(i);
            if(toc.current){toc.current.open=false;toc.current.querySelector('summary')?.focus({preventScroll:true});}
          }}>{page.label}</a></li>)}
        </ol>
      </details>
      <div className="proposal-pagination" aria-label="쪽 이동">
        <button type="button" aria-label="이전 쪽" onClick={()=>jump(index-1)} disabled={index===0}><ArrowLeft size={16} aria-hidden/></button>
        <span aria-live="polite">{index+1} / {total}</span>
        <button type="button" aria-label="다음 쪽" onClick={()=>jump(index+1)} disabled={index===total-1}><ArrowRight size={16} aria-hidden/></button>
      </div>
      <div className="proposal-display">
        <button type="button" onClick={()=>void changeView()}>{presenting?'문서 보기':'프레젠테이션'}</button>
        <button type="button" onClick={()=>void changeFullscreen()}>{fullscreen||immersive?'전체 화면 종료':'전체 화면 보기'}</button>
        <a href={'#'+healthcareProposal[index].id} onClick={event=>{event.preventDefault();jump(index);}} aria-label="현재 쪽 주소 반영">현재 쪽 링크</a>
      </div>
    </div>

    <div className="proposal-document">
      {healthcareProposal.map((page,i)=><article className="proposal-sheet" key={page.id} id={page.id} hidden={presenting&&index!==i} aria-labelledby={'heading-'+page.id}>
        <header className="proposal-sheet-header">
          <div><Image src={careBrand.logo} alt="" width={30} height={30}/><strong>{careBrand.name}</strong></div>
          <span>의료기관용 상품소개서</span>
        </header>
        <div className="proposal-sheet-body" data-image={!!page.screen} data-portrait={!!page.screen&&page.screen.height>page.screen.width}>
          <div className="proposal-sheet-copy">
            <p className="overview-eyebrow">{page.label}</p>
            <h2 id={'heading-'+page.id}>{page.title}</h2>
            <p className="proposal-description">{page.description}</p>
            {page.sequence && <ol className="proposal-sequence">{page.sequence.map(text=><li key={text}>{text}</li>)}</ol>}
            {page.points && <dl className="proposal-points">{page.points.map(({title,description})=><div key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>}
            {page.note && <p className="proposal-note">{page.note}</p>}
            {i===total-1 && <div className="overview-actions no-print">
              <Link className="overview-button overview-button-primary" href={demoHref}>{demoLabel}</Link>
              <a className="overview-button" href={proposalEdition.pdfPath} download>PDF 다운로드</a>
              <Link className="overview-button" href={carePaths.contact}>병원 도입 문의</Link>
            </div>}
          </div>
          {page.screen&&<figure className="proposal-image">
            <Image src={'/brand/product/'+page.screen.file+'.webp'} width={page.screen.width} height={page.screen.height} alt={page.screen.alt}/>
            <figcaption>실제 제품 화면 · 합성 데이터</figcaption>
          </figure>}
        </div>
        <footer className="proposal-sheet-footer">
          <span>v{proposalEdition.version} · <time dateTime={proposalEdition.issuedOn}>{proposalEdition.issuedOn}</time></span>
          <a href={careUrls.productionOrigin}>{new URL(careUrls.productionOrigin).host}</a>
          <span>{String(i+1).padStart(2,'0')} / {total}</span>
          {i===total-1&&<a className="proposal-print-contact" href={printInquiry}>병원 도입 문의 · {printInquiry}</a>}
        </footer>
      </article>)}
    </div>
  </section>;
}

