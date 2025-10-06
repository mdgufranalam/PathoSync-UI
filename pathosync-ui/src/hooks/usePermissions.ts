import { useMemo } from 'react';
import { Role, MODULES, ACTIONS, PermissionService } from '../types/permissions';

export interface UsePermissionsProps {
  userRole: Role;
  userId?: string;
  collectionCenterId?: string;
}

export function usePermissions({ userRole, userId, collectionCenterId }: UsePermissionsProps) {
  
  const permissions = useMemo(() => ({
    // Dashboard permissions
    dashboard: {
      canViewFull: PermissionService.hasPermission(userRole, MODULES.DASHBOARD, ACTIONS.FULL_ACCESS),
      canViewTeamStats: PermissionService.hasPermission(userRole, MODULES.DASHBOARD, ACTIONS.TEAM_STATS),
      canViewOwnCenter: PermissionService.hasPermission(userRole, MODULES.DASHBOARD, ACTIONS.VIEW_CENTER),
      canViewAssigned: PermissionService.hasPermission(userRole, MODULES.DASHBOARD, ACTIONS.VIEW_ASSIGNED),
      summaryOnly: PermissionService.hasPermission(userRole, MODULES.DASHBOARD, ACTIONS.SUMMARY_ONLY),
    },

    // Billing permissions
    billing: {
      canCreateBill: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.CREATE),
      canEditBill: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.EDIT),
      canDeleteBill: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.DELETE),
      canApproveBill: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.APPROVE),
      canGenerateBills: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.GENERATE_BILLS),
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.BILLING, ACTIONS.FULL_ACCESS),
    },

    // Bills Management permissions
    billsManagement: {
      canView: PermissionService.hasPermission(userRole, MODULES.BILLS_MANAGEMENT, ACTIONS.VIEW),
      canEdit: PermissionService.hasPermission(userRole, MODULES.BILLS_MANAGEMENT, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.BILLS_MANAGEMENT, ACTIONS.DELETE),
      canViewOwn: PermissionService.hasPermission(userRole, MODULES.BILLS_MANAGEMENT, ACTIONS.VIEW_OWN),
    },

    // Patients Management permissions
    patients: {
      canCreate: PermissionService.hasPermission(userRole, MODULES.PATIENTS_MANAGEMENT, ACTIONS.CREATE),
      canEdit: PermissionService.hasPermission(userRole, MODULES.PATIENTS_MANAGEMENT, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.PATIENTS_MANAGEMENT, ACTIONS.DELETE),
      canView: PermissionService.hasPermission(userRole, MODULES.PATIENTS_MANAGEMENT, ACTIONS.VIEW),
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.PATIENTS_MANAGEMENT, ACTIONS.FULL_ACCESS),
    },

    // Test Packages permissions
    testPackages: {
      canCreate: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.CREATE),
      canEdit: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.DELETE),
      canView: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.VIEW),
      canViewAssigned: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.VIEW_ASSIGNED),
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.TEST_PACKAGES, ACTIONS.FULL_ACCESS),
    },

    // Reports permissions
    reports: {
      canView: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.VIEW),
      canEdit: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.DELETE),
      canEnterReadings: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.ENTER_READINGS),
      canUploadResults: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.UPLOAD_RESULTS),
      canViewCenter: PermissionService.hasPermission(userRole, MODULES.REPORTS_PAGE, ACTIONS.VIEW_CENTER),
    },

    // Doctors Management permissions
    doctors: {
      canCreate: PermissionService.hasPermission(userRole, MODULES.DOCTORS_MANAGEMENT, ACTIONS.CREATE),
      canEdit: PermissionService.hasPermission(userRole, MODULES.DOCTORS_MANAGEMENT, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.DOCTORS_MANAGEMENT, ACTIONS.DELETE),
      canView: PermissionService.hasPermission(userRole, MODULES.DOCTORS_MANAGEMENT, ACTIONS.VIEW),
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.DOCTORS_MANAGEMENT, ACTIONS.FULL_ACCESS),
    },

    // Users Management permissions
    users: {
      canCreate: PermissionService.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.CREATE),
      canEdit: PermissionService.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.DELETE),
      canView: PermissionService.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.VIEW),
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.FULL_ACCESS),
    },

    // Profile permissions
    profile: {
      canEdit: PermissionService.hasPermission(userRole, MODULES.PROFILE, ACTIONS.EDIT),
    },

    // Statistics permissions
    statistics: {
      canViewAll: PermissionService.hasPermission(userRole, MODULES.STATISTICS, ACTIONS.ALL_CENTERS),
      canViewOwnCenter: PermissionService.hasPermission(userRole, MODULES.STATISTICS, ACTIONS.OWN_CENTER),
    },

    // Subscription Management permissions
    subscription: {
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.SUBSCRIPTION_MANAGEMENT, ACTIONS.FULL_ACCESS),
    },

    // Notifications permissions
    notifications: {
      canView: PermissionService.hasPermission(userRole, MODULES.NOTIFICATIONS, ACTIONS.VIEW),
    },

    // Collection Centers permissions
    collectionCenters: {
      canCreate: PermissionService.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.CREATE),
      canEdit: PermissionService.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.EDIT),
      canDelete: PermissionService.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.DELETE),
      canView: PermissionService.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.VIEW),
    },

    // Upgrade Plan permissions
    upgradePlan: {
      hasFullAccess: PermissionService.hasPermission(userRole, MODULES.UPGRADE_PLAN, ACTIONS.FULL_ACCESS),
    },
  }), [userRole]);

  // Helper functions
  const canAccessModule = useMemo(() => (module: string) => {
    return PermissionService.canAccessModule(userRole, module);
  }, [userRole]);

  const getPermissionLevel = useMemo(() => (module: string) => {
    return PermissionService.getPermissionLevel(userRole, module);
  }, [userRole]);

  const isViewOnly = useMemo(() => {
    return PermissionService.isViewOnlyRole(userRole);
  }, [userRole]);

  const accessibleModules = useMemo(() => {
    return PermissionService.getAccessibleModules(userRole);
  }, [userRole]);

  const roleDescription = useMemo(() => {
    return PermissionService.getRoleDescription(userRole);
  }, [userRole]);

  // Check if user can perform action on their own data vs others
  const canEditOwnData = useMemo(() => (module: string, targetUserId?: string) => {
    if (!targetUserId || !userId) return false;
    
    // Users can typically edit their own data
    if (targetUserId === userId) return true;
    
    // Check role-based permissions for editing others
    return PermissionService.hasPermission(userRole, module, ACTIONS.EDIT);
  }, [userRole, userId]);

  const canViewOwnData = useMemo(() => (module: string, targetUserId?: string) => {
    if (!targetUserId || !userId) return false;
    
    // Users can typically view their own data
    if (targetUserId === userId) return true;
    
    // Check role-based permissions for viewing others
    return PermissionService.hasPermission(userRole, module, ACTIONS.VIEW);
  }, [userRole, userId]);

  // Collection center specific permissions
  const canAccessCollectionCenter = useMemo(() => (centerId?: string) => {
    if (!centerId) return false;
    
    // Admin can access all centers
    if (userRole === 'Admin') return true;
    
    // Managers can access their own center
    if (userRole === 'Manager' && centerId === collectionCenterId) return true;
    
    // Other roles have restricted access
    return false;
  }, [userRole, collectionCenterId]);

  return {
    permissions,
    canAccessModule,
    getPermissionLevel,
    isViewOnly,
    accessibleModules,
    roleDescription,
    canEditOwnData,
    canViewOwnData,
    canAccessCollectionCenter,
    userRole,
  };
}

export default usePermissions;