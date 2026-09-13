# WorkNote Frontend

WorkNote는 매일의 업무 기록을 저장하고 AI 요약, 기술 태그, 예상 면접 질문, 프로젝트 보고서로 연결하는 포트폴리오용 웹 애플리케이션입니다.

## 현재 주요 기능

- 로그인 / 회원가입
  - 로그인 ID 4~20자, 영문/숫자/밑줄(_)만 허용
  - 신규 비밀번호 8~64자, 특수문자/공백 사용 가능
  - 비밀번호 확인은 길이와 일치 여부 모두 검사
  - 닉네임 2~12자, 문자/숫자/공백/밑줄(_) 허용
  - 조건 위반 시 입력창 빨간 테두리와 구체적인 규칙 문구 표시
  - 로그인은 기존 계정 호환을 위해 비밀번호 가입 최소 길이를 다시 강제하지 않고 최대 64자만 제한
- JWT 인증
- 업무일지
  - 작성 / 목록 / 상세 / 수정 / 삭제
  - 제목 클릭 또는 `상세보기` 버튼으로 상세 페이지 이동
  - AI 요약 / 기술 태그 / 난이도 / 예상 면접 질문
  - 이미지 OCR → AI 업무일지 초안
- 대시보드
  - 클라이언트 userId를 신뢰하지 않고 JWT 로그인 사용자 기준으로 조회
- 캘린더
  - 월간 격자형 달력
  - 업무일지와 목표 기간 표시
  - 업무일지를 Drag & Drop하여 업무 날짜 변경
  - 목표를 Drag & Drop하면 기간 길이를 유지한 채 일정 이동
  - 목표 양 끝 핸들을 Drag & Drop하여 시작일/마감일 연장·축소
  - 완료된 목표는 체크 표시와 취소선으로 즉시 구분
  - 캘린더 업무 제목 클릭 → 상세 페이지
  - 날짜 칸 더블클릭 → 선택 날짜로 빠른 업무일지 작성
- 계획 목표
  - 시작일 / 마감일 / 상태 / 진행률
  - 기한 초과 자동 표시
  - 목록의 진행률 게이지를 직접 드래그하여 저장
  - 제목/계획 내용 옆 연필 아이콘으로 인라인 수정 후 Enter 또는 포커스 이동 시 저장
  - 캘린더와 기간 연동
- AI 프로젝트 보고서 / PDF
- 한국어 / 일본어 전환

## 날짜 설계

업무일지의 `createdAt`은 최초 작성 시각으로 그대로 유지합니다. 캘린더에서 변경하는 날짜는 별도의 `workDate`입니다.

```text
createdAt = 실제 생성 이력
workDate  = 사용자가 업무를 수행했다고 정한 날짜 / 캘린더 날짜
```

따라서 캘린더 Drag & Drop 때문에 최초 생성 이력이 변하지 않습니다.

목표는 다음 기간을 갖습니다.

```text
startDate  = 계획 시작일
targetDate = 계획 마감일
```

기존 목표 데이터에 `startDate`가 없으면 `targetDate`를 시작일로 간주하여 기존 데이터와 호환됩니다.

## AI / Azure OCR 일일 제한

사용자 ID가 아니라 **JWT로 인증된 사용자** 기준으로 서버에서 사용량을 기록합니다.

- AI 기본 20회/일
- Azure OCR 기본 5회/일
- 이미지 초안 기능: OCR 1회 + AI 1회

한도 초과 시 서버는 HTTP 429를 반환하고 프론트 공통 인터셉터에서 다음 경고를 표시합니다.

```text
오늘 쓸 수 있는 AI기능을 다 썼습니다. 내일 다시 시도해주세요.
```

## 주요 경로

```text
/dashboard
/work/list
/work/create
/work/view/:workLogId
/work/edit/:workLogId
/calendar
/goals
/report
```

로그인 후 좌측 상단 **WorkNote**를 클릭하면 `/dashboard`로 이동합니다.

## 실행

```bash
npm install
npm run dev
```

```text
VITE_API_BASE_URL=http://localhost:8081
```

## Landing Page / Portfolio Showcase

랜딩페이지는 면접관이 짧은 시간 안에 제품과 엔지니어링 포인트를 이해할 수 있도록 다음 흐름으로 구성했습니다.

- Hero: 업무 기록 → AI 분석 → Calendar → Dashboard 흐름을 자동 데모로 표시
- Hero 좌측의 큰 단계형 탭으로 원하는 화면을 직접 선택하고, 수동 선택 시 자동 전환 타이머를 처음부터 다시 시작
- Hero 좌측의 `AUTO` 컨트롤로 자동 전환을 일시정지/재생할 수 있음
- 30초 인터랙티브 데모: 업무 내용을 직접 입력하고 분석 결과를 로그인 전에 확인
- 최신 기능 소개: 업무 기록, AI 분석, Azure OCR, Calendar Drag & Drop/Resize, Goal Planner, Dashboard, AI Report/PDF, KO/JA
- Engineering: React → Spring Security → Spring Boot → PostgreSQL → Ollama/Azure OCR 구조 설명
- Security Hardening: 실제 API 경로를 노출하지 않고, Client 식별값 신뢰 방식에서 JWT 인증 사용자 판별 방식으로 바꾼 설계를 개념적으로 설명
- Case Study: Client Trust, Date Model, External API Cost, Product Flow에서 얻은 학습 내용
- Reliability & Security: 현재 실제 적용된 보안/안정성 항목만 표시

GitHub 링크를 랜딩페이지에 표시하려면 `.env`에 `VITE_GITHUB_URL`을 설정합니다.

## 랜딩페이지 30초 인터랙티브 데모

로그인 없이 제목과 업무 내용을 직접 입력해 분석 흐름을 체험할 수 있습니다. 랜딩 데모는 포트폴리오 체험용 브라우저 시뮬레이션으로 동작하며 요약, 기술 태그, 난이도, 예상 면접 질문과 Work Log → AI → Calendar → Dashboard 연결 흐름을 보여줍니다. 실제 AI/OCR API를 호출하거나 사용자 일일 사용량을 소비하지 않습니다.
