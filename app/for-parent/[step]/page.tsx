import { RoleOnboarding } from "@/components/role-onboarding";
export function generateStaticParams(){return [1,2,3,4].map(step=>({step:String(step)}))}
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;return <RoleOnboarding role="parent" initialStep={Number(step)||1}/>}
