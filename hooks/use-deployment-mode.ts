'use client';

import { useEffect, useState } from 'react';
import type { DeploymentMode } from '@/lib/config/deployment-mode';

// Reads the server-resolved deployment mode from /api/config once. Used to gate
// cloud-only UI (Owner/Viewer roles). Defaults to selfhosted on any failure.
export function useDeploymentMode() {
  const [deploymentMode, setDeploymentMode] = useState<DeploymentMode | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(({ deploymentMode }) => setDeploymentMode(deploymentMode ?? 'selfhosted'))
      .catch(() => setDeploymentMode('selfhosted'));
  }, []);

  return { deploymentMode, isCloud: deploymentMode === 'cloud' };
}
