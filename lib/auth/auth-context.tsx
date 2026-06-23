'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@/lib/types/auth';
import { clearTokenCookies, getRefreshToken } from '@/lib/auth/tokens';
import { decodeJwtPayload } from '@/lib/auth/jwt';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser: AuthUser | null }) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const refreshedUser = (e as CustomEvent<AuthUser>).detail;
      setUser(refreshedUser);
    };
    window.addEventListener('auth:token-refreshed', handler);
    return () => window.removeEventListener('auth:token-refreshed', handler);
  }, []);

  // When access token cookie is gone but refresh token exists, restore session silently
  useEffect(() => {
    if (initialUser !== null) return;
    if (!getRefreshToken()) return;

    setIsLoading(true);
    fetch('/api/auth/refresh', { method: 'POST' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.accessToken) {
          const decoded = decodeJwtPayload(data.accessToken);
          if (decoded) setUser(decoded);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (user: AuthUser) => setUser(user);

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await fetch('/api/proxy/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }

    clearTokenCookies();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
