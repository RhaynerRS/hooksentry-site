import { NextRequest, NextResponse } from 'next/server';
import { decodeJwtPayload } from '@/lib/auth/jwt';
import { setSessionCookies } from '@/lib/auth/session-cookies';

// Server-side login. Credentials are forwarded to the API, the returned tokens are
// stored as httpOnly cookies, and only the (non-sensitive) decoded user claims are
// returned to the browser — the access/refresh tokens never reach client-side JS.
export async function POST(req: NextRequest) {
  const credentials = await req.text();

  const apiRes = await fetch(`${process.env.HOOKSENTRY_API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: credentials,
  });

  if (!apiRes.ok) {
    // Forward the upstream status and body so the page can show the right message
    // (e.g. 429 rate limited) without exposing anything sensitive.
    const body = await apiRes.text();
    return new NextResponse(body || null, {
      status: apiRes.status,
      headers: { 'Content-Type': apiRes.headers.get('Content-Type') ?? 'application/json' },
    });
  }

  const { accessToken, refreshToken } = await apiRes.json();
  const user = decodeJwtPayload(accessToken);

  const res = NextResponse.json({ user });
  setSessionCookies(res, accessToken, refreshToken);
  return res;
}
