import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Tenant } from '../types';

export const useTenant = (tenantId: string) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await apiClient.get(`/tenants/${tenantId}`);
        setTenant(response.data);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId]);

  return { tenant, loading };
};
