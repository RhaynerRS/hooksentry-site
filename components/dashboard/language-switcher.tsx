'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, ONE_YEAR_SECONDS, setSharedCookie } from '@/lib/shared-cookie';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (value: string) => {
    setSharedCookie(LOCALE_COOKIE, value, ONE_YEAR_SECONDS);
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={e => handleChange(e.target.value)}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      aria-label="Language"
    >
      {LOCALES.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
