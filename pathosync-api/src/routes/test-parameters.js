const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all test parameters for a given test
router.get('/', authenticate, checkPermission('TestParameters', 'view'), async (req, res) => {
  const { test_id } = req.query;
  try {
    const { rows } = await db.query('SELECT * FROM test_parameters WHERE test_id = $1', [test_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single test parameter
router.get('/:id', authenticate, checkPermission('TestParameters', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM test_parameters WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test parameter not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new test parameter
router.post('/', authenticate, checkPermission('TestParameters', 'create'), async (req, res) => {
  const { tenant_id, test_id, parameter_name, unit, reference_ranges, sort_order, is_calculated, calculation_formula, is_critical, critical_low, critical_high, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO test_parameters (tenant_id, test_id, parameter_name, unit, reference_ranges, sort_order, is_calculated, calculation_formula, is_critical, critical_low, critical_high, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [tenant_id, test_id, parameter_name, unit, reference_ranges, sort_order, is_calculated, calculation_formula, is_critical, critical_low, critical_high, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a test parameter
router.put('/:id', authenticate, checkPermission('TestParameters', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, test_id, parameter_name, unit, reference_ranges, sort_order, is_calculated, calculation_formula, is_critical, critical_low, critical_high, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE test_parameters SET tenant_id = $1, test_id = $2, parameter_name = $3, unit = $4, reference_ranges = $5, sort_order = $6, is_calculated = $7, calculation_formula = $8, is_critical = $9, critical_low = $10, critical_high = $11, is_active = $12 WHERE id = $13 RETURNING *',
      [tenant_id, test_id, parameter_name, unit, reference_ranges, sort_order, is_calculated, calculation_formula, is_critical, critical_low, critical_high, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test parameter not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a test parameter
router.delete('/:id', authenticate, checkPermission('TestParameters', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM test_parameters WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test parameter not found' });
    }
    res.json({ message: 'Test parameter deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
