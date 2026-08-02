import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

const PASSWORD_MIN_LENGTH = 5;
const PASSWORD_MAX_LENGTH = 12;

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const passwordInvalid = useMemo(() => {
    if (!password) {
      return false;
    }

    return (
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    );
  }, [password]);

  const passwordNotMatch =
    Boolean(passwordConfirm) && password !== passwordConfirm;

  const handleSignup = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (
      !loginId.trim() ||
      !password ||
      passwordInvalid ||
      !passwordConfirm ||
      passwordNotMatch ||
      !nickname.trim()
    ) {
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

      setServerError(
        typeof serverMessage === "string"
          ? serverMessage
          : t("auth.signupError")
      );
    } finally {
      setLoading(false);
    }
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
          <span className="auth-kicker">WORKNOTE · START YOUR LOG</span>
          <h1>{t("auth.heroTitle")}</h1>
          <p>{t("auth.signupHeroDescription")}</p>

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
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span>{t("auth.createAccount")}</span>
            <h2>{t("auth.signupTitle")}</h2>
            <p>{t("auth.signupDescription")}</p>
          </div>

          <form className="auth-form" onSubmit={handleSignup} noValidate>
            <label className="auth-field">
              <span>{t("auth.loginIdLabel")}</span>
              <input
                className={submitted && !loginId.trim() ? "is-invalid" : ""}
                type="text"
                placeholder={t("auth.loginIdPlaceholder")}
                value={loginId}
                onChange={(event) => {
                  setLoginId(event.target.value);
                  setServerError("");
                }}
                disabled={loading}
                autoComplete="username"
              />
              {submitted && !loginId.trim() && (
                <small className="auth-field-error">
                  {t("auth.loginIdRequired")}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>{t("auth.passwordLabel")}</span>
              <input
                className={
                  submitted && (!password || passwordInvalid)
                    ? "is-invalid"
                    : ""
                }
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setServerError("");
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              {submitted && !password ? (
                <small className="auth-field-error">
                  {t("auth.passwordRequired")}
                </small>
              ) : submitted && passwordInvalid ? (
                <small className="auth-field-error">
                  {t("auth.passwordLengthError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.passwordLengthGuide")}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>{t("auth.passwordConfirmLabel")}</span>
              <input
                className={
                  submitted && (!passwordConfirm || passwordNotMatch)
                    ? "is-invalid"
                    : ""
                }
                type="password"
                placeholder={t("auth.passwordConfirmPlaceholder")}
                value={passwordConfirm}
                onChange={(event) => {
                  setPasswordConfirm(event.target.value);
                  setServerError("");
                }}
                disabled={loading}
                autoComplete="new-password"
              />
              {submitted && !passwordConfirm ? (
                <small className="auth-field-error">
                  {t("auth.passwordConfirmRequired")}
                </small>
              ) : submitted && passwordNotMatch ? (
                <small className="auth-field-error">
                  {t("auth.passwordNotMatch")}
                </small>
              ) : null}
            </label>

            <label className="auth-field">
              <span>{t("auth.nicknameLabel")}</span>
              <input
                className={submitted && !nickname.trim() ? "is-invalid" : ""}
                type="text"
                placeholder={t("auth.nicknamePlaceholder")}
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setServerError("");
                }}
                disabled={loading}
                autoComplete="nickname"
              />
              {submitted && !nickname.trim() && (
                <small className="auth-field-error">
                  {t("auth.nicknameRequired")}
                </small>
              )}
            </label>

            {serverError && (
              <div className="auth-form-error" role="alert">
                {serverError}
              </div>
            )}

            <button
              className="auth-primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? t("auth.signingUp") : t("auth.signupButton")}
            </button>
          </form>

          <div className="auth-switch">
            <span>{t("auth.hasAccount")}</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              {t("auth.goLogin")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignupPage;
