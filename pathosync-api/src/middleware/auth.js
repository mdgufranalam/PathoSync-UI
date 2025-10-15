const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data ) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token.' });
    }
    try {
      const { rows } = await db.query('SELECT id, role_id, tenant_id FROM users WHERE id = $1', [data.user.id]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Unauthorized: User not found.'+user.userId });
      }
      req.user = {
        id: rows[0].id,
        role_id: rows[0].role_id,
        tenant_id: rows[0].tenant_id
      };
      next();
    } catch (dbErr) {
      console.error('Error during authentication middleware:', dbErr.message);
      res.status(500).send('Server error during authentication.');
    }
  });
};

const checkPermission = (module, action) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).send('Unauthorized: Not authenticated.');
    }
    const { id: userId, role_id: roleId } = req.user;

    try {
      const { rows: permissionRows } = await db.query(
        `SELECT 1
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         JOIN modules m ON p.module_id = m.id
         JOIN actions a ON p.action_id = a.id
         WHERE rp.role_id = $1 AND m.name = $2 AND a.name = $3`, [roleId, module, action]);

      if (permissionRows.length > 0) {
        return next();
      }

      // Check for user-specific override
      const { rows: userPermissionRows } = await db.query(
        `SELECT up.has_permission
         FROM user_permissions up
         JOIN permissions p ON up.permission_id = p.id
         JOIN modules m ON p.module_id = m.id
         JOIN actions a ON p.action_id = a.id
         WHERE up.user_id = $1 AND m.name = $2 AND a.name = $3`, [userId, module, action]);

      if (userPermissionRows.length > 0 && userPermissionRows[0].has_permission) {
        return next();
      }
      
      if (userPermissionRows.length > 0 && !userPermissionRows[0].has_permission) {
        return res.status(403).send(`Forbidden: You do not have the '${action}' permission on the '${module}' module.`);
      }

      res.status(403).send(`Forbidden: You do not have the '${action}' permission on the '${module}' module.`);
    } catch (err) {
      console.error('Error in checkPermission middleware:', err.message);
      res.status(500).send('Server error during permission check.');
    }
  };
};

module.exports = {
  authenticate,
  checkPermission,
};
