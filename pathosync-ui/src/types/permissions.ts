import { Role } from '.';

export const ROLES = ['admin', 'manager', 'technician', 'collection-agent', 'data-entry', 'viewer'] as const;

export const MODULES = [
    'Dashboard',
    'Billing',
    'Bills',
    'Patients',
    'Test Packages',
    'Reports',
    'Tests',
    'Doctors',
    'Users',
    'Statistics',
    'Subscription',
    'Collection Centers',
    'Settings',
] as const;

export const ACTIONS = ['create', 'view', 'edit', 'delete', 'approve', 'deliver'] as const;

export type Module = typeof MODULES[number];
export type Action = typeof ACTIONS[number];

export const PERMISSIONS: { [key in Module]?: Action[] } = {
    Dashboard: ['view'],
    Billing: ['create', 'view'],
    Bills: ['create', 'view', 'edit', 'delete', 'approve'],
    Patients: ['create', 'view', 'edit', 'delete'],
    'Test Packages': ['create', 'view', 'edit', 'delete'],
    Reports: ['create', 'view', 'edit', 'delete', 'approve', 'deliver'],
    Tests: ['create', 'view', 'edit', 'delete'],
    Doctors: ['create', 'view', 'edit', 'delete'],
    Users: ['create', 'view', 'edit', 'delete'],
    Statistics: ['view'],
    Subscription: ['view', 'edit'],
    'Collection Centers': ['create', 'view', 'edit', 'delete'],
    Settings: ['view', 'edit'],
};

export const ROLES_PERMISSIONS: { [key in Role]: { [key in Module]?: Action[] } } = {
    admin: {
        Dashboard: ['view'],
        Billing: ['create', 'view'],
        Bills: ['create', 'view', 'edit', 'delete', 'approve'],
        Patients: ['create', 'view', 'edit', 'delete'],
        'Test Packages': ['create', 'view', 'edit', 'delete'],
        Reports: ['create', 'view', 'edit', 'delete', 'approve', 'deliver'],
        Tests: ['create', 'view', 'edit', 'delete'],
        Doctors: ['create', 'view', 'edit', 'delete'],
        Users: ['create', 'view', 'edit', 'delete'],
        Statistics: ['view'],
        Subscription: ['view', 'edit'],
        'Collection Centers': ['create', 'view', 'edit', 'delete'],
        Settings: ['view', 'edit'],
    },
    manager: {
        Dashboard: ['view'],
        Billing: ['create', 'view'],
        Bills: ['create', 'view', 'edit', 'delete', 'approve'],
        Patients: ['create', 'view', 'edit', 'delete'],
        Reports: ['create', 'view', 'edit', 'delete', 'approve', 'deliver'],
        Tests: ['create', 'view', 'edit', 'delete'],
        Doctors: ['create', 'view', 'edit', 'delete'],
        Users: ['create', 'view', 'edit', 'delete'],
        Statistics: ['view'],
        'Collection Centers': ['create', 'view', 'edit', 'delete'],
        Settings: ['view', 'edit'],
    },
    technician: {
        Dashboard: ['view'],
        Reports: ['create', 'view', 'edit', 'approve'],
        Tests: ['view'],
    },
    'collection-agent': {
        Dashboard: ['view'],
        Bills: ['view'],
        Patients: ['view'],
        'Collection Centers': ['view'],
    },
    'data-entry': {
        Billing: ['create', 'view'],
        Bills: ['create', 'view', 'edit'],
        Patients: ['create', 'view', 'edit'],
    },
    viewer: {
        Dashboard: ['view'],
        Bills: ['view'],
        Patients: ['view'],
        Reports: ['view'],
        Tests: ['view'],
        Doctors: ['view'],
    },
};

export interface Permissions {
    billing: { canView: boolean, canEdit: boolean };
    bills: { canView: boolean, canEdit: boolean };
    patients: { canView: boolean, canEdit: boolean };
    packages: { canView: boolean, canEdit: boolean };
    reports: { canView: boolean, canEdit: boolean };
    tests: { canView: boolean, canEdit: boolean };
    doctors: { canView: boolean, canEdit: boolean };
    users: { canView: boolean, canEdit: boolean };
    statistics: { canView: boolean, canEdit: boolean };
    subscription: { canView: boolean, canEdit: boolean };
    collectionCenters: { canView: boolean, canEdit: boolean };
}