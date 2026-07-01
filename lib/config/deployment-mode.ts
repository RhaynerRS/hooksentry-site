export type DeploymentMode = 'cloud' | 'selfhosted';

export function getDeploymentMode(): DeploymentMode {
  return process.env.HOOKSENTRY_DEPLOYMENT_MODE === 'cloud' ? 'cloud' : 'selfhosted';
}
