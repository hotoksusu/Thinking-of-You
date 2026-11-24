# 다녀온 브랜드 설정

[src/lib/care-brand.ts](../src/lib/care-brand.ts)가 한국어·영어 이름, 두 슬로건, 제품명, 팔레트, 사이트 주소·문의 경로, OG와 PWA 리소스, 문자·이메일 미리보기와 데모 설정을 관리한다. 로고 컴포넌트는 한국어 마지막 글자를 강조한다. 마크는 전원과 연결을 나타내는 SVG다. 정사각 PNG 아이콘과 1200×630 공유 이미지는 public/brand에 있다.

- 개발과 운영 빌드의 기본 브랜드는 다녀온이다. 기존 화면 회귀에는 NEXT_PUBLIC_CARE_BRAND=legacy와 CARE_EXPORT_PROFILE=legacy-qa를 함께 사용한다.
- 비공개 다녀온은 NEXT_PUBLIC_CARE_DEMO=local로 빌드한다. 생성물에는 검색 색인 제외 메타데이터가 포함되고 배포 패키징에서 제외된다.
- 운영 패키지는 기존 설치형 브라우저를 위해 /manifest.json에도 다녀온 설치 정보를 제공한다. 서비스 워커 v7은 탐색 요청을 네트워크에서 재확인한다.
- 레거시 URL, DB·스토리지 키, 기존 정적 에셋, 법적·역사적 문서는 유지한다.
- 테스트용 브랜드 선택과 사전에 승인된 실제 SMS 발송 템플릿은 독립적이다. 새 문자·이메일 UI는 초안 미리보기로 표시한다. 정식 전환 시 메시지 발신명과 공유 이미지·아이콘을 함께 승인한다.
- Pretendard Variable을 로컬에서 불러오며 Apple SD Gothic Neo, Malgun Gothic, 시스템 폰트 순서로 대체한다.

## 비공개 데모 실행

저장소 루트에서 PowerShell로 실행한다. Node 24와 설치된 의존성을 사용한다.

```powershell
$env:NEXT_PUBLIC_CARE_BRAND = 'danyeon'
$env:NEXT_PUBLIC_CARE_DEMO = 'local'
$env:NODE_PATH = (Resolve-Path 'node_modules/.pnpm/node_modules').Path
node node_modules/next/dist/bin/next build
node scripts/danyeon-demo.mjs
```

[데모 선택](http://127.0.0.1:3310/demo)에서 환자, 병원, 운영관리자를 선택한다. 이 명령은 Windows 샌드박스 밖의 일반 로컬 터미널에서 실행한다. 이후 종료하면 인메모리 합성 자료는 사라진다. NODE_PATH 설정은 현재 Windows pnpm 설치에서 ESLint 플러그인 해석에 필요했다.

다녀온은 우선 가칭이다. 상용 전환 전에 동일·유사 표장, 지정상품·서비스, 유사군을 검토한다. [KIPRIS 상표 검색 안내](https://www.kipo.go.kr/kcall/faqRead.do?curMenuCd=SCD0300081&pgmId=PGM0000014&pgmSeq=106)
