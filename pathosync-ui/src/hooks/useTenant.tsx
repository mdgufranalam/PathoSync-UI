import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { Tenant } from '../types';

export const useTenant = (tenantId: string | null) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get<Tenant>(`/tenants/${tenantId}`);
        if (response.success && response.data) {
          setTenant(response.data);
        } else {
          setError(response.error || 'Failed to fetch tenant data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  return { tenant, loading, error };
};
