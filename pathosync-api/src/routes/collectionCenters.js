const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all collection centers
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM collection_centers');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new collection center
router.post('/', async (req, res) => {
  const { name, address, contact_person, phone } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO collection_centers (name, address, contact_person, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, contact_person, phone]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a collection center
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, contact_person, phone } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE collection_centers SET name = $1, address = $2, contact_person = $3, phone = $4 WHERE id = $5 RETURNING *',
      [name, address, contact_person, phone, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a collection center
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM collection_centers WHERE id = $1', [id]);
    res.json({ msg: 'Collection center deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;