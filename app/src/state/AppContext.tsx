import React, { createContext, useState, useContext } from 'react';

// Define the shape of your context state
interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  // Add other global state properties here
}

// Create the context with a default value
const AppContext = createContext<AppState | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const value = {
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
