//import { Test } from '../types';
interface ReferenceRange {
  id: string;
  name: string;
  minValue: string;
  maxValue: string;
  unit: string;
}
interface Test {
    id: string;
    testName: string;
    testType: 'Numeric' | 'Descriptive' | 'Group';
    shortCode: string;
    price: number;
    category?: string;
    unit?: string;
    tag: string;
    method?: string;
    formula?: string;
    notes?: string;
    description?: string;
    defaultLabResult?: string;
    referenceRanges?: ReferenceRange[];
    subTests?: Test[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Comprehensive mock test data for Indian healthcare market
export const mockTestsData: Test[] = [
  {
    id: 'TEST-HEM-001',
    testName: 'Hemoglobin (Hb)',
    testType: 'Numeric',
    shortCode: 'HB',
    price: 50,
    unit: 'g/dl',
    tag: 'Hematology',
    method: 'Cyanmethemoglobin Method',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Male Adult', minValue: '13.0', maxValue: '17.0', unit: 'g/dl' },
      { id: '2', name: 'Female Adult', minValue: '12.0', maxValue: '15.0', unit: 'g/dl' },
      { id: '3', name: 'Children', minValue: '11.0', maxValue: '16.0', unit: 'g/dl' },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'TEST-HEM-002',
    testName: 'Total Leucocyte Count (TLC)',
    testType: 'Numeric',
    shortCode: 'TLC',
    price: 80,
    unit: '/cumm',
    tag: 'Hematology',
    method: 'Automated Cell Counter',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '4000', maxValue: '11000', unit: '/cumm' },
      { id: '2', name: 'Children', minValue: '6000', maxValue: '17500', unit: '/cumm' },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'TEST-HEM-006',
    testName: 'Complete Blood Count (CBC)',
    testType: 'Group',
    shortCode: 'CBC',
    price: 300,
    tag: 'Hematology',
    notes: 'Comprehensive blood analysis including Hb, TLC, DLC, Platelet count, PCV, RBC indices',
    subTests: [
      {
        id: 'TEST-HEM-070',
        testName: 'Differential Count (DC)',
        testType: 'Group',
        shortCode: 'DC',
        price: 100,
        tag: 'Hematology',
        notes: 'Differential white blood cell count',
        subTests: [
          {
            id: 'TEST-HEM-071',
            testName: 'Neutrophils',
            testType: 'Numeric',
            shortCode: 'NEUT',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated Cell Counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '40', maxValue: '75', unit: '%' },
              { id: '2', name: 'Children', minValue: '30', maxValue: '60', unit: '%' },
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 'TEST-HEM-072',
            testName: 'Lymphocytes',
            testType: 'Numeric',
            shortCode: 'LYMPH',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated Cell Counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '20', maxValue: '45', unit: '%' },
              { id: '2', name: 'Children', minValue: '55', maxValue: '60', unit: '%' },
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'TEST-BIO-009',
    testName: 'Lipid Profile',
    testType: 'Group',
    shortCode: 'LIPID',
    price: 600,
    tag: 'Biochemistry',
    notes: 'Includes Total Cholesterol, HDL, LDL, Triglycerides, VLDL',
    subTests: [
      {
        id: 'TEST-BIO-005',
        testName: 'Total Cholesterol',
        testType: 'Numeric',
        shortCode: 'CHOL',
        price: 150,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'CHOD-PAP Method',
        referenceRanges: [
          { id: '1', name: 'Desirable', minValue: '0', maxValue: '200', unit: 'mg/dl' },
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'TEST-BIO-015',
        testName: 'VLDL Cholesterol',
        testType: 'Numeric',
        shortCode: 'VLDL',
        price: 0,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'Calculated',
        formula: 'TG/5',
        notes: 'Calculated value',
        referenceRanges: [
          { id: '1', name: 'Normal', minValue: '0', maxValue: '30', unit: 'mg/dl' },
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'TEST-RAD-001',
    testName: 'X-Ray Chest PA View',
    testType: 'Descriptive',
    shortCode: 'XRC-PA',
    price: 300,
    tag: 'Radiology',
    defaultLabResult:
      '<h3>X-RAY CHEST - PA VIEW</h3><p><strong>Technique:</strong> Standard PA chest radiograph</p><ul><li>Heart and lungs normal</li></ul><p><strong>Impression:</strong> Normal chest radiograph</p>',
    notes: 'No preparation required',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Test categories for organization
export const mockTestCategories = [
  'Hematology',
  'Biochemistry', 
  'Endocrinology',
  'Immunology',
  'Microbiology',
  'Radiology',
  'Cardiology',
  'Urology',
  'Pathology',
  'Oncology',
  'Packages'
];

// Mock API functions
export const mockTestsAPI = {
  getAllTests: () => Promise.resolve(mockTestsData),
  
  getTestsByCategory: (category: string) => 
    Promise.resolve(mockTestsData.filter(test => test.tag === category)),
  
  getTestById: (id: string) => 
    Promise.resolve(mockTestsData.find(test => test.id === id)),
  
  searchTests: (query: string) => 
    Promise.resolve(mockTestsData.filter(test => 
      test.testName.toLowerCase().includes(query.toLowerCase()) ||
      test.shortCode.toLowerCase().includes(query.toLowerCase())
    )),
  
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTest: Test = {
      ...testData,
      id: `TEST-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTestsData.push(newTest);
    return Promise.resolve(newTest);
  },

  // Get all sub-tests from a test group recursively
  getAllSubTests: (testId: string): Test[] => {
    const test = mockTestsData.find(t => t.id === testId);
    if (!test || test.testType !== 'Group' || !test.subTests) {
      return [];
    }
    
    const allSubTests: Test[] = [];
    
    const processSubTests = (subTests: Test[]) => {
      subTests.forEach(subTest => {
        if (subTest.testType === 'Group' && subTest.subTests) {
          processSubTests(subTest.subTests);
        } else {
          allSubTests.push(subTest);
        }
      });
    };
    
    processSubTests(test.subTests);
    return allSubTests;
  },
  
  updateTest: (id: string, testData: Partial<Test>) => {
    const index = mockTestsData.findIndex(test => test.id === id);
    if (index !== -1) {
      mockTestsData[index] = {
        ...mockTestsData[index],
        ...testData,
        updatedAt: new Date().toISOString()
      };
      return Promise.resolve(mockTestsData[index]);
    }
    return Promise.reject(new Error('Test not found'));
  },
  
  deleteTest: (id: string) => {
    const index = mockTestsData.findIndex(test => test.id === id);
    if (index !== -1) {
      const deletedTest = mockTestsData.splice(index, 1)[0];
      return Promise.resolve(deletedTest);
    }  
    return Promise.reject(new Error('Test not found'));
  }
};