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
    createdAt: string;
    isActive: boolean;
    features: string[];
    subscription_plan: string;
    phone: string;
    department: string;
    joinDate: string;
    subscriptionPlan: 'starter' | 'basic' | 'professional' | 'enterprise';
    lastLogin: string;
    profilePicture: string;
    organizationName: string;
    permissions: Permissions;
}

export interface Bill {
    id: string;
    patient: Patient;
    doctor: Doctor;
    tests: Test[];
    total: number;
    finalAmount: number;
    discount: number;
    status: 'paid' | 'unpaid' | 'partially-paid';
    reportStatus: 'pending' | 'generated' | 'delivered';
    createdAt: string;
    paymentMethod: string;
    notes: string;
    subtotal: number;
    tax: number;
    sampleDate: string;
    testResults: any[];
    clinicalRemarks: string;
    sampleTime: string;
    updatedAt: string;
}

export interface Test {
    id: string;
    testName: string;
    tag: string;
    price: number;
    notes: string;
    referenceRanges: any[];
    unit: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    shortCode: string;
    testType: string;
    subTests: any[];
    method: string;
    formula: string;
    defaultLabResult: string;
    description: string;
    category: string;
}

export interface Lab {
    name: string;
    address: string;
    phone: string;
    email: string;
    licenseNumber: string;
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    emergencyContact: string;
    createdAt: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    email: string;
    phone: string;
    licenseNumber: string;
    isActive: boolean;
}

export interface ReferenceRange {}

export interface LabReport {
    id: string;
    reportNo: string;
    patientName: string;
    patientAge: string;
    patientGender: string;
    doctorName: string;
    status: string;
    tests: any[];
    createdAt: string;
    report_no: string;
    test_results: any;
    impression: string;
    descriptive_content: string;
}
