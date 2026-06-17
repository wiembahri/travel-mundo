import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation } from "../i18n/translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "tm_language";
const SUPPORTED_LANGUAGES = ["en", "fr", "es"];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(nextLanguage)) {
      setLanguageState(nextLanguage);
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key) => getTranslation(language, key),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
