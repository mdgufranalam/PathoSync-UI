const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');
const { logAuditEvent } = require('../audit');
const { createNotification } = require('../notification');

// Get all patients
router.get('/', authenticate, checkPermission('Patients', 'list'), async (req, res) => {
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM patients WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Register a new patient
router.post('/', authenticate, checkPermission('Patients', 'create'), async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, phone, email } = req.body;
  const { tenant_id, id: userId } = req.user;

  try {
    const { rows } = await db.query(
      'INSERT INTO patients (tenant_id, first_name, last_name, date_of_birth, gender, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tenant_id, first_name, last_name, date_of_birth, gender, phone, email]
    );
    const newPatient = rows[0];

    // Log the audit event
    await logAuditEvent(userId, 'create_patient', { patientId: newPatient.id, newData: newPatient });

    // Create a notification for admins and managers
    const { rows: usersToNotify } = await db.query("SELECT id FROM users WHERE role IN ('Admin', 'Manager') AND tenant_id = $1", [tenant_id]);
    for (const user of usersToNotify) {
      await createNotification(user.id, 'new_patient', { patientName: `${newPatient.first_name} ${newPatient.last_name}` });
    }

    res.status(201).json(newPatient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get patient details
router.get('/:id', authenticate, checkPermission('Patients', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM patients WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update patient info
router.put('/:id', authenticate, checkPermission('Patients', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, gender, phone, email } = req.body;
  const { tenant_id, id: userId } = req.user;

  try {
    // Get the original data for comparison
    const { rows: originalRows } = await db.query('SELECT * FROM patients WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    const originalPatient = originalRows[0];

    const { rows } = await db.query(
      'UPDATE patients SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, phone = $5, email = $6, updated_at = NOW() WHERE id = $7 AND tenant_id = $8 RETURNING *',
      [first_name, last_name, date_of_birth, gender, phone, email, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const updatedPatient = rows[0];

    // Log the audit event
    await logAuditEvent(userId, 'update_patient', { patientId: updatedPatient.id, originalData: originalPatient, newData: updatedPatient });

    res.json(updatedPatient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a patient
router.delete('/:id', authenticate, checkPermission('Patients', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, id: userId } = req.user;

  try {
    // Get the original data before deleting
    const { rows: originalRows } = await db.query('SELECT * FROM patients WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    const originalPatient = originalRows[0];

    await db.query('DELETE FROM patients WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);

    // Log the audit event
    await logAuditEvent(userId, 'delete_patient', { patientId: id, deletedData: originalPatient });

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Search patients
router.get('/search', authenticate, checkPermission('Patients', 'search'), async (req, res) => {
  const { q } = req.query;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM patients WHERE tenant_id = $1 AND (first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2)', [tenant_id, `%${q}%`]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Link a report to a patient
router.post('/:id/reports', authenticate, checkPermission('Patients', 'link-reports'), async (req, res) => {
  const { id } = req.params;
  const { report_id } = req.body;
  const { tenant_id, id: userId } = req.user;

  try {
    // In a real application, you would create a record in a linking table (e.g., patient_reports).
    // For this example, we'll just log a message.
    console.log(`Linking report ${report_id} to patient ${id} for tenant ${tenant_id}`);

    // Log the audit event
    await logAuditEvent(userId, 'link_report_to_patient', { patientId: id, reportId: report_id });

    res.json({ msg: 'Report linked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
