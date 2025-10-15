import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import type { Role } from '../types/index';

export interface Permissions {
    [module: string]: {
        [action: string]: boolean;
    };
}

export const usePermissions = (role: Role | null | undefined, userId: string | null | undefined) => {
    const [permissions, setPermissions] = useState<Permissions>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!role || !userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await apiClient.get<Permissions>('/permissions', { role, userId });
                if (response.success && response.data) {
                    setPermissions(response.data);
                } else {
                    setError(response.error || 'Failed to fetch permissions');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [role, userId]);

    return { permissions, loading, error };
};
