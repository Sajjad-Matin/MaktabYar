"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("ttg_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "fa" || savedLang === "ps")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ttg_lang", lang);
    }
  };

  const dir: "ltr" | "rtl" = language === "fa" || language === "ps" ? "rtl" : "ltr";

  const t = (key: keyof Translations): string => {
    const currentDict = translations[language] || translations.en;
    return currentDict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      <div dir={dir} className={dir === "rtl" ? "font-sans rtl-active" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en" as Language,
      setLanguage: () => {},
      dir: "ltr" as "ltr" | "rtl",
      t: (key: keyof Translations) => translations.en[key] || String(key),
    };
  }
  return context;
}
