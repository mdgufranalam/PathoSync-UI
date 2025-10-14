const { Router } = require('express');
const { Pool } = require('pg');
const { authenticate, checkPermission } = require('../middleware/auth');

const router = Router();
const pool = new Pool();

// Get all patients
router.get('/', authenticate, checkPermission('Patients', 'view'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM patients');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single patient
router.get('/:id', authenticate, checkPermission('Patients', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new patient
router.post('/', authenticate, checkPermission('Patients', 'create'), async (req, res) => {
  const { tenant_id, first_name, last_name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO patients (tenant_id, first_name, last_name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [tenant_id, first_name, last_name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a patient
router.put('/:id', authenticate, checkPermission('Patients', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, first_name, last_name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE patients SET tenant_id = $1, first_name = $2, last_name = $3, email = $4, phone = $5, address = $6, date_of_birth = $7, gender = $8, emergency_contact_name = $9, emergency_contact_phone = $10 WHERE id = $11 RETURNING *',
      [tenant_id, first_name, last_name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a patient
router.delete('/:id', authenticate, checkPermission('Patients', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;