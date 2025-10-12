import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import type { Role } from '../types/permissions';
import type { Permissions } from '../types';

const initialPermissions: Permissions = {
    billing: { canView: false, canEdit: false },
    bills: { canView: false, canEdit: false },
    patients: { canView: false, canEdit: false },
    packages: { canView: false, canEdit: false },
    reports: { canView: false, canEdit: false },
    tests: { canView: false, canEdit: false },
    doctors: { canView: false, canEdit: false },
    users: { canView: false, canEdit: false },
    statistics: { canView: false, canEdit: false },
    subscription: { canView: false, canEdit: false },
    collectionCenters: { canView: false, canEdit: false },
};

export const usePermissions = ({ userRole, userId }: { userRole: Role, userId: string }) => {
    const [permissions, setPermissions] = useState<Permissions>(initialPermissions);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (userRole && userId) {
                try {
                    setLoading(true);
                    const response = await apiClient.get(`/users/${userId}/permissions`);
                    setPermissions(response.data);
                } catch (err) {
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPermissions();
    }, [userRole, userId]);

    return { permissions, loading, error };
};