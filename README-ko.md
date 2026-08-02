# WorkNote AI 보고서/PDF 메뉴 복구 파일

## 포함 파일

```text
src/
├─ App.jsx
├─ api/
│  └─ reportApi.js
├─ components/
│  └─ AppSidebar.jsx
├─ layouts/
│  └─ AppLayout.jsx
└─ pages/
   ├─ ReportPage.jsx
   └─ ReportPage.css
```

## 적용 방법

압축을 풀고 각 파일을 프런트엔드 프로젝트의 같은 경로에 덮어씁니다.

현재 `translations.js`에는 다음 키가 이미 존재하므로 별도 수정이 필요하지 않습니다.

- `navigation.aiReport`
- `report.*`

## 실행 및 확인

```bash
npm run dev
```

로그인 후 사이드바에서 다음 메뉴를 확인합니다.

```text
AI 프로젝트 보고서 / AIプロジェクトレポート
```

접근 경로:

```text
http://localhost:5173/report
```

동작 순서:

```text
AI 보고서 생성
→ 보고서 미리보기
→ PDF 다운로드
```

## 백엔드 API 전제

```text
POST /api/reports/ai?language=ko|ja
POST /api/reports/ai/pdf
```

Swagger 또는 Network 탭에서 해당 API가 존재하는지 확인하세요.
