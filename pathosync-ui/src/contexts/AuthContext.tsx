import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../utils/apiClient';

interface AuthContextType {
  user: any;
  permissions: any[];
  hasPermission: (module: string, action: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await apiClient.get('/auth/me');
        setUser(userResponse.data);

        if (userResponse.data && userResponse.data.role_id) {
          const permissionsResponse = await apiClient.get(`/roles/${userResponse.data.role_id}/permissions`);
          setPermissions(permissionsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  const hasPermission = (module: string, action: string) => {
    // Admins have all permissions
    if (user?.role?.name === 'Admin') {
      return true;
    }

    // Check role-based permissions
    const rolePermission = permissions.find(p => p.module === module && p.action === action);
    if (rolePermission) {
      return true;
    }

    // Check for user-specific overrides (not implemented in this example)

    return false;
  };

  const value = {
    user,
    permissions,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
