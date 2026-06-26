import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const onboardingUrl = new URL("/onboarding/add-parent", request.nextUrl.origin);

  if (!code) {
    onboardingUrl.searchParams.set("auth", "mock");
    return NextResponse.redirect(onboardingUrl);
  }

  onboardingUrl.searchParams.set("auth", "kakao");
  return NextResponse.redirect(onboardingUrl);
}
