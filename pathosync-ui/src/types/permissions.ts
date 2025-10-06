// Role-based Permission System
// Based on Feature & Role Permission Matrix

export type Role = 'Admin' | 'Manager' | 'Technician' | 'Collection Agent' | 'Data Entry' | 'Viewer';

export interface Permission {
  module: string;
  action: string;
  allowed: boolean;
  description?: string;
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}

// Define all possible actions for each module
export const MODULES = {
  DASHBOARD: 'Dashboard',
  BILLING: 'Billing/Enhanced Billing',
  BILLS_MANAGEMENT: 'Bills Management',
  PATIENTS_MANAGEMENT: 'Patients Management',
  TEST_PACKAGES: 'Test Packages',
  REPORTS_PAGE: 'Reports Page',
  DOCTORS_MANAGEMENT: 'Doctors Management',
  USERS_MANAGEMENT: 'Users Management',
  PROFILE: 'Profile',
  STATISTICS: 'Statistics/Analytics',
  SUBSCRIPTION_MANAGEMENT: 'Subscription Management',
  NOTIFICATIONS: 'Notifications',
  COLLECTION_CENTERS: 'Collection Centers',
  UPGRADE_PLAN: 'Upgrade Plan'
} as const;

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  FULL_ACCESS: 'full_access',
  LIMITED_ACCESS: 'limited_access',
  VIEW_OWN: 'view_own',
  VIEW_ASSIGNED: 'view_assigned',
  VIEW_CENTER: 'view_center',
  ENTER_READINGS: 'enter_readings',
  GENERATE_BILLS: 'generate_bills',
  UPLOAD_RESULTS: 'upload_results',
  SUMMARY_ONLY: 'summary_only',
  TEAM_STATS: 'team_stats',
  ALL_CENTERS: 'all_centers',
  OWN_CENTER: 'own_center'
} as const;

// Permission configurations for each role
export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  'Admin': {
    role: 'Admin',
    description: 'Full system administrator with complete access to all features and modules',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.FULL_ACCESS, allowed: true, description: 'Full dashboard access' },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.FULL_ACCESS, allowed: true, description: 'Complete billing management' },
      { module: MODULES.BILLING, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.DELETE, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.APPROVE, allowed: true },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.DELETE, allowed: true },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true, description: 'Complete patient management' },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.DELETE, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.FULL_ACCESS, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.DELETE, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW, allowed: true },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.DELETE, allowed: true },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true },
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.DELETE, allowed: true },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.DELETE, allowed: true },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self + Others' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.ALL_CENTERS, allowed: true, description: 'All centers analytics' },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true, description: 'Upgrade/downgrade subscriptions' },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'All notifications' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.DELETE, allowed: true },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.FULL_ACCESS, allowed: true }
    ]
  },

  'Manager': {
    role: 'Manager',
    description: 'Department manager with team oversight and limited administrative capabilities',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.LIMITED_ACCESS, allowed: true, description: 'Limited team stats' },
      { module: MODULES.DASHBOARD, action: ACTIONS.TEAM_STATS, allowed: true },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.APPROVE, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.CREATE, allowed: false },
      { module: MODULES.BILLING, action: ACTIONS.DELETE, allowed: false },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.DELETE, allowed: false },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.DELETE, allowed: true },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.CREATE, allowed: false },
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.DELETE, allowed: false },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.DELETE, allowed: false },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.FULL_ACCESS, allowed: true },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true, description: 'Create/Edit for center' },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.DELETE, allowed: false },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self + Team' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.OWN_CENTER, allowed: true, description: 'Own center only' },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'Team notifications' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.VIEW, allowed: true, description: 'View/Edit own center' },
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.CREATE, allowed: false },
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.DELETE, allowed: false },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.VIEW, allowed: false }
    ]
  },

  'Technician': {
    role: 'Technician',
    description: 'Laboratory technician with sample processing and result entry capabilities',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.VIEW_CENTER, allowed: true, description: 'View own center' },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.VIEW, allowed: false },
      { module: MODULES.BILLING, action: ACTIONS.CREATE, allowed: false },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true, description: 'View/edit samples' },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.CREATE, allowed: false },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.DELETE, allowed: false },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW_ASSIGNED, allowed: true, description: 'View assigned packages' },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.ENTER_READINGS, allowed: true, description: 'Enter test readings' },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW, allowed: true },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self only' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.VIEW, allowed: false },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'Center notifications' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.VIEW, allowed: false },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.VIEW, allowed: false }
    ]
  },

  'Collection Agent': {
    role: 'Collection Agent',
    description: 'Field agent responsible for sample collection and basic billing',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.VIEW_ASSIGNED, allowed: true, description: 'View assigned collections' },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.GENERATE_BILLS, allowed: true, description: 'Generate bills for collected samples' },
      { module: MODULES.BILLING, action: ACTIONS.CREATE, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.EDIT, allowed: false },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW_OWN, allowed: true, description: 'View own bills' },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true, description: 'Add new for center' },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.EDIT, allowed: false },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW, allowed: false },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW_CENTER, allowed: true, description: 'View own center reports' },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self only' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.VIEW, allowed: false },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'Center notifications' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.VIEW, allowed: false },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.VIEW, allowed: false }
    ]
  },

  'Data Entry': {
    role: 'Data Entry',
    description: 'Data entry operator for patient information and test results',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.VIEW_ASSIGNED, allowed: true, description: 'View assigned tasks' },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.CREATE, allowed: true, description: 'Create/Submit bills' },
      { module: MODULES.BILLING, action: ACTIONS.VIEW, allowed: true },
      { module: MODULES.BILLING, action: ACTIONS.EDIT, allowed: false },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW_OWN, allowed: true, description: 'View own entries' },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.CREATE, allowed: true, description: 'Add/Edit patient data' },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.EDIT, allowed: true },
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW, allowed: false },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.UPLOAD_RESULTS, allowed: true, description: 'Upload test results' },
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW, allowed: true },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self only' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.VIEW, allowed: false },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'Center notifications' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.VIEW, allowed: false },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.VIEW, allowed: false }
    ]
  },

  'Viewer': {
    role: 'Viewer',
    description: 'Read-only access for viewing reports and basic information',
    permissions: [
      // Dashboard
      { module: MODULES.DASHBOARD, action: ACTIONS.SUMMARY_ONLY, allowed: true, description: 'Summary view only' },
      
      // Billing
      { module: MODULES.BILLING, action: ACTIONS.VIEW, allowed: false },
      
      // Bills Management
      { module: MODULES.BILLS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Patients Management
      { module: MODULES.PATIENTS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true, description: 'View only' },
      
      // Test Packages
      { module: MODULES.TEST_PACKAGES, action: ACTIONS.VIEW, allowed: true, description: 'View only' },
      
      // Reports
      { module: MODULES.REPORTS_PAGE, action: ACTIONS.VIEW, allowed: true, description: 'View only' },
      
      // Doctors Management
      { module: MODULES.DOCTORS_MANAGEMENT, action: ACTIONS.VIEW, allowed: true, description: 'View only' },
      
      // Users Management
      { module: MODULES.USERS_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Profile
      { module: MODULES.PROFILE, action: ACTIONS.EDIT, allowed: true, description: 'Self only' },
      
      // Statistics
      { module: MODULES.STATISTICS, action: ACTIONS.VIEW, allowed: false },
      
      // Subscription Management
      { module: MODULES.SUBSCRIPTION_MANAGEMENT, action: ACTIONS.VIEW, allowed: false },
      
      // Notifications
      { module: MODULES.NOTIFICATIONS, action: ACTIONS.VIEW, allowed: true, description: 'View only' },
      
      // Collection Centers
      { module: MODULES.COLLECTION_CENTERS, action: ACTIONS.VIEW, allowed: false },
      
      // Upgrade Plan
      { module: MODULES.UPGRADE_PLAN, action: ACTIONS.VIEW, allowed: false }
    ]
  }
};

// Helper functions for permission checking
export class PermissionService {
  static hasPermission(userRole: Role, module: string, action: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return false;

    // Check for specific action permission
    const hasSpecificPermission = rolePermissions.permissions.some(
      permission => permission.module === module && 
                   permission.action === action && 
                   permission.allowed
    );

    // Check for FULL_ACCESS permission which grants all actions
    const hasFullAccess = rolePermissions.permissions.some(
      permission => permission.module === module && 
                   permission.action === ACTIONS.FULL_ACCESS && 
                   permission.allowed
    );

    return hasSpecificPermission || hasFullAccess;
  }

  static getModulePermissions(userRole: Role, module: string): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return [];

    return rolePermissions.permissions.filter(
      permission => permission.module === module
    );
  }

  static getAllPermissions(userRole: Role): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions ? rolePermissions.permissions : [];
  }

  static getRoleDescription(userRole: Role): string {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions ? rolePermissions.description : '';
  }

  static canAccessModule(userRole: Role, module: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return false;

    return rolePermissions.permissions.some(
      permission => permission.module === module && permission.allowed
    );
  }

  static getAccessibleModules(userRole: Role): string[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return [];

    const accessibleModules = new Set<string>();
    rolePermissions.permissions.forEach(permission => {
      if (permission.allowed) {
        accessibleModules.add(permission.module);
      }
    });

    return Array.from(accessibleModules);
  }

  static canCreateUser(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.CREATE);
  }

  static canEditUser(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.EDIT);
  }

  static canDeleteUser(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.USERS_MANAGEMENT, ACTIONS.DELETE);
  }

  static canManageCollectionCenters(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.CREATE) ||
           this.hasPermission(userRole, MODULES.COLLECTION_CENTERS, ACTIONS.EDIT);
  }

  static canViewStatistics(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.STATISTICS, ACTIONS.ALL_CENTERS) ||
           this.hasPermission(userRole, MODULES.STATISTICS, ACTIONS.OWN_CENTER);
  }

  static canManageSubscription(userRole: Role): boolean {
    return this.hasPermission(userRole, MODULES.SUBSCRIPTION_MANAGEMENT, ACTIONS.FULL_ACCESS);
  }

  static isViewOnlyRole(userRole: Role): boolean {
    return userRole === 'Viewer';
  }

  static getPermissionLevel(userRole: Role, module: string): 'none' | 'view' | 'edit' | 'full' {
    const permissions = this.getModulePermissions(userRole, module);
    
    if (permissions.length === 0 || !permissions.some(p => p.allowed)) {
      return 'none';
    }

    const hasCreate = permissions.some(p => p.action === ACTIONS.CREATE && p.allowed);
    const hasEdit = permissions.some(p => p.action === ACTIONS.EDIT && p.allowed);
    const hasDelete = permissions.some(p => p.action === ACTIONS.DELETE && p.allowed);
    const hasFullAccess = permissions.some(p => p.action === ACTIONS.FULL_ACCESS && p.allowed);

    if (hasFullAccess || (hasCreate && hasEdit && hasDelete)) {
      return 'full';
    } else if (hasEdit || hasCreate) {
      return 'edit';
    } else {
      return 'view';
    }
  }
}

export default PermissionService;