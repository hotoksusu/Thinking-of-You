import { PatientEntryRedirect } from "@/components/patient-entry-redirect";
export default function PatientLanding() {
 return <main className="grid min-h-screen place-items-center bg-[#F1F0E9] px-5 text-[#202923]"><PatientEntryRedirect /><section className="w-full max-w-[560px] rounded-[28px] bg-[#FFFCF7] p-8"><p className="font-black text-[#315E50]">오늘안부 Care</p><h1 className="mt-5 text-3xl font-black">병원에서 받은 링크를 열어주세요.</h1><p className="mt-4 text-lg font-semibold leading-8 text-[#52635C]">문자나 카카오톡으로 받은 회복관리 링크에서 오늘 상태를 입력할 수 있습니다. 링크가 없거나 만료되었다면 병원에 다시 요청해주세요.</p></section></main>;
}
