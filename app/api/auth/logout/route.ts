import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearSessionCookies } from '@/lib/auth/session-cookies';

// Server-side logout. Reads the httpOnly tokens from the cookie store, invalidates
// them on the API (refresh token removal + access token denylist), and clears the
// cookies — no token is ever read by client-side JS.
export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('hs_access_token')?.value;
  const refreshToken = cookieStore.get('hs_refresh_token')?.value;

  if (accessToken && refreshToken) {
    await fetch(`${process.env.HOOKSENTRY_API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  clearSessionCookies(res);
  return res;
}
