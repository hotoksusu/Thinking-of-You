import type {Metadata} from "next";
import {CompanyV2} from "@/components/company-v2";

export const metadata:Metadata={
  title:"오늘안부 Care | 병원경영을 위한 퇴원환자 관리 Workflow",
  description:"퇴원 후 환자 상태 확인부터 병원의 후속관리까지 하나의 흐름으로 연결하는 B2B SaaS입니다.",
};
export default function Layout({children:_children}:{children:React.ReactNode}){return <CompanyV2/>}
