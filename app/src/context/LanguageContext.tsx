import React, { createContext, useState, useContext } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'hi';

// Define our Theme Colors
const LightTheme = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  primary: '#2563EB',
  iconBg: '#EFF6FF',
  border: '#F1F5F9'
};

const DarkTheme = {
  background: '#0F172A', // Dark Navy
  card: '#1E293B',       // Slightly lighter navy
  text: '#F8FAFC',       // White
  textSecondary: '#94A3B8', // Light Gray
  primary: '#3B82F6',    // Lighter Blue for dark mode
  iconBg: 'rgba(255,255,255,0.1)',
  border: '#334155'
};

interface PreferencesContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  t: typeof translations.en;
  theme: typeof LightTheme; // The active theme
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleOfflineMode = () => setIsOfflineMode(prev => !prev);

  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <PreferencesContext.Provider value={{ 
      language, 
      setLanguage, 
      isDarkMode, 
      toggleDarkMode,
      isOfflineMode, 
      toggleOfflineMode,
      t: translations[language],
      theme 
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Keeping the name 'useLanguage' so we don't break your other files
export const useLanguage = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
