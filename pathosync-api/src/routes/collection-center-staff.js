const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all staff for a given collection center
router.get('/center/:center_id', authenticate, checkPermission('CollectionCenterStaff', 'view'), async (req, res) => {
  const { center_id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM collection_center_staff WHERE collection_center_id = $1', [center_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all collection centers for a given staff member
router.get('/staff/:user_id', authenticate, checkPermission('CollectionCenterStaff', 'view'), async (req, res) => {
  const { user_id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM collection_center_staff WHERE user_id = $1', [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Assign a staff member to a collection center
router.post('/', authenticate, checkPermission('CollectionCenterStaff', 'create'), async (req, res) => {
  const { tenant_id, collection_center_id, user_id, role, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO collection_center_staff (tenant_id, collection_center_id, user_id, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenant_id, collection_center_id, user_id, role, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a staff assignment
router.put('/:id', authenticate, checkPermission('CollectionCenterStaff', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, collection_center_id, user_id, role, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE collection_center_staff SET tenant_id = $1, collection_center_id = $2, user_id = $3, role = $4, is_active = $5 WHERE id = $6 RETURNING *',
      [tenant_id, collection_center_id, user_id, role, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Staff assignment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Unassign a staff member from a collection center
router.delete('/:id', authenticate, checkPermission('CollectionCenterStaff', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM collection_center_staff WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Staff assignment not found' });
    }
    res.json({ message: 'Staff assignment deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
