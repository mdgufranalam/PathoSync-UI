import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger middleware
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Test Types APIs using KV store
app.get('/make-server-6f266c75/test-types', async (c) => {
  try {
    const testTypes = await kv.getByPrefix('test_type:');
    return c.json({ success: true, data: testTypes });
  } catch (error) {
    console.error('Error fetching test types:', error);
    return c.json({ error: 'Failed to fetch test types' }, 500);
  }
});

app.post('/make-server-6f266c75/test-types', async (c) => {
  try {
    const body = await c.req.json();
    const id = `test_type:${Date.now()}`;
    const testType = {
      id: id,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(id, testType);
    return c.json({ success: true, data: testType });
  } catch (error) {
    console.error('Error creating test type:', error);
    return c.json({ error: 'Failed to create test type' }, 500);
  }
});

app.put('/make-server-6f266c75/test-types/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const fullId = id.startsWith('test_type:') ? id : `test_type:${id}`;
    
    const existing = await kv.get(fullId);
    if (!existing) {
      return c.json({ error: 'Test type not found' }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString()
    };

    await kv.set(fullId, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating test type:', error);
    return c.json({ error: 'Failed to update test type' }, 500);
  }
});

app.delete('/make-server-6f266c75/test-types/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const fullId = id.startsWith('test_type:') ? id : `test_type:${id}`;
    
    await kv.del(fullId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting test type:', error);
    return c.json({ error: 'Failed to delete test type' }, 500);
  }
});

// Lab Reports APIs using KV store
app.get('/make-server-6f266c75/lab-reports', async (c) => {
  try {
    const reports = await kv.getByPrefix('lab_report:');
    return c.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    return c.json({ error: 'Failed to fetch lab reports' }, 500);
  }
});

app.get('/make-server-6f266c75/lab-reports/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`Fetching lab report with ID: ${id}`);
    
    const fullId = id.startsWith('lab_report:') ? id : `lab_report:${id}`;
    console.log(`Full ID: ${fullId}`);
    
    const report = await kv.get(fullId);
    if (!report) {
      console.log(`Lab report not found: ${fullId}`);
      return c.json({ error: 'Lab report not found', success: false }, 404);
    }

    console.log(`Lab report found: ${fullId}`);
    return c.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching lab report:', error);
    return c.json({ error: 'Failed to fetch lab report', success: false }, 500);
  }
});

app.post('/make-server-6f266c75/lab-reports', async (c) => {
  try {
    const body = await c.req.json();
    
    // Generate report number
    const reports = await kv.getByPrefix('lab_report:');
    const reportNo = `LAB${String(reports.length + 1).padStart(6, '0')}`;
    
    const id = `lab_report:${Date.now()}`;
    const report = {
      id: id,
      report_no: reportNo,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(id, report);
    return c.json({ success: true, data: report });
  } catch (error) {
    console.error('Error creating lab report:', error);
    return c.json({ error: 'Failed to create lab report' }, 500);
  }
});

app.put('/make-server-6f266c75/lab-reports/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const fullId = id.startsWith('lab_report:') ? id : `lab_report:${id}`;
    
    const existing = await kv.get(fullId);
    if (!existing) {
      return c.json({ error: 'Lab report not found' }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString()
    };

    await kv.set(fullId, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating lab report:', error);
    return c.json({ error: 'Failed to update lab report' }, 500);
  }
});

app.delete('/make-server-6f266c75/lab-reports/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const fullId = id.startsWith('lab_report:') ? id : `lab_report:${id}`;
    
    await kv.del(fullId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting lab report:', error);
    return c.json({ error: 'Failed to delete lab report' }, 500);
  }
});

// Update report status
app.put('/make-server-6f266c75/lab-reports/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const fullId = id.startsWith('lab_report:') ? id : `lab_report:${id}`;

    const existing = await kv.get(fullId);
    if (!existing) {
      return c.json({ error: 'Lab report not found' }, 404);
    }

    const updated = {
      ...existing,
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'Printed' && { report_time: new Date().toISOString() })
    };

    await kv.set(fullId, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating report status:', error);
    return c.json({ error: 'Failed to update report status' }, 500);
  }
});

// Update report impression
app.put('/make-server-6f266c75/lab-reports/:id/impression', async (c) => {
  try {
    const id = c.req.param('id');
    const { impression } = await c.req.json();
    const fullId = id.startsWith('lab_report:') ? id : `lab_report:${id}`;

    const existing = await kv.get(fullId);
    if (!existing) {
      return c.json({ error: 'Lab report not found' }, 404);
    }

    const updated = {
      ...existing,
      impression,
      updated_at: new Date().toISOString()
    };

    await kv.set(fullId, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating report impression:', error);
    return c.json({ error: 'Failed to update report impression' }, 500);
  }
});

// WhatsApp/SMS sending endpoints (mock implementation)
app.post('/make-server-6f266c75/send-whatsapp', async (c) => {
  try {
    const { phone, message, pdfBase64 } = await c.req.json();

    // Mock WhatsApp API integration
    console.log(`Sending WhatsApp to ${phone}: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return c.json({ 
      success: true, 
      message: 'WhatsApp message sent successfully',
      messageId: `wa_${Date.now()}`
    });
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return c.json({ error: 'Failed to send WhatsApp message' }, 500);
  }
});

app.post('/make-server-6f266c75/send-sms', async (c) => {
  try {
    const { phone, message } = await c.req.json();

    // Mock SMS API integration
    console.log(`Sending SMS to ${phone}: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return c.json({ 
      success: true, 
      message: 'SMS sent successfully',
      messageId: `sms_${Date.now()}`
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return c.json({ error: 'Failed to send SMS' }, 500);
  }
});

// Seed database with sample data
app.post('/make-server-6f266c75/seed', async (c) => {
  try {
    console.log('Starting database seeding...');
    
    // Create multiple sample reports for testing
    const sampleReports = [
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
          }
        ]
      },
      {
        report_no: 'LAB000002',
        patient_name: 'Ms. Sarah',
        patient_age: 25,
        patient_gender: 'Female',
        patient_phone: '+91-9876543211',
        doctor_name: 'City Hospital',
        status: 'Verified and Signed',
        report_type: 'Normal',
        technician: 'Tech. Priya',
        verified_by: 'Dr. Pathologist',
        remarks: 'Normal test results.',
        impression: 'All parameters normal.',
        clinical_history: 'General health checkup',
        specimen_type: 'Blood',
        collection_time: '2024-10-04T10:00:00Z',
        received_time: '2024-10-04T10:15:00Z',
        report_time: '2024-10-04T15:30:00Z',
        created_by: 'Dr. Admin',
        test_results: [
          {
            test_name: 'Blood Sugar',
            result: '95',
            reference_range: '70-110',
            unit: 'mg/dl',
            status: 'Normal',
            method: 'Glucose oxidase'
          }
        ]
      },
      {
        report_no: 'LAB000003',
        patient_name: 'Mr. Ahmed',
        patient_age: 30,
        patient_gender: 'Male',
        patient_phone: '+91-9876543212',
        doctor_name: 'Metro Clinic',
        status: 'Verified and Signed',
        report_type: 'Normal',
        technician: 'Tech. Raj',
        verified_by: 'Dr. Pathologist',
        remarks: 'Test completed successfully.',
        impression: 'Normal lipid profile.',
        clinical_history: 'Lipid screening',
        specimen_type: 'Serum',
        collection_time: '2024-10-04T11:00:00Z',
        received_time: '2024-10-04T11:15:00Z',
        report_time: '2024-10-04T16:30:00Z',
        created_by: 'Dr. Admin',
        test_results: [
          {
            test_name: 'Cholesterol',
            result: '180',
            reference_range: '<200',
            unit: 'mg/dl',
            status: 'Normal',
            method: 'Enzymatic'
          }
        ]
      }
    ];

    const reportIds = [];
    
    for (let i = 0; i < sampleReports.length; i++) {
      const reportId = `lab_report:${Date.now() + i}`;
      const report = {
        id: reportId,
        ...sampleReports[i],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await kv.set(reportId, report);
      reportIds.push(reportId);
      console.log(`Created report: ${reportId}`);
    }

    console.log('Database seeding completed successfully');
    
    return c.json({ 
      success: true, 
      message: 'Sample data seeded successfully',
      reportIds: reportIds,
      count: reportIds.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return c.json({ error: 'Failed to seed data', success: false }, 500);
  }
});

// Health check endpoint
app.get('/make-server-6f266c75/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database with sample data if empty
const initializeDatabase = async () => {
  try {
    console.log('Checking if database initialization is needed...');
    const reports = await kv.getByPrefix('lab_report:');
    
    if (reports.length === 0) {
      console.log('No reports found, initializing with sample data...');
      
      // Create a sample report
      const sampleReport = {
        report_no: 'LAB000001',
        patient_name: 'Mr. Sample Patient',
        patient_age: 30,
        patient_gender: 'Male',
        patient_phone: '+91-9876543210',
        doctor_name: 'Sample Hospital',
        status: 'Verified and Signed',
        report_type: 'Normal',
        technician: 'Tech. Sample',
        verified_by: 'Dr. Sample',
        remarks: 'Sample report for testing.',
        impression: 'Normal results.',
        clinical_history: 'Routine checkup',
        specimen_type: 'Blood',
        collection_time: new Date().toISOString(),
        received_time: new Date().toISOString(),
        report_time: new Date().toISOString(),
        created_by: 'System',
        test_results: [
          {
            test_name: 'Sample Test',
            result: '100',
            reference_range: '80-120',
            unit: 'mg/dl',
            status: 'Normal',
            method: 'Standard'
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const reportId = 'lab_report:sample_1';
      await kv.set(reportId, { id: reportId, ...sampleReport });
      console.log('Sample data initialized successfully');
    } else {
      console.log(`Database already has ${reports.length} reports`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// Start server
Deno.serve(app.fetch);