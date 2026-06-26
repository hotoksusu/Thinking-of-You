import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(
      new URL("/onboarding/add-parent?auth=mock", request.nextUrl.origin),
    );
  }

  const authUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(authUrl);
}
