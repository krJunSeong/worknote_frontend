import { useLanguage } from "../i18n/LanguageContext";
import {
  AUTH_COLD_START_ESTIMATE_MS,
  formatAuthDuration,
} from "../utils/authColdStart";

function AuthColdStartNotice() {
  const { t, language } = useLanguage();

  return (
    <div className="auth-cold-start-notice" role="note">
      <span className="auth-cold-start-notice-icon" aria-hidden="true">
        i
      </span>
      <div>
        <strong>{t("auth.coldStartNoticeTitle")}</strong>
        <p>
          {t("auth.coldStartNoticeDescriptionPrefix")}
          <b>{formatAuthDuration(AUTH_COLD_START_ESTIMATE_MS, language)}</b>
          {t("auth.coldStartNoticeDescriptionSuffix")}
        </p>
      </div>
    </div>
  );
}

export default AuthColdStartNotice;
