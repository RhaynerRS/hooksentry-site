import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    grafanaUrl: process.env.GRAFANA_URL ?? null,
  });
}
