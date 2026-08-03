# 오늘안부

부모님은 필요한 날에만 간단히 답하고 가족은 평소와 다른 날을 확인하는 생활 변화 안심 서비스입니다. 의료 진단이나 응급 구조 서비스가 아닙니다.

## 기술 구조

- 프런트엔드/서버: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- 패키지 관리: pnpm (`pnpm-lock.yaml`을 기준으로 설치)
- 소스 관리: GitHub `main`은 Production, 기능 브랜치와 PR은 Preview
- 정식 배포: Vercel의 Next.js 서버 런타임
- 인증/DB: Supabase Auth, PostgreSQL, RLS
- 정적 콘텐츠: 앱 코드와 이미지에 유지하고 사용자 기록만 DB에 저장
- PWA: 기존 manifest와 service worker 유지
- AI: 현재 연결하지 않음. 향후 `OPENAI_API_KEY`를 서버 Route에서만 사용
- OpenAI Sites: 기존 정적 데모용 빌드 메타데이터를 유지하며, Supabase 정식 서비스는 Vercel 배포를 기준으로 운영

## 로컬 실행

```bash
git clone https://github.com/hotoksusu/Thinking-of-You.git
cd Thinking-of-You
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local`에 개발용 Supabase 공개 설정을 입력합니다. 환경변수를 바꾸면 개발 서버를 다시 시작하고 Vercel에서는 재배포해야 합니다.

## 환경변수

| 변수 | 노출 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저 공개 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 브라우저 공개 | RLS가 적용되는 anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 | 향후 제한된 관리자 작업 전용. 현재 일반 요청에서는 사용하지 않음 |
| `OPENAI_API_KEY` | 서버 전용 | 향후 AI 프록시 전용 |
| `ADMIN_EMAILS` | 서버 전용 | 향후 서버 관리자 검증 보조값 |
| `APP_BASE_URL` | 서버 | 인증 callback의 기준 URL |
| `AI_DAILY_LIMIT` 등 | 서버 | 비용과 남용 방지 한도 |

`NEXT_PUBLIC_` 접두사가 붙은 값에는 비밀키를 넣지 마세요. 서비스 역할 키와 AI 키는 브라우저 컴포넌트에서 import하지 않습니다.

## Supabase 설정

1. Supabase Dashboard에서 Development/Preview용과 Production용 프로젝트를 분리합니다.
2. SQL Editor 또는 Supabase CLI에서 `supabase/migrations`의 파일을 번호 순서대로 적용합니다.
3. Authentication → Providers → Email에서 이메일 OTP/Magic Link를 활성화합니다.
4. Authentication → URL Configuration에서 Site URL과 Redirect URL을 설정합니다.
   - 로컬: `http://localhost:3000/auth/callback`
   - Preview: `https://<preview-domain>/auth/callback`
   - Production: `https://<production-domain>/auth/callback`
5. Table Editor에서 사용자 데이터 테이블의 RLS가 켜졌는지 확인합니다.
6. Storage는 사용자 업로드 기능을 실제로 추가할 때만 버킷과 정책을 생성합니다.

스키마는 프로필, 찜, 활동 이력, 답변, 추천 세션, 피드백과 기존 로컬 기록 이전 테이블을 포함합니다. 구독 테이블은 결제 제공자가 정해지기 전까지 생성하지 않습니다.

## Vercel 설정

1. Vercel Dashboard → Add New → Project에서 GitHub 저장소를 연결합니다.
2. Framework Preset은 Next.js, Root Directory는 저장소 루트로 둡니다.
3. Install Command는 `pnpm install --frozen-lockfile`, Build Command는 `pnpm build`로 설정합니다.
4. Settings → Git에서 Production Branch를 `main`으로 설정합니다.
5. Settings → Environment Variables에 Supabase 값을 환경별로 입력합니다.
   - Preview에는 테스트 Supabase 프로젝트 값
   - Production에는 운영 Supabase 프로젝트 값
6. Settings → Domains에서 개인 도메인을 연결하고 Supabase Redirect URL에도 같은 도메인을 추가합니다.

## 배포 흐름

```text
feature/* 또는 fix/* 브랜치
→ GitHub push
→ Vercel Preview에서 검수
→ main 병합
→ Production 자동 배포 확인
```

## 사용자 데이터 이전

로그인 성공 시 승인된 핵심 localStorage 키만 형식과 크기를 검증해 `local_data_imports`에 upsert합니다. 서버 저장 성공 응답을 받은 키만 로컬에서 제거하고, 실패 시 기존 기록을 보존합니다. 이전 완료 플래그로 반복 전송을 막습니다. 온보딩 여부, 권한 안내, 테마 같은 기기별 설정은 로컬에 유지합니다.

## 보안 및 운영

- 모든 사용자 데이터 테이블은 RLS로 본인 행만 접근합니다.
- 공개 활동은 `is_published = true`인 행만 익명 조회할 수 있습니다.
- 관리자 권한은 클라이언트 이메일 비교로 결정하지 않습니다.
- 카카오 OAuth 설정이 없으므로 기존 mock 로그인 Route는 비활성화했습니다.
- 법률 페이지는 운영자/법률 검토 전 초안임을 명시합니다.
- 비밀키 노출이 의심되면 키 폐기·재발급 후 필요 시 Git 기록도 정리합니다.

## 장애 대응

- 빌드 실패: Vercel 빌드 로그와 로컬 `pnpm build` 결과를 비교합니다.
- 환경변수 누락: Vercel 환경별 변수와 재배포 여부를 확인합니다.
- 로그인 Redirect 오류: Supabase Site URL/Redirect URL의 프로토콜과 도메인을 확인합니다.
- DB 권한 오류: 마이그레이션 적용 순서와 RLS 정책을 확인합니다.
- 이전 버전 화면: 브라우저 서비스워커와 사이트 데이터 삭제 후 재접속합니다.
- 기록 이전 실패: 로컬 기록은 제거되지 않으므로 로그인 후 다시 시도할 수 있습니다.

정식 공개 전 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)를 운영자와 함께 확인하세요.
