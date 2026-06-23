import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    res.cookies.delete('hs_access_token');
    res.cookies.delete('hs_refresh_token');
    return res;
  }

  const { accessToken, refreshToken: newRefresh } = await apiRes.json();

  const res = NextResponse.json({ ok: true, accessToken });
  res.cookies.set('hs_access_token', accessToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 900,
    path: '/',
  });
  res.cookies.set('hs_refresh_token', newRefresh, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 604800,
    path: '/',
  });

  return res;
}
