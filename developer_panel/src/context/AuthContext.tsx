'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'developer' | 'super_admin' | 'client_admin' | 'seller' | 'customer';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  tenantId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isPlatformDeveloper: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_DEV_USER: AuthUser = {
  uid: 'dev_sarah_01',
  email: 'sarah.architect@poultryplatform.dev',
  displayName: 'Sarah Chen (Principal Architect)',
  role: 'developer',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_DEV_USER,
  role: 'developer',
  isPlatformDeveloper: true,
  isLoading: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_DEV_USER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('poultry_dev_auth');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore in SSR
    }
  }, []);

  const login = (email: string, role: UserRole = 'developer') => {
    setIsLoading(true);
    const authedUser: AuthUser = {
      uid: `dev_${Date.now()}`,
      email,
      displayName: email.split('@')[0].replace('.', ' '),
      role,
    };
    setUser(authedUser);
    localStorage.setItem('poultry_dev_auth', JSON.stringify(authedUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('poultry_dev_auth');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: AuthUser = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('poultry_dev_auth', JSON.stringify(updated));
  };

  const isPlatformDeveloper = user?.role === 'developer' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isPlatformDeveloper,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
