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
    paymentStatus: string;
    reportStatus: string;
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
