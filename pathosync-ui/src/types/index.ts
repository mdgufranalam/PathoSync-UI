export type Page = 'dashboard' | 'patients' | 'tests' | 'reports' | 'billing' | 'users' | 'settings' | 'getting-started' | 'subscription';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    isActive: boolean;
    phone: string;
    address: string;
    department: string;
    joinDate: string;
    permissions: string[];
    subscriptionPlan: SubscriptionPlan;
    features: Feature[];
    lastLogin: string;
    profilePicture?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Test {
    id: string;
    testName: string;
    testType: 'Numeric' | 'Descriptive' | 'Group';
    shortCode: string;
    price: number;
    category: string;
    unit: string;
    tag: string;
    method: string;
    formula: string;
    notes: string;
    description: string;
    defaultLabResult: string;
    referenceRanges: any[];
    subTests: any[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TestPackage {
    id: string;
    name: string;
    description: string;
    price: number;
    tests: Test[];
    createdAt: string;
    updatedAt: string;
}

export interface CollectionCenter {
    id: string;
    name: string;
    address: string;
    phone: string;
    email?: string;
    contactPerson: string;
    createdAt: string;
    updatedAt: string;
}

export type Role = 'admin' | 'manager' | 'technician' | 'collection-agent' | 'data-entry' | 'viewer';

export interface Permission {
    module: string;
    action: string;
}

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export interface Feature {
    id: string;
    name: string;
    description: string;
}

export interface Payment {
    id: string;
    billId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface TestResult {
    testName: string;
    result: string;
    referenceRange: string;
    unit: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
}

export interface LabReport {
    id: string;
    reportNo: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    doctorName: string;
    date: string;
    testResults: TestResult[];
    status: 'Initial' | 'In Progress' | 'Completed' | 'Verified and Signed' | 'Printed' | 'Delivered';
    reportType: 'Normal' | 'Descriptive' | 'Group';
    technician: string;
    verifiedBy: string;
    remarks?: string;
    clinicalHistory?: string;
    specimenType: string;
    collectionTime: string;
    receivedTime: string;
    reportTime: string;
    createdBy: string;
    lastUpdated: string;
}

export interface Bill {
    id: string;
    patient?: any;
    doctor?: any;
    patientName: string;
    doctorName: string;
    date: string;
    totalAmount: number;
    paymentStatus: 'paid' | 'unpaid' | 'partially-paid';
    reportStatus: 'pending' | 'generated' | 'delivered';
    sampleDate?: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    doctorId: string;
    testResults?: any[];
    tests?: any[];
    clinicalRemarks?: string;
    notes?: string;
    sampleTime?: string;
}
