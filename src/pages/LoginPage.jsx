import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import AuthColdStartNotice from "../components/AuthColdStartNotice";
import AuthServerLoadingOverlay from "../components/AuthServerLoadingOverlay";
import { useLanguage } from "../i18n/LanguageContext";
import {
  LOGIN_ID_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  isLoginIdCharacterValid,
  isLoginIdLengthValid,
  isLoginPasswordLengthValid,
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

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loginId, setLoginId] = useState("");
  const [loginIdTouched, setLoginIdTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loginProgress, setLoginProgress] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const loadingOverlayTimerRef = useRef(null);
  const loadingProgressTimerRef = useRef(null);
  const loadingStartedAtRef = useRef(0);
  const loadingOverlayShownAtRef = useRef(0);
  const loginRequestInFlightRef = useRef(false);
  const [credentialError, setCredentialError] = useState("");
  const [failedFields, setFailedFields] = useState({
    loginId: false,
    password: false,
  });

  const loginIdLengthInvalid = useMemo(() => {
    if (!loginId.trim()) return false;
    return !isLoginIdLengthValid(loginId);
  }, [loginId]);

  const loginIdCharacterInvalid = useMemo(() => {
    if (!loginId.trim()) return false;
    return !isLoginIdCharacterValid(loginId);
  }, [loginId]);

  const passwordFormatInvalid = useMemo(() => {
    if (!password) return false;
    return !isLoginPasswordLengthValid(password);
  }, [password]);

  const loginIdRequired = submitted && !loginId.trim();
  const passwordRequired = submitted && !password;
  const showLoginIdLengthError =
    loginId.trim().length > LOGIN_ID_MAX_LENGTH ||
    ((loginIdTouched || submitted) && loginIdLengthInvalid);
  const showLoginIdCharacterError =
    (loginIdTouched || submitted) && !showLoginIdLengthError && loginIdCharacterInvalid;
  const showPasswordFormatError =
    password.length > PASSWORD_MAX_LENGTH ||
    ((passwordTouched || submitted) && passwordFormatInvalid);

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
    setLoginProgress(1);
    setElapsedMs(0);
    setConnectionComplete(false);
    loadingStartedAtRef.current = Date.now();
    loadingOverlayShownAtRef.current = 0;

    loadingProgressTimerRef.current = window.setInterval(() => {
      const currentElapsed = Date.now() - loadingStartedAtRef.current;
      setElapsedMs(currentElapsed);
      setLoginProgress(calculateAuthEstimatedProgress(currentElapsed));
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
    loginRequestInFlightRef.current = false;
    loadingStartedAtRef.current = 0;
    loadingOverlayShownAtRef.current = 0;
  };

  const completeLoadingFeedback = async () => {
    clearLoadingTimers();

    const finalElapsed = loadingStartedAtRef.current
      ? Date.now() - loadingStartedAtRef.current
      : 0;

    setElapsedMs(finalElapsed);
    setLoginProgress(100);
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
    loginRequestInFlightRef.current = false;
    loadingStartedAtRef.current = 0;
    loadingOverlayShownAtRef.current = 0;
  };

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

    if (
      loginRequestInFlightRef.current ||
      !loginId.trim() ||
      loginIdLengthInvalid ||
      loginIdCharacterInvalid ||
      !password ||
      passwordFormatInvalid
    ) {
      return;
    }

    loginRequestInFlightRef.current = true;
    startLoadingFeedback();
    setCredentialError("");

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          loginId: loginId.trim(),
          password,
        },
        {
          timeout: AUTH_REQUEST_TIMEOUT_MS,
        }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userId", String(response.data.userId));
      localStorage.setItem("loginId", response.data.loginId);
      localStorage.setItem("nickname", response.data.nickname);

      await completeLoadingFeedback();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      const status = error.response?.status;
      const isTimeout =
        error.code === "ECONNABORTED" ||
        String(error.message || "").toLowerCase().includes("timeout");
      const isNetworkError = !error.response && !isTimeout;

      await stopLoadingFeedback();

      if (isTimeout) {
        setCredentialError(t("auth.loginServerTimeoutError"));
        setFailedFields({ loginId: false, password: false });
        return;
      }

      if (isNetworkError) {
        setCredentialError(t("auth.loginServerConnectionError"));
        setFailedFields({ loginId: false, password: false });
        return;
      }

      if (status === 400 || status === 401 || status === 403) {
        setCredentialError(t("auth.loginError"));
        setFailedFields({ loginId: true, password: true });
        return;
      }

      setCredentialError(t("auth.loginServerError"));
      setFailedFields({ loginId: false, password: false });
    }
  };

  const loginIdInvalid =
    loginIdRequired || showLoginIdLengthError || showLoginIdCharacterError || failedFields.loginId;
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

          <AuthColdStartNotice />

          <form
            className="auth-form"
            onSubmit={login}
            noValidate
            aria-busy={loading}
          >
            <label className="auth-field">
              <span>{t("auth.loginIdLabel")}</span>
              <input
                className={loginIdInvalid ? "is-invalid" : ""}
                type="text"
                placeholder={t("auth.loginIdPlaceholder")}
                value={loginId}
                onChange={handleLoginIdChange}
                onBlur={() => setLoginIdTouched(true)}
                disabled={loading}
                autoComplete="username"
                aria-invalid={loginIdInvalid}
              />
              {loginIdRequired ? (
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
                  {t("auth.loginPasswordError")}
                </small>
              ) : (
                <small className="auth-field-help">
                  {t("auth.loginPasswordGuide")}
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
              {loading && (
                <span className="auth-button-spinner" aria-hidden="true" />
              )}
              <span>
                {loading ? t("auth.loggingIn") : t("auth.loginButton")}
              </span>
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

      {showLoadingOverlay && (
        <AuthServerLoadingOverlay
          progress={loginProgress}
          elapsedMs={elapsedMs}
          connectionComplete={connectionComplete}
          mode="login"
        />
      )}
    </main>
  );
}

export default LoginPage;
