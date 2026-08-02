import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

const PASSWORD_MIN_LENGTH = 5;
const PASSWORD_MAX_LENGTH = 12;

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentialError, setCredentialError] = useState("");
  const [failedFields, setFailedFields] = useState({
    loginId: false,
    password: false,
  });

  const passwordFormatInvalid = useMemo(() => {
    if (!password) {
      return false;
    }

    return (
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    );
  }, [password]);

  const loginIdRequired = submitted && !loginId.trim();
  const passwordRequired = submitted && !password;
  const showPasswordFormatError =
    (passwordTouched || submitted) && passwordFormatInvalid;

  const handleLoginIdChange = (event) => {
    setLoginId(event.target.value);
    setCredentialError("");
    setFailedFields((previous) => ({
      ...previous,
      loginId: false,
    }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setCredentialError("");
    setFailedFields((previous) => ({
      ...previous,
      password: false,
    }));
  };

  const login = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!loginId.trim() || !password || passwordFormatInvalid) {
      return;
    }

    try {
      setLoading(true);
      setCredentialError("");

      const response = await api.post("/api/auth/login", {
        loginId: loginId.trim(),
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userId", String(response.data.userId));
      localStorage.setItem("loginId", response.data.loginId);
      localStorage.setItem("nickname", response.data.nickname);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;

      setCredentialError(serverMessage || t("auth.loginError"));
      setFailedFields({ loginId: true, password: true });
    } finally {
      setLoading(false);
    }
  };

  const loginIdInvalid = loginIdRequired || failedFields.loginId;
  const passwordInvalid =
    passwordRequired || showPasswordFormatError || failedFields.password;

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
            <div className="auth-feature">
              <span>01</span>
              <div>
                <strong>{t("auth.featureRecordTitle")}</strong>
                <p>{t("auth.featureRecordDescription")}</p>
              </div>
            </div>
            <div className="auth-feature">
              <span>02</span>
              <div>
                <strong>{t("auth.featureAiTitle")}</strong>
                <p>{t("auth.featureAiDescription")}</p>
              </div>
            </div>
            <div className="auth-feature">
              <span>03</span>
              <div>
                <strong>{t("auth.featureReportTitle")}</strong>
                <p>{t("auth.featureReportDescription")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span>{t("auth.welcomeBack")}</span>
            <h2>{t("auth.loginTitle")}</h2>
            <p>{t("auth.loginDescription")}</p>
          </div>

          <form className="auth-form" onSubmit={login} noValidate>
            <label className="auth-field">
              <span>{t("auth.loginIdLabel")}</span>
              <input
                className={loginIdInvalid ? "is-invalid" : ""}
                type="text"
                placeholder={t("auth.loginIdPlaceholder")}
                value={loginId}
                onChange={handleLoginIdChange}
                disabled={loading}
                autoComplete="username"
                aria-invalid={loginIdInvalid}
              />
              {loginIdRequired && (
                <small className="auth-field-error">
                  {t("auth.loginIdRequired")}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>{t("auth.passwordLabel")}</span>
              <input
                className={passwordInvalid ? "is-invalid" : ""}
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                disabled={loading}
                autoComplete="current-password"
                aria-invalid={passwordInvalid}
              />

              {passwordRequired ? (
                <small className="auth-field-error">
                  {t("auth.passwordRequired")}
                </small>
              ) : showPasswordFormatError ? (
                <small className="auth-field-error">
                  {t("auth.passwordLengthError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.passwordLengthGuide")}
                </small>
              )}
            </label>

            {credentialError && (
              <div className="auth-form-error" role="alert">
                {credentialError}
              </div>
            )}

            <button
              className="auth-primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
          </form>

          <div className="auth-switch">
            <span>{t("auth.noAccount")}</span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              disabled={loading}
            >
              {t("auth.signupButton")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
