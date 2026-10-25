'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'developer' | 'super_admin' | 'client_admin' | 'seller' | 'customer';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  tenantId: string;
  sellerId?: string;
}

export const PRESET_PERSONAS: Record<string, AuthUser> = {
  developer: {
    uid: 'dev_sarah_01',
    email: 'sarah.architect@poultryplatform.dev',
    displayName: 'Sarah Chen (Principal Architect)',
    role: 'developer',
    tenantId: 'apex-poultry-hub',
  },
  client_admin: {
    uid: 'admin_vikram_01',
    email: 'vikram.admin@apex-poultry.in',
    displayName: 'Vikramaditya Rao (Hub Admin)',
    role: 'client_admin',
    tenantId: 'apex-poultry-hub',
  },
  seller: {
    uid: 'seller_krishna_01',
    email: 'ramesh@krishnafarms.in',
    displayName: 'Ramesh Krishna (Krishna Broiler Farms)',
    role: 'seller',
    tenantId: 'apex-poultry-hub',
    sellerId: 'seller_krishna_01',
  },
  customer: {
    uid: 'cust_anand_01',
    email: 'anand.verma@gmail.com',
    displayName: 'Anand Verma (Customer)',
    role: 'customer',
    tenantId: 'apex-poultry-hub',
  },
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  tenantId: string;
  sellerId?: string;
  isPlatformDeveloper: boolean;
  isClientAdmin: boolean;
  isSeller: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole, tenantId?: string, sellerId?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchTenant: (tenantId: string) => void;
  switchSeller: (sellerId: string) => void;
  switchPersona: (personaKey: keyof typeof PRESET_PERSONAS) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: PRESET_PERSONAS.developer,
  role: 'developer',
  tenantId: 'apex-poultry-hub',
  sellerId: 'seller_krishna_01',
  isPlatformDeveloper: true,
  isClientAdmin: false,
  isSeller: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
  switchTenant: () => {},
  switchSeller: () => {},
  switchPersona: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(PRESET_PERSONAS.developer);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('poultry_platform_auth');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore in SSR
    }
  }, []);

  const saveUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('poultry_platform_auth', JSON.stringify(u));
    } else {
      localStorage.removeItem('poultry_platform_auth');
    }
  };

  const login = (
    email: string,
    role: UserRole = 'developer',
    tenantId: string = 'apex-poultry-hub',
    sellerId?: string
  ) => {
    setIsLoading(true);
    const authedUser: AuthUser = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: email.split('@')[0].replace('.', ' '),
      role,
      tenantId,
      sellerId,
    };
    saveUser(authedUser);
    setIsLoading(false);
  };

  const logout = () => {
    saveUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const persona = PRESET_PERSONAS[newRole];
    if (persona) {
      saveUser({ ...persona, tenantId: user.tenantId });
    } else {
      saveUser({ ...user, role: newRole });
    }
  };

  const switchTenant = (newTenantId: string) => {
    if (!user) return;
    saveUser({ ...user, tenantId: newTenantId });
  };

  const switchSeller = (newSellerId: string) => {
    if (!user) return;
    saveUser({ ...user, sellerId: newSellerId });
  };

  const switchPersona = (personaKey: keyof typeof PRESET_PERSONAS) => {
    const persona = PRESET_PERSONAS[personaKey];
    if (persona) {
      saveUser({ ...persona });
    }
  };

  const role = user?.role || 'customer';
  const tenantId = user?.tenantId || 'apex-poultry-hub';
  const sellerId = user?.sellerId || 'seller_krishna_01';
  const isPlatformDeveloper = role === 'developer' || role === 'super_admin';
  const isClientAdmin = isPlatformDeveloper || role === 'client_admin';
  const isSeller = isPlatformDeveloper || isClientAdmin || role === 'seller';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        tenantId,
        sellerId,
        isPlatformDeveloper,
        isClientAdmin,
        isSeller,
        isLoading,
        login,
        logout,
        switchRole,
        switchTenant,
        switchSeller,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
