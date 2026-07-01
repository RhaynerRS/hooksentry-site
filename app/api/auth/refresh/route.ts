import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeJwtPayload } from '@/lib/auth/jwt';
import { setSessionCookies, clearSessionCookies } from '@/lib/auth/session-cookies';

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('hs_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const apiRes = await fetch(`${process.env.HOOKSENTRY_API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!apiRes.ok) {
    const res = NextResponse.json({ message: 'Session expired' }, { status: 401 });
    clearSessionCookies(res);
    return res;
  }

  const { accessToken, refreshToken: newRefresh } = await apiRes.json();
  const user = decodeJwtPayload(accessToken);

  // Return only the decoded user claims — the rotated tokens stay in httpOnly cookies.
  const res = NextResponse.json({ ok: true, user });
  setSessionCookies(res, accessToken, newRefresh);
  return res;
}
