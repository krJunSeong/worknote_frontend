import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!loginId.trim()) return alert(t("auth.loginIdRequired"));
    if (!password.trim()) return alert(t("auth.passwordRequired"));
    if (!passwordConfirm.trim()) return alert(t("auth.passwordConfirmRequired"));
    if (password !== passwordConfirm) return alert(t("auth.passwordNotMatch"));
    if (!nickname.trim()) return alert(t("auth.nicknameRequired"));

    try {
      setLoading(true);
      await signup({ loginId: loginId.trim(), password, nickname: nickname.trim() });
      alert(t("auth.signupSuccess"));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data;
      alert(typeof serverMessage === "string" ? serverMessage : t("auth.signupError"));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) handleSignup();
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <a className="auth-brand" href="/login" aria-label="WorkNote"><span className="auth-brand-mark">W</span><span>WorkNote</span></a>
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

        <div className="auth-card auth-card-signup">
          <div className="auth-card-heading"><span>{t("auth.createAccount")}</span><h2>{t("auth.signupTitle")}</h2><p>{t("auth.signupDescription")}</p></div>
          <div className="auth-form">
            <label className="auth-field"><span>{t("auth.loginIdLabel")}</span><input type="text" placeholder={t("auth.loginIdPlaceholder")} value={loginId} onChange={(e) => setLoginId(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="username" /></label>
            <label className="auth-field"><span>{t("auth.passwordLabel")}</span><input type="password" placeholder={t("auth.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="new-password" /></label>
            <label className="auth-field"><span>{t("auth.passwordConfirmLabel")}</span><input type="password" placeholder={t("auth.passwordConfirmPlaceholder")} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="new-password" /></label>
            <label className="auth-field"><span>{t("auth.nicknameLabel")}</span><input type="text" placeholder={t("auth.nicknamePlaceholder")} value={nickname} onChange={(e) => setNickname(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} autoComplete="nickname" /></label>
            <button className="auth-primary-button" type="button" onClick={handleSignup} disabled={loading}>{loading ? t("auth.signingUp") : t("auth.signupButton")}</button>
          </div>
          <div className="auth-switch"><span>{t("auth.hasAccount")}</span><button type="button" onClick={() => navigate("/login")} disabled={loading}>{t("auth.goLogin")}</button></div>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
