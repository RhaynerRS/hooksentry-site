'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '@/lib/types/auth';
import { clearTokenCookies, getRefreshToken } from '@/lib/auth/tokens';

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
