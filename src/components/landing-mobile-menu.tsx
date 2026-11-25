'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

export function LandingMobileMenu({ links, icon }: {links:{href:string;label:string}[];icon:ReactNode}) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <details className="landing-mobile-menu" ref={menu} onKeyDown={event=>{
    if (event.key==='Escape' && menu.current?.open) {
      menu.current.open=false;
      menu.current.querySelector('summary')?.focus();
    }
  }}>
    <summary>{icon} 메뉴</summary>
    <nav aria-label="모바일 주요 메뉴" onClick={event=>{
      if (menu.current && event.target instanceof Element && event.target.closest('a')) {
        menu.current.open=false;
      }
    }}>
      {links.map(item=>item.href.startsWith('#')
        ? <a key={item.href} href={item.href}>{item.label}</a>
        : <Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>
  </details>;
}

