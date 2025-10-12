import { ROLES_PERMISSIONS, Role } from '../types/permissions';

interface UsePermissionsProps {
  userRole: Role;
  userId: string;
}

export const usePermissions = ({ userRole, userId }: UsePermissionsProps) => {
  const permissions = ROLES_PERMISSIONS[userRole];

  return {
    permissions,
    // Future enhancements could include checks for specific resource ownership (e.g., isOwner)
  };
};