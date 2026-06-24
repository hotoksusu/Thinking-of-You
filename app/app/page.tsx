import { UserMode } from "@/components/user-mode";

type AppPageProps = {
  searchParams?: Promise<{
    registered?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const params = await searchParams;

  return <UserMode initialRegistered={params?.registered === "1"} />;
}
