const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all reports
router.get('/', authenticate, checkPermission('Reports', 'list'), async (req, res) => {
  const { tenant_id } = req.user;
  // ... existing filter logic
  try {
    const { rows } = await db.query('SELECT * FROM reports WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new report
router.post('/', authenticate, checkPermission('Reports', 'create'), async (req, res) => {
  const { patient_id, test_id, results } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'INSERT INTO reports (tenant_id, patient_id, test_id, results) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenant_id, patient_id, test_id, results]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single report
router.get('/:id', authenticate, checkPermission('Reports', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM reports WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a report
router.put('/:id', authenticate, checkPermission('Reports', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { results } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE reports SET results = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [results, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a report
router.delete('/:id', authenticate, checkPermission('Reports', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    await db.query('DELETE FROM reports WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Generate a report
router.post('/:id/generate', authenticate, checkPermission('Reports', 'generate'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    // In a real application, this would trigger a background job to generate the report.
    console.log(`Generating report ${id} for tenant ${tenant_id}`);
    res.json({ msg: 'Report generation started' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Download a report
router.get('/:id/download', authenticate, checkPermission('Reports', 'download'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    // In a real application, this would fetch the generated report file and send it.
    console.log(`Downloading report ${id} for tenant ${tenant_id}`);
    res.json({ msg: 'Report downloaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
