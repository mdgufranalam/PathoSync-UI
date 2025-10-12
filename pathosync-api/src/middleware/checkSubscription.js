const pool = require('../db');

const checkSubscription = (allowedPlans) => async (req, res, next) => {
  try {
    const tenantId = req.user.tenant_id;
    const result = await pool.query('SELECT subscription_plan FROM tenants WHERE id = $1', [tenantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Tenant not found' });
    }

    const subscriptionPlan = result.rows[0].subscription_plan;

    if (!allowedPlans.includes(subscriptionPlan)) {
      return res.status(403).json({ msg: 'Your current subscription plan does not allow you to perform this action' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = checkSubscription;
