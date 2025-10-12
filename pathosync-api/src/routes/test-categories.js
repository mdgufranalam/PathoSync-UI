const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all test categories
router.get('/', authenticate, checkPermission('TestCategories', 'view'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM test_categories');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single test category
router.get('/:id', authenticate, checkPermission('TestCategories', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM test_categories WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test category not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new test category
router.post('/', authenticate, checkPermission('TestCategories', 'create'), async (req, res) => {
  const { tenant_id, parent_id, name, description, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO test_categories (tenant_id, parent_id, name, description, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenant_id, parent_id, name, description, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a test category
router.put('/:id', authenticate, checkPermission('TestCategories', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, parent_id, name, description, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE test_categories SET tenant_id = $1, parent_id = $2, name = $3, description = $4, is_active = $5 WHERE id = $6 RETURNING *',
      [tenant_id, parent_id, name, description, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test category not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a test category
router.delete('/:id', authenticate, checkPermission('TestCategories', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM test_categories WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test category not found' });
    }
    res.json({ message: 'Test category deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
