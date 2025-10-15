import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../hooks/useTenant';
import { usePermissions } from '../hooks/usePermissions';
import { User, Tenant, Role } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  tenant: Tenant | null;
  tenantId: string | null;
  permissions: any; // Consider creating a specific type for permissions
  loading: boolean;
  login: (token: string, tenantId: string) => void;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { user, token, tenantId, isAuthenticated, loading, login, logout } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant(tenantId);
  const { permissions, loading: permissionsLoading } = usePermissions(user?.role, user?.id);

  const hasPermission = (module: string, action: string): boolean => {
    if (!permissions || !user) return false;
    if (user.role === 'admin') return true; // Admins have all permissions
    return permissions[module]?.[action] ?? false;
  };

  const value = {
    isAuthenticated,
    user,
    tenant,
    tenantId,
    permissions,
    loading: loading || tenantLoading || permissionsLoading,
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
