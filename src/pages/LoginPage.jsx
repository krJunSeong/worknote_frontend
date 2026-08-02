import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!loginId.trim()) return alert(t("auth.loginIdRequired"));
    if (!password.trim()) return alert(t("auth.passwordRequired"));

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", {
        loginId: loginId.trim(),
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userId", String(response.data.userId));
      localStorage.setItem("loginId", response.data.loginId);
      localStorage.setItem("nickname", response.data.nickname);
      navigate("/work", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;
      alert(serverMessage || t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) login();
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <a className="auth-brand" href="/login" aria-label="WorkNote">
          <span className="auth-brand-mark">W</span>
          <span>WorkNote</span>
        </a>
        <LanguageSelector />
      </header>

      <section className="auth-shell">
        <div className="auth-intro">
          <span className="auth-kicker">WORKNOTE · AI CAREER LOG</span>
          <h1>{t("auth.heroTitle")}</h1>
          <p>{t("auth.heroDescription")}</p>
          <div className="auth-feature-list">
            <div className="auth-feature"><span>01</span><div><strong>{t("auth.featureRecordTitle")}</strong><p>{t("auth.featureRecordDescription")}</p></div></div>
            <div className="auth-feature"><span>02</span><div><strong>{t("auth.featureAiTitle")}</strong><p>{t("auth.featureAiDescription")}</p></div></div>
            <div className="auth-feature"><span>03</span><div><strong>{t("auth.featureReportTitle")}</strong><p>{t("auth.featureReportDescription")}</p></div></div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span>{t("auth.welcomeBack")}</span>
            <h2>{t("auth.loginTitle")}</h2>
            <p>{t("auth.loginDescription")}</p>
          </div>

          <div className="auth-form">
            <label className="auth-field">
              <span>{t("auth.loginIdLabel")}</span>
              <input type="text" placeholder={t("auth.loginIdPlaceholder")} value={loginId} onChange={(e) => setLoginId(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="username" />
            </label>
            <label className="auth-field">
              <span>{t("auth.passwordLabel")}</span>
              <input type="password" placeholder={t("auth.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="current-password" />
            </label>
            <button className="auth-primary-button" type="button" onClick={login} disabled={loading}>
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
          </div>

          <div className="auth-switch">
            <span>{t("auth.noAccount")}</span>
            <button type="button" onClick={() => navigate("/signup")} disabled={loading}>{t("auth.signupButton")}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
