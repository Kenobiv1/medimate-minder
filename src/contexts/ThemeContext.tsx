
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLargeText: boolean;
  toggleLargeText: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Use localStorage to persist theme and text size preferences
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [isLargeText, setIsLargeText] = useLocalStorage<boolean>('largeText', false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isLargeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [isLargeText]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLargeText = () => {
    setIsLargeText((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLargeText, toggleLargeText }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
