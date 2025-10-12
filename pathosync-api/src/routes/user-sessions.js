const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all user sessions
router.get('/', authenticate, checkPermission('UserSessions', 'view'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM user_sessions');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
res.status(500).send('Server error');
  }
});

// Get a single user session
router.get('/:id', authenticate, checkPermission('UserSessions', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM user_sessions WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User session not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new user session
router.post('/', authenticate, checkPermission('UserSessions', 'create'), async (req, res) => {
  const { tenant_id, user_id, token, expires_at, ip_address, user_agent, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO user_sessions (tenant_id, user_id, token, expires_at, ip_address, user_agent, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tenant_id, user_id, token, expires_at, ip_address, user_agent, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a user session
router.put('/:id', authenticate, checkPermission('UserSessions', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id, user_id, token, expires_at, ip_address, user_agent, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE user_sessions SET tenant_id = $1, user_id = $2, token = $3, expires_at = $4, ip_address = $5, user_agent = $6, is_active = $7 WHERE id = $8 RETURNING *',
      [tenant_id, user_id, token, expires_at, ip_address, user_agent, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User session not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a user session
router.delete('/:id', authenticate, checkPermission('UserSessions', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM user_sessions WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User session not found' });
    }
    res.json({ message: 'User session deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
