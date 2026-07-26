import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import { useLanguage } from "../i18n/LanguageContext";

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!loginId.trim()) {
      alert(t("auth.loginIdRequired"));
      return;
    }

    if (!password.trim()) {
      alert(t("auth.passwordRequired"));
      return;
    }

    if (!passwordConfirm.trim()) {
      alert(t("auth.passwordConfirmRequired"));
      return;
    }

    if (password !== passwordConfirm) {
      alert(t("auth.passwordNotMatch"));
      return;
    }

    if (!nickname.trim()) {
      alert(t("auth.nicknameRequired"));
      return;
    }

    try {
      setLoading(true);

      await signup({
        loginId: loginId.trim(),
        password,
        nickname: nickname.trim(),
      });

      alert(t("auth.signupSuccess"));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data;

      alert(
        typeof serverMessage === "string"
          ? serverMessage
          : t("auth.signupError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSignup();
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>WorkNote</h1>

      <h2 style={{ textAlign: "center" }}>
        {t("auth.signupTitle")}
      </h2>

      <input
        type="text"
        placeholder={t("auth.loginIdPlaceholder")}
        value={loginId}
        onChange={(event) => setLoginId(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder={t("auth.passwordPlaceholder")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="new-password"
      />

      <input
        type="password"
        placeholder={t("auth.passwordConfirmPlaceholder")}
        value={passwordConfirm}
        onChange={(event) => setPasswordConfirm(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="new-password"
      />

      <input
        type="text"
        placeholder={t("auth.nicknamePlaceholder")}
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="nickname"
      />

      <button
        type="button"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading
          ? t("auth.signingUp")
          : t("auth.signupButton")}
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        disabled={loading}
      >
        {t("auth.goLogin")}
      </button>
    </div>
  );
}

export default SignupPage;