import { useLanguage } from "../i18n/LanguageContext";
import "./LanguageSelector.css";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="language-selector"
      aria-label="언어 선택"
    >
      <button
        type="button"
        className={
          language === "ko"
            ? "language-button active"
            : "language-button"
        }
        onClick={() => setLanguage("ko")}
      >
        한국어
      </button>

      <button
        type="button"
        className={
          language === "ja"
            ? "language-button active"
            : "language-button"
        }
        onClick={() => setLanguage("ja")}
      >
        日本語
      </button>
    </div>
  );
}

export default LanguageSelector;