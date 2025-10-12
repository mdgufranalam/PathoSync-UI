const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all subscription plans
router.get('/', authenticate, checkPermission('SubscriptionPlans', 'view'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM subscription_plans');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single subscription plan
router.get('/:id', authenticate, checkPermission('SubscriptionPlans', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM subscription_plans WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new subscription plan
router.post('/', authenticate, checkPermission('SubscriptionPlans', 'create'), async (req, res) => {
  const { plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO subscription_plans (plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, is_active]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a subscription plan
router.put('/:id', authenticate, checkPermission('SubscriptionPlans', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, is_active } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE subscription_plans SET plan_code = $1, name = $2, description = $3, monthly_price = $4, yearly_price = $5, max_users = $6, max_patients = $7, max_tests_per_month = $8, max_reports_per_month = $9, max_storage_gb = $10, features = $11, is_active = $12 WHERE id = $13 RETURNING *',
      [plan_code, name, description, monthly_price, yearly_price, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a subscription plan
router.delete('/:id', authenticate, checkPermission('SubscriptionPlans', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM subscription_plans WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
