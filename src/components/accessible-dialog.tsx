"use client";
import {useEffect,useRef} from 'react';
export function AccessibleDialog({labelledBy,onClose,children}:{labelledBy:string;onClose:()=>void;children:React.ReactNode}){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null,scroll=document.body.style.overflow;document.body.style.overflow='hidden';const dialog=ref.current;const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')||[]);(dialog?.querySelector<HTMLElement>('[data-dialog-initial-focus]')||focusable()[0]||dialog)?.focus();
 const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();onClose();}if(e.key==='Tab'){const list=focusable(),first=list[0],last=list.at(-1);if(!first){e.preventDefault();dialog?.focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};dialog?.addEventListener('keydown',key);return()=>{dialog?.removeEventListener('keydown',key);document.body.style.overflow=scroll;previous?.focus();};},[onClose]);
 return <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center"><section ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} className="mx-auto w-full max-w-[520px] rounded-2xl bg-white p-6">{children}</section></div>;
}
