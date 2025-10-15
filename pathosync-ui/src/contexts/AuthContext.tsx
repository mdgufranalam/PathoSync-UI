import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../hooks/useTenant';
import { User, Tenant, Role } from '../types/index';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  tenant: Tenant | null;
  tenantId: string | null;
  loading: boolean;
  login: (token: string, tenantId: string) => void;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { user, token, tenantId, isAuthenticated, loading, login, logout } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant(tenantId);

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    // This is a simplified permission check. In a real application, you would
    // likely have a more complex system for managing roles and permissions.
    if (user.role === 'admin') return true;
    return false;
  };

  const value = {
    isAuthenticated,
    user,
    tenant,
    tenantId,
    loading: loading || tenantLoading,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
