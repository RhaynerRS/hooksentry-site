import { NextResponse } from 'next/server';
import { getDeploymentMode } from '@/lib/config/deployment-mode';

export function GET() {
  return NextResponse.json({
    grafanaUrl: process.env.GRAFANA_URL ?? null,
    docsUrl: process.env.HOOKSENTRY_DOCS_URL ?? 'https://docs.hooksentry.com',
    deploymentMode: getDeploymentMode(),
  });
}
