import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguageRefresh() {
  const { i18n } = useTranslation();
  const [languageVersion, setLanguageVersion] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('🔄 Language refresh hook detected change:', lng);
      setLanguageVersion(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return languageVersion;
}
