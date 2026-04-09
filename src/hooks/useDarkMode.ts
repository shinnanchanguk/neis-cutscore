import { useEffect } from 'react';
import { useExamStore } from '@/store/examStore';

export function useDarkMode() {
  const darkMode = useExamStore(s => s.settings.darkMode);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (darkMode === 'dark') {
      applyTheme(true);
    } else if (darkMode === 'light') {
      applyTheme(false);
    } else {
      // system
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(media.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [darkMode]);
}
