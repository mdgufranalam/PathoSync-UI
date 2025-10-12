const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all permissions
router.get('/', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT p.id, m.name as module, a.name as action FROM permissions p JOIN modules m ON p.module_id = m.id JOIN actions a ON p.action_id = a.id ORDER BY m.name, a.name');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
