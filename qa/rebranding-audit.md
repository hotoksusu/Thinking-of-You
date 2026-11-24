# 리브랜딩 사전 실사

- 기준 커밋은 1cac9d243b34d319b3d2f7205e3fe3b693eb45c1이다. 시작 브랜치는 codex/readability-ux-20261119였다. 기존 가독성 작업, 폰트, 테스트 수정과 스크린샷이 작업 트리에 남아 있었다. 이전 후보 작업 브랜치를 거쳐 최종 지시에 맞춰 codex/danyeon-v2로 전환했다.
- Sites 읽기 전용 조회에서 공개 배포 버전 92, 상태 succeeded, 소스 1cac9d243b34d319b3d2f7205e3fe3b693eb45c1을 확인했다. 커밋 기준은 로컬 HEAD와 같고 로컬에는 기존 가독성 변경 및 이번 개편이 미커밋 상태로 있다. 공개 페이지 내용, 배포 환경 설정과 D1 데이터는 직접 대조하지 않았다. [오늘안부 운영 사이트](https://oneul-anbu.yos1015.chatgpt.site/)
- Next App Router의 /, /hospital, /company, /i, /app/patient, /care/server, /pilot 및 /demo 경로를 확인했다. 실제 환자·병원·운영 기능은 Sites Worker API의 서버 모드에서 처리한다. 저장소에는 브라우저 로컬 예제·레거시 흐름도 별도로 있다.
- drizzle의 0000~0002 SQL에서 병원, 직원, 환자, 초대, 세션, 응답, 업무·감사, 도입 문의와 SMS 저장소를 확인했다. Worker가 소속, 담당자, 권한과 계정 회수를 확인하고 환자 세션을 환자·병원 키에 묶는다.
- Morning Queue, 응답 확인, 배정, 조치, 후속 일정, 종료, 기록·그래프, 월간 JSON/CSV, 직원 권한, SMS·도입 문의와 감사 API가 존재했다. 기존 보고서의 분석은 운영 필요를 반영했고, 기존 분류는 demo-v1이었다.
- [commercialization-report.md](commercialization-report.md)가 실제 존재했다. 과거 집계 34건은 배포 Worker·운영 UI 15건, 로직 6건, 브라우저 13건의 선별 집계였다. 사전 기준선 첫 실행은 서버·로직 18건 통과, 기본 Chromium 부재로 브라우저 3건 실행 실패였다. Edge 재시도도 프로세스 시작 단계에서 종료됐다. 현재 검증은 별도 QA 보고서에 기록한다.
- 운영 측 사전 확인 의존 사항은 Sites의 로그인 헤더 경계, D1 설정, 실제 메일·문자 수신 정책, 의료진 분류 승인, 보존과 복구 운영이었다. 합성 테스트에 실환자 정보는 쓰지 않았다.
