import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

const LOGIN_ID_MIN_LENGTH = 4;
const LOGIN_ID_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 5;
const PASSWORD_MAX_LENGTH = 12;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 12;

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [loginIdTouched, setLoginIdTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const loginIdInvalid = useMemo(() => {
    if (!loginId.trim()) return false;
    const length = loginId.trim().length;
    return length < LOGIN_ID_MIN_LENGTH || length > LOGIN_ID_MAX_LENGTH;
  }, [loginId]);

  const passwordInvalid = useMemo(() => {
    if (!password) return false;
    return (
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    );
  }, [password]);

  const passwordConfirmLengthInvalid = useMemo(() => {
    if (!passwordConfirm) return false;
    return (
      passwordConfirm.length < PASSWORD_MIN_LENGTH ||
      passwordConfirm.length > PASSWORD_MAX_LENGTH
    );
  }, [passwordConfirm]);

  const passwordNotMatch =
    Boolean(passwordConfirm) && password !== passwordConfirm;

  const nicknameInvalid = useMemo(() => {
    if (!nickname.trim()) return false;
    const length = nickname.trim().length;
    return length < NICKNAME_MIN_LENGTH || length > NICKNAME_MAX_LENGTH;
  }, [nickname]);

  const showLoginIdLengthError =
    loginId.trim().length > LOGIN_ID_MAX_LENGTH ||
    ((loginIdTouched || submitted) && loginIdInvalid);
  const showPasswordLengthError =
    password.length > PASSWORD_MAX_LENGTH ||
    ((passwordTouched || submitted) && passwordInvalid);
  const showPasswordConfirmLengthError =
    passwordConfirm.length > PASSWORD_MAX_LENGTH ||
    ((passwordConfirmTouched || submitted) && passwordConfirmLengthInvalid);
  const showPasswordMismatchError =
    (passwordConfirmTouched || submitted) &&
    !passwordConfirmLengthInvalid &&
    passwordNotMatch;
  const showNicknameLengthError =
    nickname.trim().length > NICKNAME_MAX_LENGTH ||
    ((nicknameTouched || submitted) && nicknameInvalid);

  const handleSignup = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (
      !loginId.trim() ||
      loginIdInvalid ||
      !password ||
      passwordInvalid ||
      !passwordConfirm ||
      passwordConfirmLengthInvalid ||
      passwordNotMatch ||
      !nickname.trim() ||
      nicknameInvalid
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
                className={
                  (submitted && !loginId.trim()) || showLoginIdLengthError
                    ? "is-invalid"
                    : ""
                }
                type="text"
                placeholder={t("auth.loginIdPlaceholder")}
                value={loginId}
                onChange={(event) => {
                  setLoginId(event.target.value);
                  setServerError("");
                }}
                onBlur={() => setLoginIdTouched(true)}
                disabled={loading}
                autoComplete="username"
                aria-invalid={
                  (submitted && !loginId.trim()) || showLoginIdLengthError
                }
              />
              {submitted && !loginId.trim() ? (
                <small className="auth-field-error">
                  {t("auth.loginIdRequired")}
                </small>
              ) : showLoginIdLengthError ? (
                <small className="auth-field-error">
                  {t("auth.loginIdLengthError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.loginIdLengthGuide")}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>{t("auth.passwordLabel")}</span>
              <input
                className={
                  (submitted && !password) || showPasswordLengthError
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
                onBlur={() => setPasswordTouched(true)}
                disabled={loading}
                autoComplete="new-password"
              />
              {submitted && !password ? (
                <small className="auth-field-error">
                  {t("auth.passwordRequired")}
                </small>
              ) : showPasswordLengthError ? (
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
                  (submitted && !passwordConfirm) ||
                  showPasswordConfirmLengthError ||
                  showPasswordMismatchError
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
                onBlur={() => setPasswordConfirmTouched(true)}
                disabled={loading}
                autoComplete="new-password"
                aria-invalid={
                  (submitted && !passwordConfirm) ||
                  showPasswordConfirmLengthError ||
                  showPasswordMismatchError
                }
              />
              {submitted && !passwordConfirm ? (
                <small className="auth-field-error">
                  {t("auth.passwordConfirmRequired")}
                </small>
              ) : showPasswordConfirmLengthError ? (
                <small className="auth-field-error">
                  {t("auth.passwordLengthError")}
                </small>
              ) : showPasswordMismatchError ? (
                <small className="auth-field-error">
                  {t("auth.passwordNotMatch")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.passwordLengthGuide")}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>{t("auth.nicknameLabel")}</span>
              <input
                className={
                  (submitted && !nickname.trim()) || showNicknameLengthError
                    ? "is-invalid"
                    : ""
                }
                type="text"
                placeholder={t("auth.nicknamePlaceholder")}
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setServerError("");
                }}
                onBlur={() => setNicknameTouched(true)}
                disabled={loading}
                autoComplete="nickname"
                aria-invalid={
                  (submitted && !nickname.trim()) || showNicknameLengthError
                }
              />
              {submitted && !nickname.trim() ? (
                <small className="auth-field-error">
                  {t("auth.nicknameRequired")}
                </small>
              ) : showNicknameLengthError ? (
                <small className="auth-field-error">
                  {t("auth.nicknameLengthError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.nicknameLengthGuide")}
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
