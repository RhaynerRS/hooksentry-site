'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { readCookie, THEME_COOKIE } from '@/lib/shared-cookie';

const VALID_THEMES = ['light', 'dark', 'system'];

export function ThemeSync() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const cookieTheme = readCookie(THEME_COOKIE);
    if (cookieTheme && cookieTheme !== theme && VALID_THEMES.includes(cookieTheme)) {
      setTheme(cookieTheme);
    }
  }, []);

  return null;
}
