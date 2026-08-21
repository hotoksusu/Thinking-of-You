import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, FileText, HeartPulse, Link2Off } from "lucide-react";

const states={
  "invalid-link":{icon:<Link2Off/>,title:"사용할 수 없는 링크예요.",text:"병원에서 받은 최근 안내 문자를 다시 확인해주세요.",cta:"병원 연락처 보기",href:"/patient"},
  expired:{icon:<Clock3/>,title:"회복관리 초대가 만료되었어요.",text:"서울온병원에 새 초대를 요청해주세요.",cta:"병원 연락처 보기",href:"/patient"},
  connected:{icon:<CheckCircle2/>,title:"이미 회복관리에 연결되어 있어요.",text:"지금 오늘안부를 열고 오늘 할 일을 확인할 수 있어요.",cta:"오늘안부 열기",href:"/patient"},
  completed:{icon:<FileText/>,title:"이 회복관리 프로그램은 종료되었어요.",text:"30일간의 체크인과 회복 기록을 리포트로 확인해보세요.",cta:"회복 리포트 보기",href:"/patient"},
};
export function PatientStatus({state}:{state:string}){const item=states[state as keyof typeof states]??{icon:<AlertCircle/>,title:"안내를 확인할 수 없어요.",text:"병원에 문의해주세요.",cta:"오늘안부로",href:"/patient"};return <main className="min-h-screen bg-[#eef3f0] px-5 py-8 text-[#172720]"><div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[520px] flex-col rounded-3xl bg-white p-6 shadow-xl"><Link href="/" className="flex items-center gap-2 text-lg font-black text-[#123f35]"><HeartPulse/>오늘안부</Link><div className="my-auto text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#e9f3ef] text-[#1d6b5b] [&>svg]:size-9">{item.icon}</span><h1 className="mt-7 text-3xl font-black leading-tight">{item.title}</h1><p className="mt-4 text-lg font-semibold leading-8 text-[#63746e]">{item.text}</p><Link href={item.href} className="mt-8 flex min-h-16 items-center justify-center rounded-2xl bg-[#1d6b5b] text-lg font-black text-white">{item.cta}</Link></div></div></main>}
