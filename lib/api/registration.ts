import { cloudApi } from './client';

export interface RegistrationCapabilities {
  fingerprintEnabled: boolean;
  turnstileEnabled: boolean;
  turnstileSiteKey: string | null;
}

const DISABLED: RegistrationCapabilities = {
  fingerprintEnabled: false,
  turnstileEnabled: false,
  turnstileSiteKey: null,
};

export const registrationApi = {
  // GET /cloud/registration-capabilities (público). Só existe no cloud; no self-hosted
  // o backend responde 404 → retornamos tudo desabilitado e o form fica idêntico ao atual.
  getCapabilities: async (): Promise<RegistrationCapabilities> => {
    try {
      return await cloudApi.get<RegistrationCapabilities>('/registration-capabilities');
    } catch {
      return DISABLED;
    }
  },
};
