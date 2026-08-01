import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import translations from "./translations";

const LanguageContext = createContext(null);

function getNestedTranslation(object, path) {
  return path.split(".").reduce((current, key) => {
    if (
      current !== null &&
      current !== undefined &&
      Object.prototype.hasOwnProperty.call(current, key)
    ) {
      return current[key];
    }

    return undefined;
  }, object);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "ko" || savedLanguage === "ja") {
      return savedLanguage;
    }

    const browserLanguage = navigator.language.toLowerCase();

    if (browserLanguage.startsWith("ja")) {
        return "ja";
    }

    return "ko";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (nextLanguage) => {
    if (nextLanguage !== "ko" && nextLanguage !== "ja") {
      return;
    }

    setLanguage(nextLanguage);
  };

  const value = useMemo(() => {
    const t = (key) => {
      const selectedTranslation = getNestedTranslation(
        translations[language],
        key
      );

      if (selectedTranslation !== undefined) {
        return selectedTranslation;
      }

      const koreanTranslation = getNestedTranslation(
        translations.ko,
        key
      );

      if (koreanTranslation !== undefined) {
        return koreanTranslation;
      }

      console.warn(`번역 키를 찾지 못했습니다: ${key}`);

      return key;
    };

    return {
      language,
      setLanguage: changeLanguage,
      changeLanguage,
      t,
      translations: translations[language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === null) {
    throw new Error(
      "useLanguage는 LanguageProvider 내부에서 사용해야 합니다."
    );
  }

  return context;
}

export { LanguageContext };