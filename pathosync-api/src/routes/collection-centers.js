const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all collection centers
router.get('/', authenticate, checkPermission('CollectionCenters', 'view'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM collection_centers');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single collection center
router.get('/:id', authenticate, checkPermission('CollectionCenters', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM collection_centers WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Collection center not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new collection center
router.post('/', authenticate, checkPermission('CollectionCenters', 'create'), async (req, res) => {
  const { tenant_id, center_code, name, address, city, state, pincode, country, contact_person, contact_number, email, working_hours, gps_coordinates, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO collection_centers (tenant_id, center_code, name, address, city, state, pincode, country, contact_person, contact_number, email, working_hours, gps_coordinates, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [tenant_id, center_code, name, address, city, state, pincode, country, contact_person, contact_number, email, working_hours, gps_coordinates, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a collection center
router.put('/:id', authenticate, checkPermission('CollectionCenters', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, center_code, name, address, city, state, pincode, country, contact_person, contact_number, email, working_hours, gps_coordinates, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE collection_centers SET tenant_id = $1, center_code = $2, name = $3, address = $4, city = $5, state = $6, pincode = $7, country = $8, contact_person = $9, contact_number = $10, email = $11, working_hours = $12, gps_coordinates = $13, is_active = $14 WHERE id = $15 RETURNING *',
      [tenant_id, center_code, name, address, city, state, pincode, country, contact_person, contact_number, email, working_hours, gps_coordinates, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Collection center not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a collection center
router.delete('/:id', authenticate, checkPermission('CollectionCenters', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM collection_centers WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Collection center not found' });
    }
    res.json({ message: 'Collection center deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
