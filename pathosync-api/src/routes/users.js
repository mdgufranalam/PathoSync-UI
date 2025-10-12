const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all users
router.get('/', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new user
router.post('/', authenticate, checkPermission('Users', 'create'), async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  const { tenant_id } = req.user;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await db.query(
      'INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role',
      [tenant_id, email, hashedPassword, first_name, last_name, role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single user
router.get('/:id', authenticate, checkPermission('Users', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get users by role
router.get('/role/:roleName', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  const { roleName } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE role = $1 AND tenant_id = $2', [roleName, tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update a user
router.put('/:id', authenticate, checkPermission('Users', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, role, is_active } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(
      'UPDATE users SET email = $1, first_name = $2, last_name = $3, role = $4, is_active = $5, updated_at = NOW() WHERE id = $6 AND tenant_id = $7 RETURNING id, email, first_name, last_name, role, is_active',
      [email, first_name, last_name, role, is_active, id, tenant_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/:id', authenticate, checkPermission('Users', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    await db.query('DELETE FROM users WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Assign roles to a user
router.post('/:id/roles', authenticate, checkPermission('Users', 'assign-roles'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('UPDATE users SET role = $1 WHERE id = $2 AND tenant_id = $3 RETURNING id, role', [role, id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
