import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import LanguageSelector from "../components/LanguageSelector";
import AuthColdStartNotice from "../components/AuthColdStartNotice";
import AuthServerLoadingOverlay from "../components/AuthServerLoadingOverlay";
import { useLanguage } from "../i18n/LanguageContext";
import {
  LOGIN_ID_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  isLoginIdCharacterValid,
  isLoginIdLengthValid,
  isNicknameCharacterValid,
  isNicknameLengthValid,
  isSignupPasswordLengthValid,
} from "../utils/authValidation";
import {
  AUTH_LOADING_OVERLAY_DELAY_MS,
  AUTH_LOADING_OVERLAY_MIN_VISIBLE_MS,
  AUTH_LOADING_SUCCESS_VISIBLE_MS,
  AUTH_PROGRESS_UPDATE_INTERVAL_MS,
  AUTH_REQUEST_TIMEOUT_MS,
  calculateAuthEstimatedProgress,
} from "../utils/authColdStart";
import "./AuthPage.css";

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
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [signupProgress, setSignupProgress] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [serverError, setServerError] = useState("");

  const loadingOverlayTimerRef = useRef(null);
  const loadingProgressTimerRef = useRef(null);
  const loadingStartedAtRef = useRef(0);
  const loadingOverlayShownAtRef = useRef(0);
  const signupRequestInFlightRef = useRef(false);

  const loginIdLengthInvalid = useMemo(() => {
    if (!loginId.trim()) return false;
    return !isLoginIdLengthValid(loginId);
  }, [loginId]);

  const loginIdCharacterInvalid = useMemo(() => {
    if (!loginId.trim()) return false;
    return !isLoginIdCharacterValid(loginId);
  }, [loginId]);

  const passwordInvalid = useMemo(() => {
    if (!password) return false;
    return !isSignupPasswordLengthValid(password);
  }, [password]);

  const passwordConfirmLengthInvalid = useMemo(() => {
    if (!passwordConfirm) return false;
    return !isSignupPasswordLengthValid(passwordConfirm);
  }, [passwordConfirm]);

  const passwordNotMatch =
    Boolean(passwordConfirm) && password !== passwordConfirm;

  const nicknameLengthInvalid = useMemo(() => {
    if (!nickname.trim()) return false;
    return !isNicknameLengthValid(nickname);
  }, [nickname]);

  const nicknameCharacterInvalid = useMemo(() => {
    if (!nickname.trim()) return false;
    return !isNicknameCharacterValid(nickname);
  }, [nickname]);

  const showLoginIdLengthError =
    loginId.trim().length > LOGIN_ID_MAX_LENGTH ||
    ((loginIdTouched || submitted) && loginIdLengthInvalid);
  const showLoginIdCharacterError =
    (loginIdTouched || submitted) && !showLoginIdLengthError && loginIdCharacterInvalid;
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
    ((nicknameTouched || submitted) && nicknameLengthInvalid);
  const showNicknameCharacterError =
    (nicknameTouched || submitted) && !showNicknameLengthError && nicknameCharacterInvalid;

  useEffect(() => {
    return () => {
      if (loadingOverlayTimerRef.current) {
        window.clearTimeout(loadingOverlayTimerRef.current);
      }

      if (loadingProgressTimerRef.current) {
        window.clearInterval(loadingProgressTimerRef.current);
      }
    };
  }, []);

  const clearLoadingTimers = () => {
    if (loadingOverlayTimerRef.current) {
      window.clearTimeout(loadingOverlayTimerRef.current);
      loadingOverlayTimerRef.current = null;
    }

    if (loadingProgressTimerRef.current) {
      window.clearInterval(loadingProgressTimerRef.current);
      loadingProgressTimerRef.current = null;
    }
  };

  const startLoadingFeedback = () => {
    setLoading(true);
    setSignupProgress(1);
    setElapsedMs(0);
    setConnectionComplete(false);
    loadingStartedAtRef.current = Date.now();
    loadingOverlayShownAtRef.current = 0;

    loadingProgressTimerRef.current = window.setInterval(() => {
      const currentElapsed = Date.now() - loadingStartedAtRef.current;
      setElapsedMs(currentElapsed);
      setSignupProgress(calculateAuthEstimatedProgress(currentElapsed));
    }, AUTH_PROGRESS_UPDATE_INTERVAL_MS);

    loadingOverlayTimerRef.current = window.setTimeout(() => {
      loadingOverlayShownAtRef.current = Date.now();
      setShowLoadingOverlay(true);
    }, AUTH_LOADING_OVERLAY_DELAY_MS);
  };

  const stopLoadingFeedback = async () => {
    clearLoadingTimers();

    if (loadingOverlayShownAtRef.current > 0) {
      const visibleFor = Date.now() - loadingOverlayShownAtRef.current;
      const remaining = Math.max(
        0,
        AUTH_LOADING_OVERLAY_MIN_VISIBLE_MS - visibleFor
      );

      if (remaining > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remaining));
      }
    }

    setShowLoadingOverlay(false);
    setLoading(false);
    setConnectionComplete(false);
    signupRequestInFlightRef.current = false;
    loadingStartedAtRef.current = 0;
    loadingOverlayShownAtRef.current = 0;
  };

  const completeLoadingFeedback = async () => {
    clearLoadingTimers();

    const finalElapsed = loadingStartedAtRef.current
      ? Date.now() - loadingStartedAtRef.current
      : 0;

    setElapsedMs(finalElapsed);
    setSignupProgress(100);
    setConnectionComplete(true);

    if (loadingOverlayShownAtRef.current > 0) {
      const visibleFor = Date.now() - loadingOverlayShownAtRef.current;
      const minVisibleRemaining = Math.max(
        0,
        AUTH_LOADING_OVERLAY_MIN_VISIBLE_MS - visibleFor
      );

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          Math.max(AUTH_LOADING_SUCCESS_VISIBLE_MS, minVisibleRemaining)
        )
      );
    }

    setShowLoadingOverlay(false);
    setLoading(false);
    signupRequestInFlightRef.current = false;
    loadingStartedAtRef.current = 0;
    loadingOverlayShownAtRef.current = 0;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (
      signupRequestInFlightRef.current ||
      !loginId.trim() ||
      loginIdLengthInvalid ||
      loginIdCharacterInvalid ||
      !password ||
      passwordInvalid ||
      !passwordConfirm ||
      passwordConfirmLengthInvalid ||
      passwordNotMatch ||
      !nickname.trim() ||
      nicknameLengthInvalid ||
      nicknameCharacterInvalid
    ) {
      return;
    }

    signupRequestInFlightRef.current = true;
    startLoadingFeedback();

    try {
      await signup(
        {
          loginId: loginId.trim(),
          password,
          nickname: nickname.trim(),
        },
        {
          timeout: AUTH_REQUEST_TIMEOUT_MS,
        }
      );

      await completeLoadingFeedback();
      alert(t("auth.signupSuccess"));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);

      const status = error.response?.status;
      const isTimeout =
        error.code === "ECONNABORTED" ||
        String(error.message || "").toLowerCase().includes("timeout");
      const isNetworkError = !error.response && !isTimeout;
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data;

      await stopLoadingFeedback();

      if (isTimeout) {
        setServerError(t("auth.signupServerTimeoutError"));
        return;
      }

      if (isNetworkError) {
        setServerError(t("auth.signupServerConnectionError"));
        return;
      }

      if ((status === 400 || status === 409) && typeof serverMessage === "string") {
        setServerError(serverMessage);
        return;
      }

      setServerError(t("auth.signupServerError"));
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

          <AuthColdStartNotice />

          <form className="auth-form" onSubmit={handleSignup} noValidate>
            <label className="auth-field">
              <span>{t("auth.loginIdLabel")}</span>
              <input
                className={
                  (submitted && !loginId.trim()) || showLoginIdLengthError || showLoginIdCharacterError
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
                  (submitted && !loginId.trim()) || showLoginIdLengthError || showLoginIdCharacterError
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
              ) : showLoginIdCharacterError ? (
                <small className="auth-field-error">
                  {t("auth.loginIdCharacterError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.loginIdRuleGuide")}
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
                  (submitted && !nickname.trim()) || showNicknameLengthError || showNicknameCharacterError
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
                  (submitted && !nickname.trim()) || showNicknameLengthError || showNicknameCharacterError
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
              ) : showNicknameCharacterError ? (
                <small className="auth-field-error">
                  {t("auth.nicknameCharacterError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.nicknameRuleGuide")}
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
              {loading && (
                <span className="auth-button-spinner" aria-hidden="true" />
              )}
              <span>{loading ? t("auth.signingUp") : t("auth.signupButton")}</span>
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

      {showLoadingOverlay && (
        <AuthServerLoadingOverlay
          progress={signupProgress}
          elapsedMs={elapsedMs}
          connectionComplete={connectionComplete}
          mode="signup"
        />
      )}
    </main>
  );
}

export default SignupPage;
