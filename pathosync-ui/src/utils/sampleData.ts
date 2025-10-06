// Sample data to populate the system with realistic lab data

export const sampleTestTypes = [
  // Normal Tests
  {
    test_type: 'Normal Test',
    test_name: 'Hemoglobin',
    short_code: 'HB',
    price: 50,
    unit: 'g/dl',
    tag: 'Hematology',
    method: 'Cyanmethemoglobin',
    formula: '',
    notes: 'No special preparation required. Avoid hemolysis.',
    category: 'Hematology',
    created_by: 'Dr. Admin',
    reference_ranges: [
      { name: 'Male', min_value: '13.5', max_value: '17.5', unit: 'g/dl' },
      { name: 'Female', min_value: '12.0', max_value: '16.0', unit: 'g/dl' },
      { name: 'Children', min_value: '11.0', max_value: '14.0', unit: 'g/dl' }
    ]
  },
  {
    test_type: 'Normal Test',
    test_name: 'Total White Blood Cell Count',
    short_code: 'TLC',
    price: 60,
    unit: 'cells/cumm',
    tag: 'Hematology',
    method: 'Automated cell counter',
    formula: '',
    notes: 'Fasting not required. Collect in EDTA tube.',
    category: 'Hematology',
    created_by: 'Dr. Admin',
    reference_ranges: [
      { name: 'Adult', min_value: '4000', max_value: '11000', unit: 'cells/cumm' },
      { name: 'Children', min_value: '5000', max_value: '12000', unit: 'cells/cumm' }
    ]
  },
  {
    test_type: 'Normal Test',
    test_name: 'Platelet Count',
    short_code: 'PLT',
    price: 80,
    unit: 'thousand/cumm',
    tag: 'Hematology',
    method: 'Automated cell counter',
    formula: '',
    notes: 'Avoid clotted samples. Use EDTA anticoagulant.',
    category: 'Hematology',
    created_by: 'Dr. Admin',
    reference_ranges: [
      { name: 'Normal', min_value: '150', max_value: '450', unit: 'thousand/cumm' }
    ]
  },
  {
    test_type: 'Normal Test',
    test_name: 'Blood Glucose (Fasting)',
    short_code: 'FBS',
    price: 80,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Glucose Oxidase',
    formula: '',
    notes: '8-12 hours fasting required. No tea, coffee, or smoking.',
    category: 'Biochemistry',
    created_by: 'Dr. Admin',
    reference_ranges: [
      { name: 'Normal', min_value: '70', max_value: '110', unit: 'mg/dl' },
      { name: 'Prediabetic', min_value: '111', max_value: '125', unit: 'mg/dl' },
      { name: 'Diabetic', min_value: '126', max_value: '400', unit: 'mg/dl' }
    ]
  },
  {
    test_type: 'Normal Test',
    test_name: 'Blood Glucose (Random)',
    short_code: 'RBS',
    price: 70,
    unit: 'mg/dl',
    tag: 'Biochemistry',
    method: 'Glucose Oxidase',
    formula: '',
    notes: 'No fasting required. Can be done any time.',
    category: 'Biochemistry',
    created_by: 'Dr. Admin',
    reference_ranges: [
      { name: 'Normal', min_value: '80', max_value: '140', unit: 'mg/dl' },
      { name: 'Diabetic', min_value: '200', max_value: '400', unit: 'mg/dl' }
    ]
  },

  // Descriptive Tests
  {
    test_type: 'Descriptive Test',
    test_name: 'Complete Blood Count with Differential',
    short_code: 'CBC',
    price: 300,
    tag: 'Hematology',
    method: 'Automated cell counter with microscopy',
    default_lab_result: `
      <h3>Method: Automated cell counter with microscopy</h3>
      
      <h4>CLINICAL USE:</h4>
      <p>1) Diagnosis and monitoring of anemia, infection, and bleeding disorders. 2) Assessment of overall health status. 3) Monitoring response to treatment.</p>
      
      <h4>INCREASED VALUES:</h4>
      <p><strong>Hemoglobin/Hematocrit:</strong> Dehydration, polycythemia, high altitude, smoking.</p>
      <p><strong>White Blood Cells:</strong> Bacterial infections, leukemia, tissue necrosis, burns.</p>
      <p><strong>Platelets:</strong> Polycythemia vera, essential thrombocythemia, post-splenectomy.</p>
      
      <h4>DECREASED VALUES:</h4>
      <p><strong>Hemoglobin/Hematocrit:</strong> Iron deficiency anemia, blood loss, chronic disease, hemolysis.</p>
      <p><strong>White Blood Cells:</strong> Viral infections, chemotherapy, autoimmune disorders, bone marrow disorders.</p>
      <p><strong>Platelets:</strong> ITP, bone marrow disorders, hypersplenism, chemotherapy.</p>
      
      <h4>INTERFERENCE FACTORS:</h4>
      <p>Clotted samples, improper storage, certain medications may affect results.</p>
      
      <h4>TEST LIMITATIONS:</h4>
      <p>Results should be interpreted with clinical findings. Abnormal values require correlation with peripheral smear examination.</p>
    `,
    test_parameters: [
      { name: 'Hemoglobin', reference_range: 'M: 13.5-17.5, F: 12.0-16.0', unit: 'g/dl' },
      { name: 'Hematocrit', reference_range: 'M: 41-53, F: 36-46', unit: '%' },
      { name: 'Red Blood Cell Count', reference_range: 'M: 4.5-6.5, F: 4.0-5.5', unit: 'mill/cumm' },
      { name: 'White Blood Cell Count', reference_range: '4000-11000', unit: 'cells/cumm' },
      { name: 'Platelet Count', reference_range: '150-450', unit: 'thousand/cumm' },
      { name: 'Neutrophils', reference_range: '40-75', unit: '%' },
      { name: 'Lymphocytes', reference_range: '20-45', unit: '%' },
      { name: 'Monocytes', reference_range: '1-10', unit: '%' },
      { name: 'Eosinophils', reference_range: '1-6', unit: '%' },
      { name: 'Basophils', reference_range: '0-1', unit: '%' }
    ],
    clinical_use: '1) Diagnosis and monitoring of anemia, infection, and bleeding disorders. 2) Assessment of overall health status.',
    increased_in: 'Hemoglobin: Dehydration, polycythemia. WBC: Bacterial infections, leukemia. Platelets: Thrombocythemia.',
    decreased_in: 'Hemoglobin: Iron deficiency, blood loss. WBC: Viral infections, chemotherapy. Platelets: ITP, bone marrow disorders.',
    interference_factors: 'Clotted samples, improper storage, certain medications may affect results.',
    test_limitations: 'Results should be interpreted with clinical findings. Abnormal values require peripheral smear examination.',
    category: 'Hematology',
    created_by: 'Dr. Admin'
  },
  {
    test_type: 'Descriptive Test',
    test_name: 'Thyroid Function Tests',
    short_code: 'TFT',
    price: 1200,
    tag: 'Endocrinology',
    method: 'ECLIA (Electrochemiluminescence Immunoassay)',
    default_lab_result: `
      <h3>Method: ECLIA (Electrochemiluminescence Immunoassay)</h3>
      
      <h4>CLINICAL USE:</h4>
      <p>1) Diagnosis of hyperthyroidism and hypothyroidism. 2) Monitoring thyroid replacement therapy. 3) Assessment of thyroid nodules and goiter.</p>
      
      <h4>INCREASED TSH:</h4>
      <p>Primary hypothyroidism, subclinical hypothyroidism, TSH-secreting pituitary adenoma, thyroid hormone resistance, recovery phase of thyroiditis.</p>
      
      <h4>DECREASED TSH:</h4>
      <p>Primary hyperthyroidism, subclinical hyperthyroidism, secondary hypothyroidism (pituitary/hypothalamic disease), severe non-thyroidal illness, pregnancy (first trimester).</p>
      
      <h4>INTERFERENCE FACTORS:</h4>
      <p>Biotin supplementation (stop 3 days before test), heterophile antibodies, certain medications (amiodarone, lithium, steroids).</p>
      
      <h4>TEST LIMITATIONS:</h4>
      <p>TSH may be suppressed in severe illness. Free hormone levels should be measured if TSH is abnormal. Results should be interpreted with clinical presentation.</p>
    `,
    test_parameters: [
      { name: 'TSH (Thyroid Stimulating Hormone)', reference_range: '0.27-4.20', unit: 'mIU/L' },
      { name: 'Free T4 (Free Thyroxine)', reference_range: '12-22', unit: 'pmol/L' },
      { name: 'Free T3 (Free Triiodothyronine)', reference_range: '3.1-6.8', unit: 'pmol/L' },
      { name: 'Total T4', reference_range: '66-181', unit: 'nmol/L' },
      { name: 'Total T3', reference_range: '1.3-3.1', unit: 'nmol/L' }
    ],
    category: 'Endocrinology',
    created_by: 'Dr. Admin'
  },

  // Test Groups
  {
    test_type: 'Test Group',
    test_name: 'Diabetes Panel',
    short_code: 'DM',
    price: 450,
    tag: 'Biochemistry',
    notes: 'Comprehensive diabetes screening including fasting glucose, HbA1c, and postprandial glucose.',
    category: 'Biochemistry',
    created_by: 'Dr. Admin'
  },
  {
    test_type: 'Test Group',
    test_name: 'Liver Function Tests',
    short_code: 'LFT',
    price: 500,
    tag: 'Biochemistry',
    notes: 'Complete liver function assessment including bilirubin, ALT, AST, ALP, albumin, and total protein.',
    category: 'Biochemistry',
    created_by: 'Dr. Admin'
  }
];

export const sampleReports = [
  {
    report_no: 'LAB000001',
    patient_name: 'Mr. Gufran',
    patient_age: 20,
    patient_gender: 'Male',
    patient_phone: '+91-9876543210',
    doctor_name: 'OM Hospital',
    status: 'Verified and Signed',
    report_type: 'Descriptive',
    technician: 'Tech. Amit Kumar',
    verified_by: 'Dr. Pathologist',
    remarks: 'All parameters within normal limits. Continue current medication.',
    impression: 'Normal hematological profile. No evidence of anemia or bleeding disorder.',
    clinical_history: 'Routine health checkup for annual physical examination',
    specimen_type: 'Whole Blood (EDTA)',
    collection_time: '2024-10-03T09:00:00Z',
    received_time: '2024-10-03T09:15:00Z',
    report_time: '2024-10-03T14:30:00Z',
    created_by: 'Dr. Admin',
    test_results: [
      {
        test_name: 'Hemoglobin (HB)',
        result: '14.5',
        reference_range: 'Male: 13.5 to 16.5',
        unit: 'g/dl',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'White Blood cell count (WBC)',
        result: '10000',
        reference_range: '4000 to 11000',
        unit: 'Cells/cumm',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Neutrophils',
        result: '65',
        reference_range: '40 to 75',
        unit: '%',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Lymphocytes',
        result: '25',
        reference_range: '20 to 45',
        unit: '%',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Eosinophils',
        result: '04',
        reference_range: '01 to 06',
        unit: '%',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Monocytes',
        result: '06',
        reference_range: '01 to 10',
        unit: '%',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Basophils',
        result: '0.88',
        reference_range: '00 to 01',
        unit: '%',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Red Blood Cells (RBC)',
        result: '5',
        reference_range: 'Male: 4.5 to 6.5',
        unit: 'mill cell/cumm',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Platelet Counts (PC)',
        result: '3',
        reference_range: '1.5 to 4.5',
        unit: 'Lakhs/cumm',
        status: 'Normal',
        method: 'Automated cell counter'
      },
      {
        test_name: 'Packed cell volume (PCV)',
        result: '35',
        reference_range: 'Male: 45 to 55',
        unit: '%',
        status: 'Low',
        method: 'Automated cell counter'
      }
    ]
  }
];