export const dynamic = "force-static";

export function GET() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/onboarding/add-parent?auth=mock" },
  });
}
