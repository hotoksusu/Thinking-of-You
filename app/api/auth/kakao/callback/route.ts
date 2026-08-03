export function GET() {
  return Response.json({ error: "카카오 인증 설정이 완료되지 않았습니다." }, { status: 501 });
}
