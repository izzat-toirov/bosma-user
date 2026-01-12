'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (obj: { uz: string; ru?: string }) => string;
  getContent: (uzContent: string, ruContent?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      return savedLang === 'ru' ? 'ru' : 'uz';
    }
    return 'uz';
  });

  const t = (obj: { uz: string; ru?: string }): string => {
    return language === 'ru' && obj.ru ? obj.ru : obj.uz;
  };

  const getContent = (uzContent: string, ruContent?: string): string => {
    return language === 'ru' && ruContent ? ruContent : uzContent;
  };

  const value = {
    language,
    setLanguage,
    t,
    getContent,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
