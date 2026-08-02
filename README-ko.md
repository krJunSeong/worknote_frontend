# WorkNote UI redesign v4


## v4 추가 수정

- Vite 기본 템플릿의 `#root { max-width: 1280px; margin: 0 auto; padding: 2rem; }` 제한을 완전히 제거했습니다.
- `html`, `body`, `#root`, 인증 화면, 앱 레이아웃 모두 브라우저 가용 폭 100%를 사용합니다.
- 대시보드·업무일지 목록·업무일지 작성 페이지에 `max-width: none`을 명시했습니다.
- 브라우저 탭 제목을 언어에 따라 `WorkNote | AI 업무 기록` / `WorkNote | AI業務記録`으로 표시합니다.
- 기존 UI의 파란색 WorkNote W 마크를 favicon 및 앱 아이콘으로 추가했습니다.

## 반영된 요구사항

1. 로그인 성공 후 `/dashboard`로 이동
2. 로그인 비밀번호 5~12자 검증 및 입력 필드 인라인 오류 표시
3. 로그인 실패 시 아이디/비밀번호 필드 오류 표시, 입력 재개 시 해당 필드 정상화
4. 데스크톱 화면 전체 폭 활용
5. 언어 선택기를 로그인 화면과 앱 상단 우측의 글로벌 영역으로 이동
6. 업무일지 기록과 업무일지 작성을 별도 화면 및 별도 사이드바 메뉴로 분리
7. 업무일지 작성 화면을 AI workflow, 작성 팁, 분석 미리보기와 함께 재디자인
8. 기존 업무일지 조회/작성/수정/삭제 및 AI 결과 표시 유지
9. 사이드바 접기 상태 localStorage 유지

## 덮어쓸 파일

```text
index.html
public/worknote-icon.svg
public/worknote-icon-32.png
public/worknote-icon-192.png
public/favicon.ico
public/site.webmanifest
src/index.css
src/App.jsx
src/layouts/AppLayout.jsx
src/layouts/AppLayout.css
src/components/AppSidebar.jsx
src/components/LanguageSelector.jsx
src/components/LanguageSelector.css
src/pages/LoginPage.jsx
src/pages/SignupPage.jsx
src/pages/AuthPage.css
src/pages/DashboardPage.jsx
src/pages/DashboardPage.css
src/pages/WorkLogPage.jsx
src/pages/WorkLogListPage.jsx
src/pages/WorkLogListPage.css
src/pages/WorkLogEditorPage.jsx
src/pages/WorkLogEditorPage.css
src/i18n/LanguageContext.jsx
src/i18n/translations.js
```

기존 프로젝트에 `LanguageSelector.jsx`가 있다면 이 버전으로 교체하세요.

## 라우트

```text
/dashboard             업무 대시보드
/work                   /work/list로 이동
/work/list              업무일지 기록
/work/create            업무일지 작성
/work/edit/:workLogId   업무일지 수정
```

## 실행

```bash
npm run dev
```

브라우저에서 다음 주소로 확인합니다.

```text
http://localhost:5173
```

## AI 보고서 페이지가 기존 프로젝트에 있는 경우

이번 압축에는 사용자가 제공하지 않은 AI 보고서 페이지 파일을 임의로 다시 작성하지 않았습니다.
기존 `ReportPage`가 있다면 `App.jsx`의 `AppLayout` 하위에 기존 라우트를 그대로 추가하고,
`AppSidebar.jsx`에도 기존 링크를 추가하면 사이드바가 유지된 상태로 우측 내용만 바뀝니다.

## 비밀번호 정책 주의

화면에는 요청한 5~12자 규칙을 적용했습니다. 이 규칙은 반드시 백엔드에서도 동일하게 검증해야 합니다.
프런트엔드 검증은 우회할 수 있으므로 보안 경계가 아닙니다.

보안 목적이라면 추후 최소 8자 이상, 최대 64자 이상 허용 정책으로 변경하는 편이 좋습니다.

## 로그인 보안

SQL Injection 방어는 React 입력값에서 특수문자를 제거하는 방식으로 처리하면 안 됩니다.
Spring Data JPA의 파라미터 바인딩을 유지하고 문자열 연결로 SQL을 만들지 마세요.

비밀번호는 DB에 평문으로 저장하지 말고 `PasswordEncoder`로 해시해야 합니다.
자세한 예시는 `BACKEND-SECURITY.md`를 확인하세요.

## 전체 화면이 계속 작게 보이는 경우

`src/main.jsx`에서 다음 줄이 존재하는지 확인하세요.

```jsx
import "./index.css";
```

기존 `src/App.css`에 아래 Vite 기본 코드가 남아 있다면 삭제하거나 `App.css` import를 제거하세요.

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

브라우저 탭 아이콘이 바로 바뀌지 않으면 favicon 캐시 때문일 수 있으므로 강력 새로고침하거나 시크릿 창에서 확인하세요.
