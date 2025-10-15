const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const { role, userId } = req.query;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  try {
    const permissions = {};

    // Get role permissions
    const rolePermissionsRes = await db.query(
      `SELECT m.name as module, a.name as action
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       JOIN modules m ON p.module_id = m.id
       JOIN actions a ON p.action_id = a.id
       JOIN roles r ON rp.role_id = r.id
       WHERE r.name = $1`,
      [role]
    );

    for (const row of rolePermissionsRes.rows) {
      if (!permissions[row.module]) {
        permissions[row.module] = {};
      }
      permissions[row.module][row.action] = true;
    }

    // Get user-specific permissions
    if (userId) {
      const userPermissionsRes = await db.query(
        `SELECT m.name as module, a.name as action, up.has_permission
         FROM user_permissions up
         JOIN permissions p ON up.permission_id = p.id
         JOIN modules m ON p.module_id = m.id
         JOIN actions a ON p.action_id = a.id
         WHERE up.user_id = $1`,
        [userId]
      );

      for (const row of userPermissionsRes.rows) {
        if (!permissions[row.module]) {
          permissions[row.module] = {};
        }
        permissions[row.module][row.action] = row.has_permission;
      }
    }

    res.json(permissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
