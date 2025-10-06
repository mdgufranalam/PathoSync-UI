// Core data types for the healthcare management system

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer' | 'technician';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  licenseNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceRange {
  id: string;
  name: string;
  minValue: string;
  maxValue: string;
  unit: string;
}

export interface Test {
  id: string;
  testType: 'Normal Test' | 'Descriptive Test' | 'Test Group';
  testName: string;
  shortCode: string;
  price: number;
  unit?: string;
  tag: string;
  method?: string;
  formula?: string;
  notes?: string;
  defaultLabResult?: string;
  referenceRanges?: ReferenceRange[];
  subTests?: Test[]; // For Test Groups - contains Normal or Descriptive tests
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  emergencyContact: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  // Enhanced billing format
  patientId?: string;
  patient?: Patient;
  doctorId?: string;
  doctor?: Doctor;
  tests?: {
    testId: string;
    test: Test;
    quantity: number;
    price: number;
  }[];
  subtotal?: number;
  tax?: number;
  total?: number;
  
  // Simple billing format (alternative fields)
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  patientAddress?: string;
  doctorName?: string;
  billTotal?: number;
  finalAmount?: number;
  amountReceived?: number;
  amountDue?: number;
  
  // Common fields
  discount?: number;
  status: 'pending' | 'paid' | 'cancelled' | 'Paid' | 'Partial' | 'Cancelled';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'upi';
  notes?: string;
  sampleDate?: string;
  sampleTime?: string;
  reportStatus?: 'Initial' | 'In Progress' | 'Completed' | 'Verified and Signed' | 'Printed' | 'Delivered';
  testResults?: {
    testId: string;
    result: string;
    isAbnormal?: boolean;
  }[];
  clinicalRemarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Lab {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  logo?: string;
}