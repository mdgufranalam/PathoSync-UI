const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all referrals
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM referrals');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new referral
router.post('/', async (req, res) => {
  const {
    tenant_id,
    referring_doctor_name,
    referring_doctor_id,
    referring_organization_name,
    referring_organization_id,
    patient_id,
    priority,
    specialty_requested,
    reason_for_referral,
    status,
    notes
  } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO referrals (tenant_id, referring_doctor_name, referring_doctor_id, referring_organization_name, referring_organization_id, patient_id, priority, specialty_requested, reason_for_referral, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [tenant_id, referring_doctor_name, referring_doctor_id, referring_organization_name, referring_organization_id, patient_id, priority, specialty_requested, reason_for_referral, status, notes]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single referral
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM referrals WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a referral
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    referring_doctor_name,
    referring_doctor_id,
    referring_organization_name,
    referring_organization_id,
    patient_id,
    priority,
    specialty_requested,
    reason_for_referral,
    status,
    notes
  } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE referrals SET referring_doctor_name = $1, referring_doctor_id = $2, referring_organization_name = $3, referring_organization_id = $4, patient_id = $5, priority = $6, specialty_requested = $7, reason_for_referral = $8, status = $9, notes = $10, updated_at = NOW() WHERE id = $11 RETURNING *',
      [referring_doctor_name, referring_doctor_id, referring_organization_name, referring_organization_id, patient_id, priority, specialty_requested, reason_for_referral, status, notes, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a referral
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM referrals WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.json({ message: 'Referral deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;