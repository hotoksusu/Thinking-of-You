import { UserMode } from "@/components/user-mode";

type AppPageProps = {
  searchParams?: Promise<{
    registered?: string;
    role?: string;
    view?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const params = await searchParams;
  const role = params?.role === "parent" || params?.role === "family" ? params.role : undefined;
  const parentView = params?.view === "record" || params?.view === "photos" || params?.view === "farm" || params?.view === "profile" || params?.view === "guide"
    ? params.view
    : "home";
  const familyView = params?.view === "reassurance" || params?.view === "changes" || params?.view === "compose" || params?.view === "farm" || params?.view === "profile" || params?.view === "guide"
    ? params.view
    : "home";

  return <UserMode initialRegistered={params?.registered === "1"} initialRole={role} initialParentView={parentView} initialFamilyView={familyView} />;
}
