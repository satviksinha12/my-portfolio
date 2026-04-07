import { createContext, useContext, useState, useEffect } from 'react';
import storage from './storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(storage.getTheme);

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--primary', theme.primaryColor);
    r.setProperty('--accent', theme.accentColor);
    r.setProperty('--bg', theme.bgColor);
    r.setProperty('--surface', theme.surfaceColor);
    r.setProperty('--text', theme.textColor);
    r.setProperty('--font', theme.fontFamily + ', system-ui, sans-serif');
    r.setProperty('--radius', theme.borderRadius + 'px');
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    storage.saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
