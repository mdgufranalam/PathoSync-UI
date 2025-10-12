const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM doctors');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new doctor
router.post('/', async (req, res) => {
  const { name, email, phone, address, tenant_id } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO doctors (name, email, phone, address, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, address, tenant_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single doctor
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM doctors WHERE doctor_id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a doctor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE doctors SET name = $1, email = $2, phone = $3, address = $4 WHERE doctor_id = $5 RETURNING *',
      [name, email, phone, address, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a doctor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM doctors WHERE doctor_id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;