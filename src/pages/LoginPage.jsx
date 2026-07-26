import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!loginId.trim()) {
      alert(t("auth.loginIdRequired"));
      return;
    }

    if (!password.trim()) {
      alert(t("auth.passwordRequired"));
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        loginId: loginId.trim(),
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      localStorage.setItem(
        "userId",
        String(response.data.userId)
      );

      localStorage.setItem(
        "loginId",
        response.data.loginId
      );

      localStorage.setItem(
        "nickname",
        response.data.nickname
      );

      navigate("/work", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      alert(
        serverMessage ||
          t("auth.loginError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      login();
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
      <h1 style={{ textAlign: "center" }}>
        WorkNote
      </h1>

      <h2 style={{ textAlign: "center" }}>
        {t("auth.loginTitle")}
      </h2>

      <input
        type="text"
        placeholder={t("auth.loginIdPlaceholder")}
        value={loginId}
        onChange={(event) =>
          setLoginId(event.target.value)
        }
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder={t("auth.passwordPlaceholder")}
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="current-password"
      />

      <button
        type="button"
        onClick={login}
        disabled={loading}
      >
        {loading
          ? t("auth.loggingIn")
          : t("auth.loginButton")}
      </button>

      <button
        type="button"
        onClick={() => navigate("/signup")}
        disabled={loading}
      >
        {t("auth.signupButton")}
      </button>
    </div>
  );
}

export default LoginPage;