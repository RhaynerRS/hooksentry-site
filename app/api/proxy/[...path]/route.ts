import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.HOOKSENTRY_API_URL!;

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('hs_access_token')?.value;

  const { path } = await params;
  const url = `${API_URL}/api/v1/${path.join('/')}${req.nextUrl.search}`;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const body = req.method !== 'GET' && req.method !== 'HEAD'
    ? await req.text()
    : undefined;

  const upstream = await fetch(url, { method: req.method, headers, body });

  const responseBody = await upstream.text();

  return new NextResponse(responseBody || null, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
