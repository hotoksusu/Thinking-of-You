"use client";
import {useEffect,useState} from 'react';
export const seoulToday=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
export function useCareDay(){const [day,setDay]=useState(seoulToday);useEffect(()=>{const refresh=()=>setDay(seoulToday());const timer=window.setInterval(refresh,60000);window.addEventListener('focus',refresh);return()=>{window.clearInterval(timer);window.removeEventListener('focus',refresh);};},[]);return day;}
