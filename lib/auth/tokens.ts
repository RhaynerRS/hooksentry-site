export function setTokenCookies(accessToken: string, refreshToken: string) {
  document.cookie = `hs_access_token=${accessToken}; path=/; max-age=900; samesite=lax`;
  document.cookie = `hs_refresh_token=${refreshToken}; path=/; max-age=604800; samesite=lax`;
}

export function clearTokenCookies() {
  document.cookie = 'hs_access_token=; path=/; max-age=0';
  document.cookie = 'hs_refresh_token=; path=/; max-age=0';
}

export function getAccessToken(): string | null {
  return readCookie('hs_access_token');
}

export function getRefreshToken(): string | null {
  return readCookie('hs_refresh_token');
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^| )${name}=([^;]+)`));
  return match ? match[1] : null;
}
