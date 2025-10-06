import { Test } from '../types';

// Comprehensive mock test data for Indian healthcare market
export const mockTestsData: Test[] = [
  // =================== HEMATOLOGY ===================
  {
    id: 'TEST-HEM-001',
    testType: 'Normal Test',
    testName: 'Hemoglobin (Hb)',
    shortCode: 'HB',
    price: 50,
    unit: 'g/dl',
    tag: 'Hematology',
    method: 'Cyanmethemoglobin Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Male Adult', minValue: '13.0', maxValue: '17.0', unit: 'g/dl' },
      { id: '2', name: 'Female Adult', minValue: '12.0', maxValue: '15.0', unit: 'g/dl' },
      { id: '3', name: 'Children', minValue: '11.0', maxValue: '16.0', unit: 'g/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-002',
    testType: 'Normal Test',
    testName: 'Total Leucocyte Count (TLC)',
    shortCode: 'TLC',
    price: 80,
    unit: '/cumm',
    tag: 'Hematology',
    method: 'Automated Cell Counter',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '4000', maxValue: '11000', unit: '/cumm' },
      { id: '2', name: 'Children', minValue: '6000', maxValue: '17500', unit: '/cumm' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-003',
    testType: 'Normal Test',
    testName: 'Differential Leucocyte Count (DLC)',
    shortCode: 'DLC',
    price: 100,
    unit: '%',
    tag: 'Hematology',
    method: 'Microscopic Examination',
    formula: '',
    notes: 'Peripheral blood smear examination',
    referenceRanges: [
      { id: '1', name: 'Neutrophils', minValue: '50', maxValue: '70', unit: '%' },
      { id: '2', name: 'Lymphocytes', minValue: '20', maxValue: '40', unit: '%' },
      { id: '3', name: 'Eosinophils', minValue: '1', maxValue: '6', unit: '%' },
      { id: '4', name: 'Monocytes', minValue: '2', maxValue: '10', unit: '%' },
      { id: '5', name: 'Basophils', minValue: '0', maxValue: '2', unit: '%' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-004',
    testType: 'Normal Test',
    testName: 'Platelet Count',
    shortCode: 'PLT',
    price: 70,
    unit: '/cumm',
    tag: 'Hematology',
    method: 'Automated Cell Counter',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '150000', maxValue: '450000', unit: '/cumm' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-005',
    testType: 'Normal Test',
    testName: 'Hematocrit (PCV)',
    shortCode: 'PCV',
    price: 60,
    unit: '%',
    tag: 'Hematology',
    method: 'Microhematocrit Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Male', minValue: '40', maxValue: '50', unit: '%' },
      { id: '2', name: 'Female', minValue: '36', maxValue: '46', unit: '%' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-006',
    testType: 'Test Group',
    testName: 'Complete Blood Count (CBC)',
    shortCode: 'CBC',
    price: 300,
    tag: 'Hematology',
    notes: 'Comprehensive blood analysis including Hb, TLC, DLC, Platelet count, PCV, RBC indices',
    subTests: [
      {
        id: 'TEST-HEM-001',
        testType: 'Normal Test',
        testName: 'Hemoglobin (Hb)',
        shortCode: 'HB',
        price: 50,
        unit: 'g/dl',
        tag: 'Hematology',
        method: 'Automated cell counter',
        formula: '',
        notes: '',
        referenceRanges: [
          { id: '1', name: 'Male', minValue: '13.5', maxValue: '16.5', unit: 'gms/dl' },
          { id: '2', name: 'Female', minValue: '12.5', maxValue: '14.5', unit: 'gms/dl' },
          { id: '3', name: 'Children-1-2 yrs', minValue: '10.5', maxValue: '14.0', unit: 'gms/dl' },
          { id: '4', name: 'Children-2-9 yrs', minValue: '11.5', maxValue: '14.5', unit: 'gms/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-002',
        testType: 'Normal Test',
        testName: 'White Blood cell count (WBC)',
        shortCode: 'WBC',
        price: 100,
        unit: 'Cells/cumm',
        tag: 'Hematology',
        method: 'Automated cell counter',
        formula: '',
        notes: '',
        referenceRanges: [
          { id: '1', name: 'All ages', minValue: '4000', maxValue: '11000', unit: 'Cells/cumm' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-070',
        testType: 'Test Group',
        testName: 'Differential Count (DC)',
        shortCode: 'DC',
        price: 100,
        tag: 'Hematology',
        notes: 'Differential white blood cell count',
        subTests: [
          {
            id: 'TEST-HEM-071',
            testType: 'Normal Test',
            testName: 'Neutrophils',
            shortCode: 'NEUT',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated cell counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '40', maxValue: '75', unit: '%' },
              { id: '2', name: 'Children - 30 to 60', minValue: '30', maxValue: '60', unit: '%' }
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'TEST-HEM-072',
            testType: 'Normal Test',
            testName: 'Lymphocytes',
            shortCode: 'LYMPH',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated cell counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '20', maxValue: '45', unit: '%' },
              { id: '2', name: 'Children - 55 to 60', minValue: '55', maxValue: '60', unit: '%' }
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'TEST-HEM-073',
            testType: 'Normal Test',
            testName: 'Eosinophils',
            shortCode: 'EOS',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated cell counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '01', maxValue: '06', unit: '%' },
              { id: '2', name: 'Children - 01 to 03', minValue: '01', maxValue: '03', unit: '%' }
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'TEST-HEM-074',
            testType: 'Normal Test',
            testName: 'Monocytes',
            shortCode: 'MONO',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated cell counter',
            referenceRanges: [
              { id: '1', name: 'Adults', minValue: '01', maxValue: '10', unit: '%' },
              { id: '2', name: 'Children - 03 to 05', minValue: '03', maxValue: '05', unit: '%' }
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'TEST-HEM-075',
            testType: 'Normal Test',
            testName: 'Basophils',
            shortCode: 'BASO',
            price: 0,
            unit: '%',
            tag: 'Hematology',
            method: 'Automated cell counter',
            referenceRanges: [
              { id: '1', name: 'All ages', minValue: '00', maxValue: '01', unit: '%' }
            ],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-080',
        testType: 'Normal Test',
        testName: 'Red Blood Cells (RBC)',
        shortCode: 'RBC',
        price: 50,
        unit: 'mill cell/cumm',
        tag: 'Hematology',
        method: 'Automated cell counter',
        referenceRanges: [
          { id: '1', name: 'Male', minValue: '4.5', maxValue: '6.5', unit: 'mill cell/cumm' },
          { id: '2', name: 'Female', minValue: '4.0', maxValue: '5.5', unit: 'mill cell/cumm' },
          { id: '3', name: 'Children-1-10 yrs', minValue: '3.8', maxValue: '5.4', unit: 'mill cell/cumm' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-090',
        testType: 'Normal Test',
        testName: 'Platelet Counts (PC)',
        shortCode: 'PC',
        price: 150,
        unit: 'Lakhs/cumm',
        tag: 'Hematology',
        method: 'Automated cell counter',
        referenceRanges: [
          { id: '1', name: 'All ages', minValue: '1.5', maxValue: '4.5', unit: 'Lakhs/cumm' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-100',
        testType: 'Normal Test',
        testName: 'Packed cell volume (PCV)',
        shortCode: 'PCV',
        price: 100,
        unit: '%',
        tag: 'Hematology',
        method: 'Automated cell counter',
        referenceRanges: [
          { id: '1', name: 'Male', minValue: '45', maxValue: '55', unit: '%' },
          { id: '2', name: 'Female', minValue: '40', maxValue: '50', unit: '%' },
          { id: '3', name: 'Children-1-10 yrs', minValue: '32', maxValue: '43', unit: '%' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-110',
        testType: 'Normal Test',
        testName: 'Mean Corpuscular Volume (MCV)',
        shortCode: 'MCV',
        price: 0,
        unit: 'fL',
        tag: 'Hematology',
        method: 'Automated cell counter',
        formula: 'PCV*10/RBC',
        referenceRanges: [
          { id: '1', name: 'All ages', minValue: '78', maxValue: '98', unit: 'fL' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-120',
        testType: 'Normal Test',
        testName: 'Mean Corpuscular Haemoglobin (MCH)',
        shortCode: 'MCH',
        price: 0,
        unit: 'pg',
        tag: 'Hematology',
        method: 'Automated cell counter',
        formula: 'HB*10/RBC',
        referenceRanges: [
          { id: '1', name: 'All ages', minValue: '27', maxValue: '32', unit: 'pg' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-HEM-130',
        testType: 'Normal Test',
        testName: 'Mean Corpuscular Haemoglobin Concentration (MCHC)',
        shortCode: 'MCHC',
        price: 0,
        unit: 'g/dL',
        tag: 'Hematology',
        method: 'Automated cell counter',
        formula: 'HB*100/PCV',
        referenceRanges: [
          { id: '1', name: 'All ages', minValue: '31', maxValue: '36', unit: 'g/dL' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-HEM-007',
    testType: 'Normal Test',
    testName: 'Erythrocyte Sedimentation Rate (ESR)',
    shortCode: 'ESR',
    price: 40,
    unit: 'mm/hr',
    tag: 'Hematology',
    method: 'Westergren Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Male', minValue: '0', maxValue: '15', unit: 'mm/hr' },
      { id: '2', name: 'Female', minValue: '0', maxValue: '20', unit: 'mm/hr' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== BIOCHEMISTRY ===================
  {
    id: 'TEST-BIO-001',
    testType: 'Normal Test',
    testName: 'Blood Glucose (Fasting)',
    shortCode: 'FBS',
    price: 80,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Glucose Oxidase Method',
    formula: '',
    notes: '12-14 hours fasting required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '70', maxValue: '110', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-002',
    testType: 'Normal Test',
    testName: 'Blood Glucose (Post Prandial)',
    shortCode: 'PPBS',
    price: 80,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Glucose Oxidase Method',
    formula: '',
    notes: '2 hours after meal',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '70', maxValue: '140', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-003',
    testType: 'Normal Test',
    testName: 'Blood Urea',
    shortCode: 'UREA',
    price: 100,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Urease - GLDH Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '10', maxValue: '50', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-004',
    testType: 'Normal Test',
    testName: 'Serum Creatinine',
    shortCode: 'CREAT',
    price: 120,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Modified Jaffe Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Male', minValue: '0.7', maxValue: '1.4', unit: 'mg/dl' },
      { id: '2', name: 'Female', minValue: '0.6', maxValue: '1.2', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-005',
    testType: 'Normal Test',
    testName: 'Total Cholesterol',
    shortCode: 'CHOL',
    price: 150,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'CHOD-PAP Method',
    formula: '',
    notes: '12 hours fasting required',
    referenceRanges: [
      { id: '1', name: 'Desirable', minValue: '0', maxValue: '200', unit: 'mg/dl' },
      { id: '2', name: 'Borderline High', minValue: '200', maxValue: '239', unit: 'mg/dl' },
      { id: '3', name: 'High', minValue: '240', maxValue: '999', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-006',
    testType: 'Normal Test',
    testName: 'HDL Cholesterol',
    shortCode: 'HDL',
    price: 200,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Direct Method',
    formula: '',
    notes: '12 hours fasting required',
    referenceRanges: [
      { id: '1', name: 'Male', minValue: '40', maxValue: '999', unit: 'mg/dl' },
      { id: '2', name: 'Female', minValue: '50', maxValue: '999', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-007',
    testType: 'Normal Test',
    testName: 'LDL Cholesterol',
    shortCode: 'LDL',
    price: 220,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Direct Method',
    formula: 'CHOL - HDL - (TG/5)',
    notes: '12 hours fasting required',
    referenceRanges: [
      { id: '1', name: 'Optimal', minValue: '0', maxValue: '100', unit: 'mg/dl' },
      { id: '2', name: 'Near Optimal', minValue: '100', maxValue: '129', unit: 'mg/dl' },
      { id: '3', name: 'Borderline High', minValue: '130', maxValue: '159', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-008',
    testType: 'Normal Test',
    testName: 'Triglycerides',
    shortCode: 'TG',
    price: 150,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'GPO-PAP Method',
    formula: '',
    notes: '12 hours fasting required',
    referenceRanges: [
      { id: '1', name: 'Normal', minValue: '0', maxValue: '150', unit: 'mg/dl' },
      { id: '2', name: 'Borderline', minValue: '150', maxValue: '199', unit: 'mg/dl' },
      { id: '3', name: 'High', minValue: '200', maxValue: '999', unit: 'mg/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-009',
    testType: 'Test Group',
    testName: 'Lipid Profile',
    shortCode: 'LIPID',
    price: 600,
    tag: 'Biochemistry',
    notes: '12 hours fasting required. Includes Total Cholesterol, HDL, LDL, Triglycerides, VLDL',
    subTests: [
      {
        id: 'TEST-BIO-005',
        testType: 'Normal Test',
        testName: 'Total Cholesterol',
        shortCode: 'CHOL',
        price: 150,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'CHOD-PAP Method',
        formula: '',
        notes: '12 hours fasting required',
        referenceRanges: [
          { id: '1', name: 'Desirable', minValue: '0', maxValue: '200', unit: 'mg/dl' },
          { id: '2', name: 'Borderline High', minValue: '200', maxValue: '239', unit: 'mg/dl' },
          { id: '3', name: 'High', minValue: '240', maxValue: '999', unit: 'mg/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-BIO-006',
        testType: 'Normal Test',
        testName: 'HDL Cholesterol',
        shortCode: 'HDL',
        price: 200,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'Direct Method',
        formula: '',
        notes: '12 hours fasting required',
        referenceRanges: [
          { id: '1', name: 'Male', minValue: '40', maxValue: '999', unit: 'mg/dl' },
          { id: '2', name: 'Female', minValue: '50', maxValue: '999', unit: 'mg/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-BIO-007',
        testType: 'Normal Test',
        testName: 'LDL Cholesterol',
        shortCode: 'LDL',
        price: 220,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'Direct Method',
        formula: 'CHOL - HDL - (TG/5)',
        notes: '12 hours fasting required',
        referenceRanges: [
          { id: '1', name: 'Optimal', minValue: '0', maxValue: '100', unit: 'mg/dl' },
          { id: '2', name: 'Near Optimal', minValue: '100', maxValue: '129', unit: 'mg/dl' },
          { id: '3', name: 'Borderline High', minValue: '130', maxValue: '159', unit: 'mg/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-BIO-008',
        testType: 'Normal Test',
        testName: 'Triglycerides',
        shortCode: 'TG',
        price: 150,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'GPO-PAP Method',
        formula: '',
        notes: '12 hours fasting required',
        referenceRanges: [
          { id: '1', name: 'Normal', minValue: '0', maxValue: '150', unit: 'mg/dl' },
          { id: '2', name: 'Borderline', minValue: '150', maxValue: '199', unit: 'mg/dl' },
          { id: '3', name: 'High', minValue: '200', maxValue: '999', unit: 'mg/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'TEST-BIO-015',
        testType: 'Normal Test',
        testName: 'VLDL Cholesterol',
        shortCode: 'VLDL',
        price: 0,
        unit: 'mg/dl',
        tag: 'Biochemistry',
        method: 'Calculated',
        formula: 'TG/5',
        notes: 'Calculated value',
        referenceRanges: [
          { id: '1', name: 'Normal', minValue: '0', maxValue: '30', unit: 'mg/dl' }
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-010',
    testType: 'Normal Test',
    testName: 'SGOT (AST)',
    shortCode: 'SGOT',
    price: 120,
    unit: 'U/L',
    tag: 'Biochemistry',
    method: 'UV Kinetic Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '5', maxValue: '40', unit: 'U/L' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-011',
    testType: 'Normal Test',
    testName: 'SGPT (ALT)',
    shortCode: 'SGPT',
    price: 120,
    unit: 'U/L',
    tag: 'Biochemistry',
    method: 'UV Kinetic Method',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '5', maxValue: '35', unit: 'U/L' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-BIO-012',
    testType: 'Test Group',
    testName: 'Liver Function Test (LFT)',
    shortCode: 'LFT',
    price: 800,
    tag: 'Biochemistry',
    notes: 'Comprehensive liver function assessment including SGOT, SGPT, Bilirubin, ALP, Total Protein, Albumin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== ENDOCRINOLOGY ===================
  {
    id: 'TEST-END-001',
    testType: 'Normal Test',
    testName: 'Thyroid Stimulating Hormone (TSH)',
    shortCode: 'TSH',
    price: 300,
    unit: 'μIU/ml',
    tag: 'Endocrinology',
    method: 'Chemiluminescent Immunoassay',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '0.5', maxValue: '5.0', unit: 'μIU/ml' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-END-002',
    testType: 'Normal Test',
    testName: 'Free T4 (FT4)',
    shortCode: 'FT4',
    price: 400,
    unit: 'ng/dl',
    tag: 'Endocrinology',
    method: 'Chemiluminescent Immunoassay',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '0.8', maxValue: '2.0', unit: 'ng/dl' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-END-003',
    testType: 'Normal Test',
    testName: 'Free T3 (FT3)',
    shortCode: 'FT3',
    price: 400,
    unit: 'pg/ml',
    tag: 'Endocrinology',
    method: 'Chemiluminescent Immunoassay',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '2.3', maxValue: '4.2', unit: 'pg/ml' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-END-004',
    testType: 'Test Group',
    testName: 'Thyroid Function Test (TFT)',
    shortCode: 'TFT',
    price: 1000,
    tag: 'Endocrinology',
    notes: 'Complete thyroid assessment including TSH, FT4, FT3',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-END-005',
    testType: 'Normal Test',
    testName: 'HbA1c (Glycated Hemoglobin)',
    shortCode: 'HBA1C',
    price: 450,
    unit: '%',
    tag: 'Endocrinology',
    method: 'HPLC Method',
    formula: '',
    notes: 'No fasting required. Reflects average glucose over 2-3 months',
    referenceRanges: [
      { id: '1', name: 'Normal', minValue: '4.0', maxValue: '5.6', unit: '%' },
      { id: '2', name: 'Prediabetes', minValue: '5.7', maxValue: '6.4', unit: '%' },
      { id: '3', name: 'Diabetes', minValue: '6.5', maxValue: '20.0', unit: '%' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== IMMUNOLOGY ===================
  {
    id: 'TEST-IMM-001',
    testType: 'Normal Test',
    testName: 'Hepatitis B Surface Antigen (HBsAg)',
    shortCode: 'HBSAG',
    price: 300,
    unit: 'Reactive/Non-reactive',
    tag: 'Immunology',
    method: 'Rapid Card Test',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Normal', minValue: 'Non-reactive', maxValue: 'Non-reactive', unit: '' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-IMM-002',
    testType: 'Normal Test',
    testName: 'Anti HCV',
    shortCode: 'HCV',
    price: 400,
    unit: 'Reactive/Non-reactive',
    tag: 'Immunology',
    method: 'Rapid Card Test',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Normal', minValue: 'Non-reactive', maxValue: 'Non-reactive', unit: '' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-IMM-003',
    testType: 'Normal Test',
    testName: 'HIV 1 & 2',
    shortCode: 'HIV',
    price: 500,
    unit: 'Reactive/Non-reactive',
    tag: 'Immunology',
    method: 'Rapid Card Test',
    formula: '',
    notes: 'Counseling recommended. Confidential test',
    referenceRanges: [
      { id: '1', name: 'Normal', minValue: 'Non-reactive', maxValue: 'Non-reactive', unit: '' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== MICROBIOLOGY ===================
  {
    id: 'TEST-MIC-001',
    testType: 'Descriptive Test',
    testName: 'Urine Culture & Sensitivity',
    shortCode: 'URICS',
    price: 600,
    tag: 'Microbiology',
    defaultLabResult: '<h3>URINE CULTURE & SENSITIVITY</h3><p><strong>Sample:</strong> Mid-stream urine</p><p><strong>Culture Result:</strong></p><ul><li>Growth: No growth of pathogenic organisms</li><li>Colony count: < 10^5 CFU/ml</li></ul><p><strong>Interpretation:</strong> No significant bacteriuria</p><p><strong>Recommendation:</strong> No antimicrobial therapy required</p>',
    notes: 'Clean catch mid-stream urine sample required',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-MIC-002',
    testType: 'Descriptive Test',
    testName: 'Blood Culture & Sensitivity',
    shortCode: 'BLOOD-CS',
    price: 800,
    tag: 'Microbiology',
    defaultLabResult: '<h3>BLOOD CULTURE & SENSITIVITY</h3><p><strong>Sample:</strong> Venous blood</p><p><strong>Culture Media:</strong> Blood culture bottles (Aerobic & Anaerobic)</p><p><strong>Incubation:</strong> 5-7 days at 37°C</p><p><strong>Result:</strong></p><ul><li>No growth of pathogenic organisms after 5 days of incubation</li></ul><p><strong>Interpretation:</strong> Negative for bacterial septicemia</p>',
    notes: 'Sample collected under strict aseptic conditions',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== RADIOLOGY ===================
  {
    id: 'TEST-RAD-001',
    testType: 'Descriptive Test',
    testName: 'X-Ray Chest PA View',
    shortCode: 'XRC-PA',
    price: 300,
    tag: 'Radiology',
    defaultLabResult: '<h3>X-RAY CHEST - PA VIEW</h3><p><strong>Technique:</strong> Standard PA chest radiograph</p><p><strong>Clinical Information:</strong> Routine health checkup</p><p><strong>Findings:</strong></p><ul><li><strong>Heart:</strong> Normal size and shape. Cardiothoracic ratio within normal limits</li><li><strong>Lungs:</strong> Both lung fields are clear. No evidence of consolidation, collapse or pleural effusion</li><li><strong>Mediastinum:</strong> Normal mediastinal contours</li><li><strong>Bones:</strong> Visualized bony structures appear normal</li><li><strong>Soft tissues:</strong> Normal</li></ul><p><strong>Impression:</strong> Normal chest radiograph</p>',
    notes: 'No preparation required',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-RAD-002',
    testType: 'Descriptive Test',
    testName: 'Ultrasound Abdomen & Pelvis',
    shortCode: 'USG-ABD',
    price: 1200,
    tag: 'Radiology',
    defaultLabResult: '<h3>ULTRASOUND ABDOMEN & PELVIS</h3><p><strong>Clinical Information:</strong> Abdominal pain</p><p><strong>Technique:</strong> Transabdominal ultrasound</p><p><strong>Findings:</strong></p><p><strong>Liver:</strong> Normal size, shape and echotexture. No focal lesions. Portal vein normal.</p><p><strong>Gallbladder:</strong> Normal size with thin walls. No calculi or sludge.</p><p><strong>Pancreas:</strong> Normal size and echotexture.</p><p><strong>Spleen:</strong> Normal size and echotexture.</p><p><strong>Kidneys:</strong> Both kidneys normal in size and echotexture. No calculi or hydronephrosis.</p><p><strong>Bladder:</strong> Normal outline with adequate filling.</p><p><strong>Impression:</strong> Normal study</p>',
    notes: '6 hours fasting required. Full bladder for pelvis',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== CARDIOLOGY ===================
  {
    id: 'TEST-CAR-001',
    testType: 'Descriptive Test',
    testName: 'Electrocardiogram (ECG)',
    shortCode: 'ECG',
    price: 200,
    tag: 'Cardiology',
    defaultLabResult: '<h3>ELECTROCARDIOGRAM (ECG)</h3><p><strong>Clinical Information:</strong> Routine cardiac evaluation</p><p><strong>Technique:</strong> 12-lead ECG at rest</p><p><strong>Findings:</strong></p><ul><li><strong>Rate:</strong> 72 beats per minute</li><li><strong>Rhythm:</strong> Normal sinus rhythm</li><li><strong>Axis:</strong> Normal axis</li><li><strong>P waves:</strong> Normal</li><li><strong>PR interval:</strong> 0.16 seconds (Normal)</li><li><strong>QRS complex:</strong> 0.08 seconds (Normal)</li><li><strong>ST segment:</strong> No significant abnormality</li><li><strong>T waves:</strong> Normal in all leads</li></ul><p><strong>Impression:</strong> Normal ECG</p>',
    notes: 'No special preparation required',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== URINE ANALYSIS ===================
  {
    id: 'TEST-URI-001',
    testType: 'Test Group',
    testName: 'Complete Urine Examination',
    shortCode: 'CUE',
    price: 150,
    tag: 'Urology',
    notes: 'Complete urine analysis including physical, chemical and microscopic examination',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== SPECIAL TESTS ===================
  {
    id: 'TEST-SPC-001',
    testType: 'Normal Test',
    testName: 'Vitamin D (25-OH)',
    shortCode: 'VIT-D',
    price: 1200,
    unit: 'ng/ml',
    tag: 'Biochemistry',
    method: 'Chemiluminescent Immunoassay',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Deficient', minValue: '0', maxValue: '20', unit: 'ng/ml' },
      { id: '2', name: 'Insufficient', minValue: '20', maxValue: '30', unit: 'ng/ml' },
      { id: '3', name: 'Sufficient', minValue: '30', maxValue: '100', unit: 'ng/ml' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-SPC-002',
    testType: 'Normal Test',
    testName: 'Vitamin B12',
    shortCode: 'VIT-B12',
    price: 800,
    unit: 'pg/ml',
    tag: 'Biochemistry',
    method: 'Chemiluminescent Immunoassay',
    formula: '',
    notes: 'No special preparation required',
    referenceRanges: [
      { id: '1', name: 'Adult', minValue: '200', maxValue: '900', unit: 'pg/ml' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // =================== COMPREHENSIVE PACKAGES ===================
  {
    id: 'TEST-PKG-001',
    testType: 'Test Group',
    testName: 'Basic Health Checkup',
    shortCode: 'BHC',
    price: 1500,
    tag: 'Packages',
    notes: 'Complete basic health screening including CBC, Blood Sugar, Lipid Profile, Kidney Function, Liver Function',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-PKG-002',
    testType: 'Test Group',
    testName: 'Executive Health Checkup',
    shortCode: 'EHC',
    price: 3500,
    tag: 'Packages',
    notes: 'Comprehensive health screening for executives including all basic tests plus Thyroid, Vitamin D, ECG, X-Ray Chest',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-PKG-003',
    testType: 'Test Group',
    testName: 'Diabetes Monitoring Package',
    shortCode: 'DMP',
    price: 800,
    tag: 'Packages',
    notes: 'Specialized package for diabetes patients including FBS, PPBS, HbA1c, Kidney function tests',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'TEST-PKG-004',
    testType: 'Test Group',
    testName: 'Women Health Package',
    shortCode: 'WHP',
    price: 2500,
    tag: 'Packages',
    notes: 'Comprehensive health package for women including Pap Smear, Mammography, Thyroid, Iron studies, Vitamin D',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
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
    if (!test || test.testType !== 'Test Group' || !test.subTests) {
      return [];
    }
    
    const allSubTests: Test[] = [];
    
    const processSubTests = (subTests: Test[]) => {
      subTests.forEach(subTest => {
        if (subTest.testType === 'Test Group' && subTest.subTests) {
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