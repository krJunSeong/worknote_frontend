import { useLanguage } from "../i18n/LanguageContext";
import "./LanguageSelector.css";

function LanguageSelector({ compact = false }) {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div
      className={`language-selector ${compact ? "is-compact" : ""}`}
      role="group"
      aria-label={t("common.language")}
    >
      <span className="language-selector-icon" aria-hidden="true">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21" />
          <path d="M12 3C9.8 5.5 8.7 8.5 8.7 12S9.8 18.5 12 21" />
        </svg>
      </span>

      <button
        type="button"
        className={language === "ko" ? "is-active" : ""}
        onClick={() => changeLanguage("ko")}
        aria-pressed={language === "ko"}
      >
        {compact ? "KO" : t("common.korean")}
      </button>

      <button
        type="button"
        className={language === "ja" ? "is-active" : ""}
        onClick={() => changeLanguage("ja")}
        aria-pressed={language === "ja"}
      >
        {compact ? "JP" : t("common.japanese")}
      </button>
    </div>
  );
}

export default LanguageSelector;
