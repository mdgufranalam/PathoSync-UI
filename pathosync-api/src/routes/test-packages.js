const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all test packages
router.get('/', authenticate, checkPermission('TestPackages', 'list'), async (req, res) => {
  const { tenant_id } = req.user;
  try {
    const { rows } = await db.query('SELECT * FROM test_packages WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single test package
router.get('/:id', authenticate, checkPermission('TestPackages', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;
  try {
    const { rows } = await db.query('SELECT * FROM test_packages WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test package not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new test package
router.post('/', authenticate, checkPermission('TestPackages', 'create'), async (req, res) => {
  const { name, description, price, test_ids } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'INSERT INTO test_packages (tenant_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenant_id, name, description, price]
    );
    const package_id = rows[0].id;

    if (test_ids && test_ids.length > 0) {
      const insertPromises = test_ids.map(test_id => {
        return db.query('INSERT INTO package_tests (package_id, test_id) VALUES ($1, $2)', [package_id, test_id]);
      });
      await Promise.all(insertPromises);
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a test package
router.put('/:id', authenticate, checkPermission('TestPackages', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE test_packages SET name = $1, description = $2, price = $3, updated_at = NOW() WHERE id = $4 AND tenant_id = $5 RETURNING *',
      [name, description, price, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test package not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a test package
router.delete('/:id', authenticate, checkPermission('TestPackages', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;
  try {
    await db.query('DELETE FROM package_tests WHERE package_id = $1', [id]);
    const { rows } = await db.query('DELETE FROM test_packages WHERE id = $1 AND tenant_id = $2 RETURNING *', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Test package not found' });
    }
    res.json({ message: 'Test package deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
