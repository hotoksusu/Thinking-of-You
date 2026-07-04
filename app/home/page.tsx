import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/app?role=family");
}
