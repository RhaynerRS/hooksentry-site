import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.HOOKSENTRY_API_URL!;

// Same shape as app/api/proxy/[...path]/route.ts, but targets the cloud-only
// routes (/cloud/*) instead of /api/v1/* — these only exist on hooksentry-cloud,
// self-hosted backends simply 404 here.
async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('hs_access_token')?.value;

  const { path } = await params;
  const url = `${API_URL}/cloud/${path.join('/')}${req.nextUrl.search}`;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const upstream = await fetch(url, { method: req.method, headers });

  const responseBody = await upstream.text();

  return new NextResponse(responseBody || null, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export { handler as GET };
