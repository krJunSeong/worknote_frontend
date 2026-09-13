import { useLanguage } from "../i18n/LanguageContext";
import {
  AUTH_COLD_START_ESTIMATE_MS,
  AUTH_REQUEST_TIMEOUT_MS,
  formatAuthDuration,
} from "../utils/authColdStart";

function AuthServerLoadingOverlay({
  progress,
  elapsedMs,
  connectionComplete,
  mode = "login",
}) {
  const { t, language } = useLanguage();
  const estimateExceeded =
    elapsedMs > AUTH_COLD_START_ESTIMATE_MS && !connectionComplete;
  const expectedRemainingMs = Math.max(
    0,
    AUTH_COLD_START_ESTIMATE_MS - elapsedMs
  );
  const isSignup = mode === "signup";

  const completeDescriptionKey = isSignup
    ? "auth.signupLoadingCompleteDescription"
    : "auth.loginLoadingCompleteDescription";
  const loadingDescriptionSuffixKey = isSignup
    ? "auth.signupLoadingDescriptionSuffix"
    : "auth.loginLoadingDescriptionSuffix";

  return (
    <div
      className="auth-loading-overlay"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="auth-loading-title"
      aria-describedby="auth-loading-description"
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
          <strong>{progress}%</strong>
        </div>

        <div
          className={`auth-loading-progress ${
            connectionComplete ? "is-complete" : ""
          }`}
          role="progressbar"
          aria-label={t("auth.loginLoadingProgressLabel")}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="auth-loading-time-grid">
          <div>
            <span>{t("auth.loginLoadingEstimatedTimeLabel")}</span>
            <strong>
              {formatAuthDuration(AUTH_COLD_START_ESTIMATE_MS, language)}
            </strong>
          </div>
          <div>
            <span>
              {estimateExceeded
                ? t("auth.loginLoadingElapsedTimeLabel")
                : t("auth.loginLoadingRemainingTimeLabel")}
            </span>
            <strong>
              {formatAuthDuration(
                estimateExceeded ? elapsedMs : expectedRemainingMs,
                language
              )}
            </strong>
          </div>
        </div>

        <div className="auth-loading-copy">
          <h2 id="auth-loading-title">
            {connectionComplete
              ? t("auth.loginLoadingCompleteTitle")
              : estimateExceeded
                ? t("auth.loginLoadingOverEstimateTitle")
                : t("auth.loginLoadingTitle")}
          </h2>
          <p id="auth-loading-description">
            {connectionComplete ? (
              t(completeDescriptionKey)
            ) : estimateExceeded ? (
              <>
                {t("auth.loginLoadingOverEstimateDescriptionPrefix")}
                <strong>
                  {formatAuthDuration(AUTH_REQUEST_TIMEOUT_MS, language)}
                </strong>
                {t("auth.loginLoadingOverEstimateDescriptionSuffix")}
              </>
            ) : (
              <>
                {t("auth.loginLoadingDescriptionPrefix")}
                <strong>
                  {formatAuthDuration(AUTH_COLD_START_ESTIMATE_MS, language)}
                </strong>
                {t(loadingDescriptionSuffixKey)}
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
  );
}

export default AuthServerLoadingOverlay;
