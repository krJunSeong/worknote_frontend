import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthPage.css";

const LOGIN_ID_MIN_LENGTH = 4;
const LOGIN_ID_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 5;
const PASSWORD_MAX_LENGTH = 12;
const LOADING_OVERLAY_DELAY_MS = 250;
const LOADING_OVERLAY_MIN_VISIBLE_MS = 400;
const LOADING_SUCCESS_VISIBLE_MS = 500;
const PROGRESS_UPDATE_INTERVAL_MS = 250;

function readPositiveNumber(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

const LOGIN_COLD_START_ESTIMATE_MS = readPositiveNumber(
  import.meta.env.VITE_LOGIN_COLD_START_ESTIMATE_MS,
  150000
);

const LOGIN_TIMEOUT_MS = Math.max(
  readPositiveNumber(
    import.meta.env.VITE_LOGIN_TIMEOUT_MS,
    600000
  ),
  LOGIN_COLD_START_ESTIMATE_MS + 1000
);

function calculateEstimatedProgress(elapsedMs) {
  if (elapsedMs <= 0) {
    return 1;
  }

  if (elapsedMs <= LOGIN_COLD_START_ESTIMATE_MS) {
    const ratio = elapsedMs / LOGIN_COLD_START_ESTIMATE_MS;
    return Math.min(95, Math.max(1, Math.round(1 + ratio * 94)));
  }

  const overtimeWindow = Math.max(
    1,
    LOGIN_TIMEOUT_MS - LOGIN_COLD_START_ESTIMATE_MS
  );
  const overtimeRatio = Math.min(
    1,
    (elapsedMs - LOGIN_COLD_START_ESTIMATE_MS) / overtimeWindow
  );

  return Math.min(99, Math.round(95 + overtimeRatio * 4));
}

function formatDuration(durationMs, language) {
  const totalSeconds = Math.max(0, Math.ceil(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (language === "ja") {
    if (minutes === 0) {
      return `${seconds}秒`;
    }

    if (seconds === 0) {
      return `${minutes}分`;
    }

    return `${minutes}分 ${seconds}秒`;
  }

  if (minutes === 0) {
    return `${seconds}초`;
  }

  if (seconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${seconds}초`;
}

function LoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

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

  const loginIdFormatInvalid = useMemo(() => {
    if (!loginId.trim()) {
      return false;
    }

    const length = loginId.trim().length;
    return length < LOGIN_ID_MIN_LENGTH || length > LOGIN_ID_MAX_LENGTH;
  }, [loginId]);

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
  const showLoginIdFormatError =
    loginId.trim().length > LOGIN_ID_MAX_LENGTH ||
    ((loginIdTouched || submitted) && loginIdFormatInvalid);
  const showPasswordFormatError =
    (passwordTouched || submitted) && passwordFormatInvalid;

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
      setLoginProgress(calculateEstimatedProgress(currentElapsed));
    }, PROGRESS_UPDATE_INTERVAL_MS);

    loadingOverlayTimerRef.current = window.setTimeout(() => {
      loadingOverlayShownAtRef.current = Date.now();
      setShowLoadingOverlay(true);
    }, LOADING_OVERLAY_DELAY_MS);
  };

  const stopLoadingFeedback = async () => {
    clearLoadingTimers();

    if (loadingOverlayShownAtRef.current > 0) {
      const visibleFor = Date.now() - loadingOverlayShownAtRef.current;
      const remaining = Math.max(
        0,
        LOADING_OVERLAY_MIN_VISIBLE_MS - visibleFor
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
        LOADING_OVERLAY_MIN_VISIBLE_MS - visibleFor
      );

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          Math.max(LOADING_SUCCESS_VISIBLE_MS, minVisibleRemaining)
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
      loginIdFormatInvalid ||
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
          timeout: LOGIN_TIMEOUT_MS,
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

      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;
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

      setCredentialError(serverMessage || t("auth.loginError"));
      setFailedFields({ loginId: true, password: true });
    }
  };

  const loginIdInvalid =
    loginIdRequired || showLoginIdFormatError || failedFields.loginId;
  const passwordInvalid =
    passwordRequired || showPasswordFormatError || failedFields.password;

  const estimateExceeded =
    elapsedMs > LOGIN_COLD_START_ESTIMATE_MS && !connectionComplete;
  const expectedRemainingMs = Math.max(
    0,
    LOGIN_COLD_START_ESTIMATE_MS - elapsedMs
  );

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
              ) : showLoginIdFormatError ? (
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
        <div
          className="auth-loading-overlay"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-labelledby="login-loading-title"
          aria-describedby="login-loading-description"
        >
          <div className="auth-loading-card">
            <div className="auth-loading-brand-row">
              <span className="auth-loading-brand-mark" aria-hidden="true">
                W
              </span>
              <div className="auth-loading-brand-copy">
                <strong>WorkNote</strong>
                <span>
                  {connectionComplete
                    ? t("auth.loginLoadingCompleteStatus")
                    : estimateExceeded
                      ? t("auth.loginLoadingOverEstimateStatus")
                      : t("auth.loginLoadingStatus")}
                </span>
              </div>
            </div>


            <div
              className={`auth-loading-visual ${
                connectionComplete
                  ? "is-complete"
                  : estimateExceeded
                    ? "is-overtime"
                    : ""
              }`}
              aria-hidden="true"
            >
              <span className="auth-loading-orbit auth-loading-orbit-one">
                <i />
              </span>
              <span className="auth-loading-orbit auth-loading-orbit-two">
                <i />
              </span>
              <span className="auth-loading-pulse auth-loading-pulse-one" />
              <span className="auth-loading-pulse auth-loading-pulse-two" />

              <div className="auth-loading-server">
                <span className="auth-loading-server-face">
                  <b>{connectionComplete ? "✓" : "W"}</b>
                </span>
                <span className="auth-loading-server-lights">
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <span className="auth-loading-signal auth-loading-signal-left">
                <i />
              </span>
              <span className="auth-loading-signal auth-loading-signal-right">
                <i />
              </span>
            </div>

            <div className="auth-loading-progress-head">
              <span>{t("auth.loginLoadingProgressEstimate")}</span>
              <strong>{loginProgress}%</strong>
            </div>

            <div
              className={`auth-loading-progress ${
                connectionComplete ? "is-complete" : ""
              }`}
              role="progressbar"
              aria-label={t("auth.loginLoadingProgressLabel")}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={loginProgress}
            >
              <span style={{ width: `${loginProgress}%` }} />
            </div>

            <div className="auth-loading-time-grid">
              <div>
                <span>{t("auth.loginLoadingEstimatedTimeLabel")}</span>
                <strong>
                  {formatDuration(LOGIN_COLD_START_ESTIMATE_MS, language)}
                </strong>
              </div>
              <div>
                <span>
                  {estimateExceeded
                    ? t("auth.loginLoadingElapsedTimeLabel")
                    : t("auth.loginLoadingRemainingTimeLabel")}
                </span>
                <strong>
                  {formatDuration(
                    estimateExceeded ? elapsedMs : expectedRemainingMs,
                    language
                  )}
                </strong>
              </div>
            </div>

            <div className="auth-loading-copy">
              <h2 id="login-loading-title">
                {connectionComplete
                  ? t("auth.loginLoadingCompleteTitle")
                  : estimateExceeded
                    ? t("auth.loginLoadingOverEstimateTitle")
                    : t("auth.loginLoadingTitle")}
              </h2>
              <p id="login-loading-description">
                {connectionComplete ? (
                  t("auth.loginLoadingCompleteDescription")
                ) : estimateExceeded ? (
                  <>
                    {t("auth.loginLoadingOverEstimateDescriptionPrefix")}
                    <strong>
                      {formatDuration(LOGIN_TIMEOUT_MS, language)}
                    </strong>
                    {t("auth.loginLoadingOverEstimateDescriptionSuffix")}
                  </>
                ) : (
                  <>
                    {t("auth.loginLoadingDescriptionPrefix")}
                    <strong>
                      {formatDuration(
                        LOGIN_COLD_START_ESTIMATE_MS,
                        language
                      )}
                    </strong>
                    {t("auth.loginLoadingDescriptionSuffix")}
                  </>
                )}
              </p>
            </div>

            <div className="auth-loading-note">
              <span
                className={`auth-loading-note-dot ${
                  connectionComplete ? "is-complete" : ""
                }`}
                aria-hidden="true"
              />
              <span>
                {connectionComplete
                  ? t("auth.loginLoadingCompleteGuide")
                  : estimateExceeded
                    ? t("auth.loginLoadingOverEstimateGuide")
                    : t("auth.loginLoadingGuide")}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LoginPage;
