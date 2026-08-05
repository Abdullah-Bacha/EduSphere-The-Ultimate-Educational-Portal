'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {
      // Ignore localStorage errors in SSR
    }
  }, []);

  return null;
}
