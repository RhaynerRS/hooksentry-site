const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

export const LOCALE_COOKIE = "hs_locale";
export const THEME_COOKIE = "hs_theme";
export const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function setSharedCookie(name: string, value: string, maxAgeSeconds: number) {
  const domainPart = COOKIE_DOMAIN ? `; domain=${COOKIE_DOMAIN}` : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}${domainPart}; SameSite=Lax`;
}

export function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
