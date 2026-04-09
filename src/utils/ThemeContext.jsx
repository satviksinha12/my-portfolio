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

    // Derive dim and border colors based on brightness
    const bg = theme.bgColor || '#0f172a';
    const bgR = parseInt(bg.slice(1, 3), 16);
    const bgG = parseInt(bg.slice(3, 5), 16);
    const bgB = parseInt(bg.slice(5, 7), 16);
    const isDark = (bgR * 299 + bgG * 587 + bgB * 114) / 1000 < 128;
    r.setProperty('--dim', isDark ? '#94a3b8' : '#64748b');
    r.setProperty('--border', isDark ? '#334155' : '#e2e8f0');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
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
