import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { User } from '../types/index';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedTenantId = localStorage.getItem('tenantId');
      if (storedToken && storedTenantId) {
        apiClient.setToken(storedToken);
        try {
          const res = await apiClient.get('/auth/me');
          if (res.success) {
            setUser(res.data as User);
            setTenantId(storedTenantId);
            setToken(storedToken);
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (newToken: string, newTenantId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('tenantId', newTenantId);
    apiClient.setToken(newToken);
    setToken(newToken);
    setTenantId(newTenantId);
    // You might want to fetch user data here again
    const fetchUser = async () => {
        const res = await apiClient.get('/auth/me');
        if(res.success) {
            setUser(res.data as User);
        }
    };
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    setUser(null);
    setTenantId(null);
    setToken(null);
    apiClient.setToken(null);
  };

  return {
    user,
    token,
    tenantId,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };
};
