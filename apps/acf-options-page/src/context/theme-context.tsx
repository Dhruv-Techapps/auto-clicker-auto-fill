import React, { createContext, PropsWithChildren, useMemo, useState } from 'react';

export type tTheme = 'light' | 'dark';

export const getStoredTheme = () => localStorage.getItem('theme');

const removeStoredTheme = () => localStorage.removeItem('theme');

const setStoredTheme = (theme: tTheme) => localStorage.setItem('theme', theme);

const getSystemPreferredTheme = (): tTheme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getPreferredTheme = (): tTheme => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme as tTheme;
  }
  return getSystemPreferredTheme();
};

export const ThemeContext = createContext({
  theme: getPreferredTheme(),
  updateTheme: (theme: tTheme | null) => {
    return theme;
  }
});

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<tTheme>(getPreferredTheme());

  const updateTheme = (theme: tTheme | null) => {
    if (theme === null) {
      removeStoredTheme();
      const systemTheme = getSystemPreferredTheme();
      setTheme(systemTheme);
      document.documentElement.setAttribute('data-bs-theme', systemTheme);
    } else {
      setStoredTheme(theme);
      setTheme(theme);
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
    return theme;
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, updateTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
