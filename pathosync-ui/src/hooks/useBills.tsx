import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill } from '../types';

interface BillsContextType {
    bills: Bill[];
    addBill: (bill: Bill) => void;
    updateBill: (id: string, updates: Partial<Bill>) => void;
    getBillById: (id: string) => Bill | undefined;
    deleteBill: (id: string) => void;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

// Sample data for demonstration
const generateSampleBills = (): Bill[] => [
    {
        id: 'BILL-001',
        patientId: 'PAT-001',
        patient: {
            id: 'PAT-001',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+91-9876543210',
            address: '123 Main Street, City',
            dateOfBirth: '1990-05-15',
            gender: 'male',
            emergencyContact: '+91-9876543211',
            createdAt: '2024-10-01T10:00:00Z'
        },
        doctorId: 'DOC-001',
        doctor: {
            id: 'DOC-001',
            name: 'Dr. Sarah Johnson',
            specialization: 'Internal Medicine',
            email: 'sarah.johnson@clinic.com',
            phone: '+91-9876543212',
            licenseNumber: 'MED-12345',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        },
        tests: [
            {
                testId: 'TEST-001',
                test: {
                    id: 'TEST-001',
                    testType: 'Normal Test',
                    testName: 'Complete Blood Count',
                    shortCode: 'CBC',
                    price: 300,
                    unit: 'Various',
                    tag: 'Hematology',
                    notes: 'Comprehensive blood analysis',
                    defaultLabResult: 'See individual parameters',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                quantity: 1,
                price: 300
            },
            {
                testId: 'TEST-002',
                test: {
                    id: 'TEST-002',
                    testType: 'Normal Test',
                    testName: 'Blood Glucose (Fasting)',
                    shortCode: 'GLUF',
                    price: 80,
                    unit: 'mg/dl',
                    tag: 'Biochemistry',
                    notes: 'Fasting blood sugar test',
                    defaultLabResult: '70-110 mg/dl',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                quantity: 1,
                price: 80
            }
        ],
        subtotal: 380,
        tax: 19,
        discount: 0,
        total: 399,
        status: 'paid',
        paymentMethod: 'card',
        sampleDate: '2024-10-03',
        sampleTime: '09:00',
        reportStatus: 'In Progress',
        testResults: [
            {
                testId: 'TEST-001',
                result: '',
                isAbnormal: false
            },
            {
                testId: 'TEST-002',
                result: '',
                isAbnormal: false
            }
        ],
        notes: 'Routine health checkup',
        createdAt: '2024-10-01T10:00:00Z',
        updatedAt: '2024-10-01T10:00:00Z'
    },
    {
        id: 'BILL-002',
        patientId: 'PAT-002',
        patient: {
            id: 'PAT-002',
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '+91-9876543213',
            address: '456 Oak Avenue, City',
            dateOfBirth: '1985-08-20',
            gender: 'female',
            emergencyContact: '+91-9876543214',
            createdAt: '2024-10-01T11:00:00Z'
        },
        doctorId: 'DOC-002',
        doctor: {
            id: 'DOC-002',
            name: 'Dr. Michael Brown',
            specialization: 'Cardiology',
            email: 'michael.brown@clinic.com',
            phone: '+91-9876543215',
            licenseNumber: 'MED-67890',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        },
        tests: [
            {
                testId: 'TEST-003',
                test: {
                    id: 'TEST-003',
                    testType: 'Normal Test',
                    testName: 'Lipid Profile',
                    shortCode: 'LIPID',
                    price: 450,
                    unit: 'mg/dl',
                    tag: 'Biochemistry',
                    notes: 'Comprehensive cholesterol analysis',
                    defaultLabResult: 'See individual parameters',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                quantity: 1,
                price: 450
            }
        ],
        subtotal: 450,
        tax: 22.5,
        discount: 50,
        total: 422.5,
        status: 'pending',
        paymentMethod: 'cash',
        sampleDate: '2024-10-03',
        sampleTime: '08:30',
        reportStatus: 'Completed',
        testResults: [
            {
                testId: 'TEST-003',
                result: 'Total Cholesterol: 180 mg/dl, HDL: 45 mg/dl, LDL: 120 mg/dl',
                isAbnormal: false
            }
        ],
        notes: 'Cardiac risk assessment',
        clinicalRemarks: 'All lipid parameters within normal limits.',
        createdAt: '2024-10-01T11:00:00Z',
        updatedAt: '2024-10-02T15:30:00Z'
    }
];

export function BillsProvider({ children }: { children: ReactNode }) {
    const [bills, setBills] = useState<Bill[]>([]);

    // Load bills from localStorage on mount
    useEffect(() => {
        const savedBills = localStorage.getItem('lab-bills');
        if (savedBills) {
            try {
                const parsedBills = JSON.parse(savedBills);
                setBills(parsedBills);
            } catch (error) {
                console.error('Error loading bills from localStorage:', error);
                // If there's an error loading, use sample data
                setBills(generateSampleBills());
            }
        } else {
            // If no saved bills, use sample data
            setBills(generateSampleBills());
        }
    }, []);

    // Save bills to localStorage whenever bills change
    useEffect(() => {
        localStorage.setItem('lab-bills', JSON.stringify(bills));
    }, [bills]);

    const addBill = (bill: Bill) => {
        setBills(prev => [...prev, bill]);
    };

    const updateBill = (id: string, updates: Partial<Bill>) => {
        setBills(prev => prev.map(bill =>
            bill.id === id ? { ...bill, ...updates, updatedAt: new Date().toISOString() } : bill
        ));
    };

    const getBillById = (id: string) => {
        return bills.find(bill => bill.id === id);
    };

    const deleteBill = (id: string) => {
        setBills(prev => prev.filter(bill => bill.id !== id));
    };

    return (
        <BillsContext.Provider value= {{
        bills,
            addBill,
            updateBill,
            getBillById,
            deleteBill
    }
}>
    { children }
    </BillsContext.Provider>
  );
}

export function useBills() {
    const context = useContext(BillsContext);
    if (context === undefined) {
        throw new Error('useBills must be used within a BillsProvider');
    }
    return context;
}
