import { UserMode } from "@/components/user-mode";
import { BottomTabBar } from "@/components/bottom-tab-bar";

type AppPageProps = {
  searchParams?: Promise<{
    registered?: string;
    role?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const params = await searchParams;
  const role = params?.role === "parent" || params?.role === "family" ? params.role : undefined;

  return <><UserMode initialRegistered={params?.registered === "1"} initialRole={role} /><BottomTabBar active={role === "parent" ? "record" : role === "family" ? "family" : "home"} /></>;
}
