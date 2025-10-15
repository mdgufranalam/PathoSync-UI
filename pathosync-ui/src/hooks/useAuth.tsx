import { useState, useContext, createContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types/index';
import { apiClient } from '../utils/apiClient';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success && response.data) {
      setCurrentUser(response.data);
      localStorage.setItem('tenantId', response.data.tenant_id);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tenantId');
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<{ token: string }>('/auth/login', { email, password });
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      await fetchCurrentUser();
    } else {
        throw new Error(response.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    setCurrentUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    const permissions: { [key: string]: string[] } = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_doctors', 'manage_tests', 'manage_billing'],
      technician: ['read', 'write', 'manage_tests', 'manage_billing'],
      viewer: ['read']
    };

    const userRole = currentUser.role || 'viewer';
    const hasRolePermission = permissions[userRole]?.includes(permission) || false;

    if (permission.startsWith('statistics_')) {
      return currentUser.features?.includes(permission) && (userRole === 'admin' || userRole === 'manager' || userRole === 'superadmin');
    }

    if (permission === 'export') {
      return currentUser.subscription_plan === 'professional' || currentUser.subscription_plan === 'enterprise';
    }

    return hasRolePermission;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
