const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { authenticate, checkPermission } = require('../middleware/auth');

// ========================
// GET: All Users (Tenant Scoped)
// ========================
router.get('/', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.gender,
        u.phone,
        u.department,
        u.designation,
        u.city,
        u.state,
        u.is_active,
        r.name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.tenant_id = $1
      ORDER BY u.first_name ASC
    `, [tenant_id]);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// POST: Create New User (Tenant Scoped)
// ========================
router.post('/', authenticate, checkPermission('Users', 'create'), async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    gender,
    department,
    designation,
    address,
    city,
    state,
    pincode,
    role_id,
    is_active
  } = req.body;
  const { tenant_id } = req.user;

  if (!email || !password || !first_name || !last_name || !role_id) {
    return res.status(400).json({ message: 'Email, Password, First Name, Last Name and Role are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (
        tenant_id, email, password_hash, first_name, last_name, phone, gender,
        department, designation, address, city, state, pincode,
        is_active, role_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,
        COALESCE($14, TRUE), $15
      )
      RETURNING id, email, first_name, last_name, role_id, is_active
    `;

    const { rows } = await db.query(insertQuery, [
      tenant_id, email, hashedPassword, first_name, last_name, phone, gender,
      department, designation, address, city, state, pincode,
      is_active, role_id
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// GET: Single User by ID (Tenant Scoped)
// ========================
router.get('/:id', authenticate, checkPermission('Users', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name,u.gender, u.phone,
        u.department, u.designation, u.address, u.city, u.state, u.pincode,
        u.is_active, r.name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1 AND u.tenant_id = $2
    `, [id, tenant_id]);

    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// PUT: Update User (Tenant Scoped)
// ========================
router.put('/:id', authenticate, checkPermission('Users', 'edit'), async (req, res) => {
  const { id } = req.params;
  const {
    email,
    first_name,
    last_name,
    phone,
    gender,
    department,
    designation,
    address,
    city,
    state,
    pincode,
    role_id,
    is_active
  } = req.body;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query(`
      UPDATE users SET
        email = COALESCE($1, email),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        phone = COALESCE($4, phone),
        gender = COALESCE($5, gender),
        department = COALESCE($6, department),
        designation = COALESCE($7, designation),
        address = COALESCE($8, address),
        city = COALESCE($9, city),
        state = COALESCE($10, state),
        pincode = COALESCE($11, pincode),
        role_id = COALESCE($12, role_id),
        is_active = COALESCE($13, is_active),
        updated_at = NOW()
      WHERE id = $14 AND tenant_id = $15
      RETURNING id, email, first_name, last_name, role_id, is_active
    `, [
      email, first_name, last_name, phone, gender,
      department, designation, address, city, state,
      pincode, role_id, is_active, id, tenant_id
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// DELETE: User (Tenant Scoped)
// ========================
router.delete('/:id', authenticate, checkPermission('Users', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 AND tenant_id = $2 RETURNING id', [id, tenant_id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: 'User not found' });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server Error');
  }
});

// ========================
// POST: Assign Role to User (Tenant Scoped)
// ========================
router.post('/:id/role', authenticate, checkPermission('Users', 'manage_users'), async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;
  const { tenant_id } = req.user;

  if (!role_id) return res.status(400).json({ message: 'role_id is required.' });

  try {
    const { rows } = await db.query(
      'UPDATE users SET role_id = $1 WHERE id = $2 AND tenant_id = $3 RETURNING id, role_id',
      [role_id, id, tenant_id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error assigning role:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
