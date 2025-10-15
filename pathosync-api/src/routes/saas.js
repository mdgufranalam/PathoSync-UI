const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all clients
router.get('/clients', authenticate, checkPermission('SaaS', 'view-all-data'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all subscription plans
router.get('/subscription-plans', authenticate, checkPermission('SaaS', 'view-all-data'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM subscription_plans');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get system settings
router.get('/system-settings', authenticate, checkPermission('SaaS', 'view-all-data'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM system_settings');
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update system settings
router.put('/system-settings', authenticate, checkPermission('SaaS', 'manage_billing'), async (req, res) => {
  const { platformName, supportEmail, supportPhone, taxRate, maintenanceMode, allowRegistration } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE system_settings SET platform_name = $1, support_email = $2, support_phone = $3, tax_rate = $4, maintenance_mode = $5, allow_registration = $6 RETURNING *',
      [platformName, supportEmail, supportPhone, taxRate, maintenanceMode, allowRegistration]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update subscription plans
router.put('/subscription-plans', authenticate, checkPermission('SaaS', 'manage_billing'), async (req, res) => {
  const { plans } = req.body;
  try {
    const promises = plans.map(plan => {
      return db.query(
        'UPDATE subscription_plans SET max_clients = $1 WHERE name = $2',
        [plan.maxClients, plan.name]
      );
    });
    await Promise.all(promises);
    res.json({ message: 'Subscription plans updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Bulk action on clients
router.post('/clients/bulk-action', authenticate, checkPermission('SaaS', 'manage_billing'), async (req, res) => {
  const { action, clientIds } = req.body;
  try {
    let query;
    switch (action) {
      case 'activate':
        query = 'UPDATE clients SET subscription_status = \'active\' WHERE id = ANY($1::uuid[])';
        break;
      case 'suspend':
        query = 'UPDATE clients SET subscription_status = \'suspended\' WHERE id = ANY($1::uuid[])';
        break;
      case 'delete':
        query = 'DELETE FROM clients WHERE id = ANY($1::uuid[])';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    await db.query(query, [clientIds]);
    res.json({ message: `Successfully performed ${action} action on ${clientIds.length} clients` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a client
router.delete('/clients/:id', authenticate, checkPermission('SaaS', 'manage_billing'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM clients WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
