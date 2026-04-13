import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  dark: {
    id: 'dark',
    label: 'Midnight',
    icon: '🌙',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.06)',
    text: '#f0f0ff',
    textSecondary: 'rgba(240, 240, 255, 0.6)',
    textMuted: 'rgba(240, 240, 255, 0.35)',
    bgBase: '#06060f',
  },
  light: {
    id: 'light',
    label: 'Daylight',
    icon: '☀️',
    surface: 'rgba(0, 0, 0, 0.03)',
    surfaceHover: 'rgba(0, 0, 0, 0.06)',
    border: 'rgba(0, 0, 0, 0.08)',
    text: '#1a1a2e',
    textSecondary: 'rgba(26, 26, 46, 0.6)',
    textMuted: 'rgba(26, 26, 46, 0.35)',
    bgBase: '#f5f5ff',
  },
  aurora: {
    id: 'aurora',
    label: 'Aurora',
    icon: '🌌',
    surface: 'rgba(100, 200, 255, 0.06)',
    surfaceHover: 'rgba(100, 200, 255, 0.1)',
    border: 'rgba(100, 200, 255, 0.1)',
    text: '#e0f0ff',
    textSecondary: 'rgba(224, 240, 255, 0.6)',
    textMuted: 'rgba(224, 240, 255, 0.35)',
    bgBase: '#050a14',
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    icon: '🌅',
    surface: 'rgba(255, 150, 100, 0.06)',
    surfaceHover: 'rgba(255, 150, 100, 0.1)',
    border: 'rgba(255, 150, 100, 0.1)',
    text: '#fff0e8',
    textSecondary: 'rgba(255, 240, 232, 0.6)',
    textMuted: 'rgba(255, 240, 232, 0.35)',
    bgBase: '#0f0805',
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('moodwave-theme');
      return saved && THEMES[saved] ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-surface-hover', theme.surfaceHover);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-text-muted', theme.textMuted);
    root.style.setProperty('--theme-bg-base', theme.bgBase);
    localStorage.setItem('moodwave-theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = useCallback((themeId) => {
    if (THEMES[themeId]) setCurrentTheme(themeId);
  }, []);

  const cycleTheme = useCallback(() => {
    const keys = Object.keys(THEMES);
    const idx = keys.indexOf(currentTheme);
    setCurrentTheme(keys[(idx + 1) % keys.length]);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, theme: THEMES[currentTheme], switchTheme, cycleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
