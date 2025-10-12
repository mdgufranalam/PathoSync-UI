const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all tests for a given package
router.get('/:package_id', authenticate, checkPermission('TestPackages', 'view'), async (req, res) => {
  const { package_id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM package_tests WHERE package_id = $1', [package_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a test to a package
router.post('/', authenticate, checkPermission('TestPackages', 'edit'), async (req, res) => {
  const { package_id, test_id, sort_order, is_optional } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO package_tests (package_id, test_id, sort_order, is_optional) VALUES ($1, $2, $3, $4) RETURNING *',
      [package_id, test_id, sort_order, is_optional]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove a test from a package
router.delete('/:package_id/:test_id', authenticate, checkPermission('TestPackages', 'edit'), async (req, res) => {
  const { package_id, test_id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM package_tests WHERE package_id = $1 AND test_id = $2 RETURNING *', [package_id, test_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package-test mapping not found' });
    }
    res.json({ message: 'Test removed from package successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
