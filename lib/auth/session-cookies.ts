import { NextResponse } from 'next/server';

// Server-only helpers that own the auth cookie contract. Tokens are written as
// httpOnly cookies so they are never readable by client-side JavaScript (XSS can
// no longer exfiltrate them); the Next.js server still reads them via the cookie
// store for the proxy, refresh and logout routes.

const ACCESS_TOKEN_COOKIE = 'hs_access_token';
const REFRESH_TOKEN_COOKIE = 'hs_refresh_token';
const ACCESS_MAX_AGE = 900;      // 15 minutes — matches the JWT TTL
const REFRESH_MAX_AGE = 604800;  // 7 days — matches the refresh token TTL

export function setSessionCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production';

  res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: ACCESS_MAX_AGE,
    path: '/',
  });

  res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: REFRESH_MAX_AGE,
    path: '/',
  });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(ACCESS_TOKEN_COOKIE);
  res.cookies.delete(REFRESH_TOKEN_COOKIE);
}
