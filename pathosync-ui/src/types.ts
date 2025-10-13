export interface Permissions {
    billing: { canView: boolean; canEdit: boolean; };
    bills: { canView: boolean; canEdit: boolean; };
    patients: { canView: boolean; canEdit: boolean; };
    packages: { canView: boolean; canEdit: boolean; };
    reports: { canView: boolean; canEdit: boolean; };
    tests: { canView: boolean; canEdit: boolean; };
    doctors: { canView: boolean; canEdit: boolean; };
    users: { canView: boolean; canEdit: boolean; };
    statistics: { canView: boolean; canEdit: boolean; };
    subscription: { canView: boolean; canEdit: boolean; };
    collectionCenters: { canView: boolean; canEdit: boolean; };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    is_active: boolean;
    features: string[];
    subscription_plan: string;
    phone: string;
    department: string;
    join_date: string;
    subscription_plan_name: 'starter' | 'basic' | 'professional' | 'enterprise';
    last_login: string;
    profile_picture: string;
    organization_name: string;
    permissions: Permissions;
}

export interface Bill {
    id: string;
    tenant_id: string;
    patient_id: string;
    doctor_id: string;
    bill_number: string;
    bill_date: string;
    total_amount: number;
    discount_amount: number;
    tax_amount: number;
    status: 'paid' | 'unpaid' | 'partially-paid';
    payment_method: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface Test {
    id: string;
    tenant_id: string;
    test_code: string;
    name: string;
    description: string;
    price: number;
    test_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category_id: string;
}

export interface Tenant {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    license_number: string;
}

export interface Patient {
    id: string;
    tenant_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    date_of_birth: string;
    gender: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    created_at: string;
    updated_at: string;
}

export interface Doctor {
    id: string;
    tenant_id: string;
    first_name: string;
    last_name: string;
    specialization: string;
    email: string;
    phone: string;
    license_number: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReferenceRange {
    id: string;
    test_id: string;
    name: string;
    min_value: string;
    max_value: string;
    unit: string;
}

export interface LabReport {
    id: string;
    tenant_id: string;
    bill_id: string;
    report_number: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface TestCategory {
    id: string;
    name: string;
    description: string;
}

export interface CollectionCenter {
    id: string;
    tenant_id: string;
    center_code: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    is_active: boolean;
    commission_percentage: number;
    created_at: string;
    updated_at: string;
}
