const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all roles
router.get('/', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM roles');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new role
router.post('/', authenticate, checkPermission('Users', 'create'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rows } = await db.query('INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single role
router.get('/:id', authenticate, checkPermission('Users', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const role = rows[0];

    const { rows: permissions } = await db.query('SELECT p.id, m.name as module, a.name as action FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id JOIN modules m ON p.module_id = m.id JOIN actions a ON p.action_id = a.id WHERE rp.role_id = $1', [id]);
    role.permissions = permissions;

    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a role
router.put('/:id', authenticate, checkPermission('Users', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;
  try {
    const { rows } = await db.query('UPDATE roles SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [name, description, id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const { rows: existingPermissions } = await db.query('SELECT permission_id FROM role_permissions WHERE role_id = $1', [id]);
    const existingPermissionIds = existingPermissions.map(p => p.permission_id);

    const permissionsToAdd = permissions.filter(p => !existingPermissionIds.includes(p));
    const permissionsToRemove = existingPermissionIds.filter(p => !permissions.includes(p));

    if (permissionsToRemove.length > 0) {
        await db.query('DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = ANY($2::int[])', [id, permissionsToRemove]);
    }

    if (permissionsToAdd.length > 0) {
        const insertPromises = permissionsToAdd.map(permission_id => {
            return db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [id, permission_id]);
        });
        await Promise.all(insertPromises);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Delete a role
router.delete('/:id', authenticate, checkPermission('Users', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);
    await db.query('DELETE FROM roles WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all permissions
router.get('/permissions', authenticate, checkPermission('Users', 'list'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT p.id, m.name as module, a.name as action FROM permissions p JOIN modules m ON p.module_id = m.id JOIN actions a ON p.action_id = a.id ORDER BY m.name, a.name');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
