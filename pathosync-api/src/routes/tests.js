const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all tests
router.get('/', authenticate, checkPermission('Tests', 'list'), async (req, res) => {
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM tests WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new test
router.post('/', authenticate, checkPermission('Tests', 'create'), async (req, res) => {
  const { name, description, price, category_id } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'INSERT INTO tests (tenant_id, name, description, price, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenant_id, name, description, price, category_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single test
router.get('/:id', authenticate, checkPermission('Tests', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM tests WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a test
router.put('/:id', authenticate, checkPermission('Tests', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE tests SET name = $1, description = $2, price = $3, category_id = $4, updated_at = NOW() WHERE id = $5 AND tenant_id = $6 RETURNING *',
      [name, description, price, category_id, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a test
router.delete('/:id', authenticate, checkPermission('Tests', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    await db.query('DELETE FROM tests WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Assign a test to a package
router.post('/:id/assign-to-package', authenticate, checkPermission('Tests', 'assign-to-package'), async (req, res) => {
  const { id } = req.params;
  const { package_id } = req.body;
  const { tenant_id } = req.user;

  try {
    // In a real application, you would create a record in a linking table (e.g., package_tests).
    console.log(`Assigning test ${id} to package ${package_id} for tenant ${tenant_id}`);
    res.json({ msg: 'Test assigned to package successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get test results
router.get('/:id/results', authenticate, checkPermission('Tests', 'get-results'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    // In a real application, this would fetch results from a test_results table.
    console.log(`Fetching results for test ${id} for tenant ${tenant_id}`);
    res.json([]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update test status
router.put('/:id/status', authenticate, checkPermission('Tests', 'update-status'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE tests SET status = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [status, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
