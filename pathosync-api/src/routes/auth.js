const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, tenant_name } = req.body;

  try {
    // Create a new tenant
    const tenantRes = await db.query('INSERT INTO tenants (name) VALUES ($1) RETURNING id', [tenant_name]);
    const tenant_id = tenantRes.rows[0].id;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const userRes = await db.query(
      'INSERT INTO users (email, password, tenant_id, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [email, hashedPassword, tenant_id, 'admin']
    );

    res.status(201).json(userRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Password' });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        tenant_id: user.tenant_id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  // In a real application, you might want to blacklist the token.
  // For this example, we'll just send a success message.
  res.json({ msg: 'Logged out successfully' });
});

// Password Reset
router.post('/password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    // In a real application, you would send an email with a reset link.
    // For this example, we'll just log a message.
    console.log(`Password reset requested for email: ${email}`);
    res.json({ msg: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Token Refresh
router.post('/token-refresh', authenticate, async (req, res) => {
  const { id, tenant_id, role } = req.user;

  try {
    const payload = {
      user: {
        id,
        tenant_id,
        role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const userRes = await db.query('SELECT id, email, role, tenant_id FROM users WHERE id = $1', [req.user.id]);
    res.json(userRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
