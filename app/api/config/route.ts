import { NextResponse } from 'next/server';
import { getDeploymentMode } from '@/lib/config/deployment-mode';

export function GET() {
  return NextResponse.json({
    grafanaUrl: process.env.GRAFANA_URL ?? null,
    deploymentMode: getDeploymentMode(),
  });
}
