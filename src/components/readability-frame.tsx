"use client";
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';

// Presentation preference only. Never reads authentication, role or clinical data.
const textPreference='oneul-anbu:patient-text-size:v1';
export function ReadabilityFrame({children}:{children:React.ReactNode}){
 const path=usePathname();
 const patient=/^\/(patient|i)(\/|$)/.test(path)||path.startsWith('/app/patient')||path.startsWith('/demo/patient')||['/help','/settings/privacy','/care/privacy','/care/help'].includes(path);
 const hospital=!patient&&(/^\/(admin|demo\/hospital|hospital\/(dashboard|login)|care\/(server|hospital|settings|management|recovery|appointments|protocols))(\/|$)/.test(path));
 const [large,setLarge]=useState(false);
 useEffect(()=>{try{setLarge(localStorage.getItem(textPreference)==='large');}catch{/* Browser font/zoom settings remain usable. */}},[]);
 function choose(value:boolean){setLarge(value);try{localStorage.setItem(textPreference,value?'large':'default');}catch{/* Keep the current view preference without storage. */}}
 return <div className={'ui-scope '+(patient?'patient-ui':hospital?'hospital-ui':'public-ui')} data-text-size={patient&&large?'large':'default'}>
 {patient?<div className="patient-display-tools" role="group" aria-label="환자 화면 글씨 크기"><span>글씨 크기</span><button type="button" aria-pressed={!large} onClick={()=>choose(false)}>기본 글씨</button><button type="button" aria-pressed={large} onClick={()=>choose(true)}>큰 글씨</button></div>:null}
 {children}</div>;
}
