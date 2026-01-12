'use client';

import { useLanguage } from '@/hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'uz' ? 'ru' : 'uz';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${
        language === 'uz' ? 'Russian' : 'Uzbek'
      } language`}
    >
      {language === 'uz' ? 'UZ' : 'RU'}
    </button>
  );
}
