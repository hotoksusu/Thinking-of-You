"use client";
import {usePathname} from "next/navigation";import {AccessGuard} from "@/components/access-guard";
export default function Layout({children}:{children:React.ReactNode}){const path=usePathname();if(path==="/admin/login")return children;return <AccessGuard area="operator">{()=>children}</AccessGuard>}
