export function GET() {
  return Response.json({ error: "카카오 로그인은 아직 설정되지 않았습니다. 이메일 로그인을 이용해 주세요." }, { status: 501 });
}
