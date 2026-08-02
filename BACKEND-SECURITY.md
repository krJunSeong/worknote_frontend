# 백엔드 로그인 보안 확인

## SQL Injection

다음 Spring Data JPA 파생 쿼리는 입력값을 SQL 문자열에 직접 붙이지 않고 파라미터로 바인딩합니다.

```java
Optional<User> findByLoginId(String loginId);
```

따라서 로그인 입력에서 `'`, `--` 같은 문자를 프런트엔드에서 임의로 제거할 필요는 없습니다.
직접 SQL을 작성할 때만 문자열 연결을 피하고 `?`, `:loginId`, `@Param` 같은 바인딩을 사용하세요.

## 비밀번호 해시

`SecurityConfig`에 `PasswordEncoder` Bean이 이미 있다면 서비스에서 아래처럼 사용합니다.
현재 JWT 생성 코드는 그대로 유지하고, 회원가입 저장과 로그인 비교 부분만 변경하세요.

```java
private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;

// 회원가입
User user = User.builder()
        .loginId(request.getLoginId().trim())
        .password(passwordEncoder.encode(request.getPassword()))
        .nickname(request.getNickname().trim())
        .build();

// 로그인
if (!passwordEncoder.matches(
        request.getPassword(),
        user.getPassword()
)) {
    throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
}
```

필요 import:

```java
import org.springframework.security.crypto.password.PasswordEncoder;
```

## 중요: 기존 회원 데이터

기존 DB에 비밀번호가 평문으로 저장되어 있다면 BCrypt 적용 직후 기존 계정은 로그인할 수 없습니다.
개발 단계라면 기존 사용자를 삭제하고 새로 회원가입하는 방법이 가장 단순합니다.
운영 데이터라면 별도의 마이그레이션 전략이 필요합니다.

## 백엔드 길이 검증

프런트엔드의 5~12자 검증은 우회할 수 있으므로 `SignupRequest` 또는 서비스에서도 확인하세요.

```java
private void validatePassword(String password) {
    if (password == null || password.length() < 5 || password.length() > 12) {
        throw new IllegalArgumentException(
                "비밀번호는 5자 이상 12자 이하로 입력해 주세요."
        );
    }
}
```
