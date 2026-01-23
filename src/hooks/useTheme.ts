import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return {
    theme: currentTheme,
    setTheme,
    isDark,
    toggleTheme,
  };
};
