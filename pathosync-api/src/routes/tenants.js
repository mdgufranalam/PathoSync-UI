const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const tenantRes = await db.query('SELECT * FROM tenants WHERE id = $1', [id]);

    if (tenantRes.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(tenantRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
