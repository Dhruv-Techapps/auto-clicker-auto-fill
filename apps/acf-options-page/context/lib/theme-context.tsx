import React, { createContext, PropsWithChildren, useMemo, useState } from 'react';

export type tTheme = 'light' | 'dark';

export const ThemeContext = createContext({
  theme: localStorage.getItem('theme') || 'light',
  updateTheme: (theme: tTheme | null) => {
    return theme;
  }
});

export const getStoredTheme = () => localStorage.getItem('theme');

const removeStoredTheme = () => localStorage.removeItem('theme');

const setStoredTheme = (theme: tTheme) => localStorage.setItem('theme', theme);

const getPreferredTheme = (): tTheme => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme as tTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<tTheme>(getPreferredTheme());

  const updateTheme = (theme: tTheme | null) => {
    if (theme === null) {
      removeStoredTheme();
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      setStoredTheme(theme);
      setTheme(theme);
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    return theme;
  };

  document.documentElement.setAttribute('data-bs-theme', theme);

  const value = useMemo(() => ({ theme, updateTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
