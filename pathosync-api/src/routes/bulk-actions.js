const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { checkPermission } = require('../middleware/auth'); // Assuming you have this middleware

router.post('/bulk-action', checkPermission('Users Management', 'edit'), async (req, res) => {
  const { action, userIds } = req.body;
  const results = [];

  if (!action || !userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  for (const userId of userIds) {
    let result;
    try {
      switch (action) {
        case 'activate':
          result = await supabase.from('users').update({ status: 'Active' }).eq('id', userId);
          break;
        case 'deactivate':
          result = await supabase.from('users').update({ status: 'Inactive' }).eq('id', userId);
          break;
        case 'delete':
          // You might want to add more checks here, e.g., not allowing self-delete
          result = await supabase.from('users').delete().eq('id', userId);
          break;
        default:
          return res.status(400).json({ message: `Invalid action: ${action}` });
      }

      if (result.error) throw result.error;
      results.push({ userId, success: true });

    } catch (error) {
      results.push({ userId, success: false, error: error.message });
    }
  }

  res.json({ results });
});

module.exports = router;
