# WorkNote 보안 / 서버 검증 메모

프론트엔드 검증은 UX를 위한 것이며 보안 경계로 사용하지 않는다. F12, curl, Postman으로 모든 프론트 제한을 우회할 수 있다고 가정한다.

## 인증 / 권한

- JWT Stateless 인증
- 비밀번호 BCrypt 저장
- Dashboard는 `GET /api/dashboard`에서 JWT 사용자 정보를 서버가 직접 해석
- 구버전 `/api/dashboard/{userId}`는 JWT 사용자 ID와 일치할 때만 허용
- WorkLog 상세/수정/삭제/날짜변경은 소유자 검증
- Goal 수정/삭제/일정변경/진행률변경은 `goal id + JWT 사용자`로 소유권 검증
- Calendar API는 userId 파라미터를 받지 않고 JWT 사용자 데이터만 조회

## 입력 길이 검증

Frontend와 Backend 모두 검증한다.

```text
Login ID     4~20, 영문/숫자/밑줄(_)만 허용
Password     신규 가입 8~64, 특수문자/공백 허용
Nickname     2~12, 문자/숫자/공백/밑줄(_) 허용
Work title   <= 200
Work content <= 20,000
Goal title   <= 120
Goal content <= 3,000
Progress     0~100
```

비밀번호는 특수문자를 금지하지 않는다. 길이를 충분히 허용하고 임의의 조합 규칙을 강제하지 않는 현대적인 비밀번호 가이드라인을 따른다.

## AI/OCR 남용 방지

DB에 `사용자 + 날짜 + 기능`별 사용 횟수를 기록한다.

```text
AI          20회/일 기본값
AZURE_OCR    5회/일 기본값
```

이미지 초안은 Azure OCR과 AI를 모두 사용하므로 두 제한을 동시에 검사한다.

## Calendar 변경 보안

캘린더 Drag & Drop은 전체 엔티티를 클라이언트가 덮어쓰지 않는다.

```text
PATCH /api/work/{id}/date
PATCH /api/goals/{id}/schedule
PATCH /api/goals/{id}/progress
```

각 API는 필요한 필드만 변경하고 JWT 소유권을 다시 확인한다. 업무일지 날짜 이동은 AI를 재호출하지 않는다.

## JWT Secret

운영 기본 설정:

```yaml
jwt:
  secret: ${JWT_SECRET}
```

운영에서 기본 Secret fallback을 사용하지 않는다. 로컬 개발용 Secret은 `application-local.yaml` 프로필로 분리한다.
