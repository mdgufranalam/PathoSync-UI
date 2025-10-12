const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all tenants
router.get('/', authenticate, checkPermission('Tenants', 'list'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tenants');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new tenant
router.post('/', authenticate, checkPermission('Tenants', 'create'), async (req, res) => {
  const {
    name,
    subdomain,
    domain,
    contact_person,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    gst_number,
    pan_number,
    license_number,
    nabl_accreditation,
    iso_certification,
    subscription_plan,
    subscription_status,
    subscription_start_date,
    subscription_end_date,
    trial_end_date,
    max_users,
    max_patients,
    max_tests_per_month,
    max_reports_per_month,
    max_storage_gb,
    features,
    settings,
    whatsapp_config,
    email_config,
    sms_config,
    payment_gateway_config,
    logo_url,
    letterhead_url,
    signature_url,
    brand_colors,
    billing_address,
    billing_email,
    current_balance,
    credit_limit,
    created_by,
    is_active,
    gdpr_compliant,
    hipaa_compliant,
    data_encryption_enabled
  } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO tenants (name, subdomain, domain, contact_person, email, phone, address, city, state, country, pincode, gst_number, pan_number, license_number, nabl_accreditation, iso_certification, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, trial_end_date, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, settings, whatsapp_config, email_config, sms_config, payment_gateway_config, logo_url, letterhead_url, signature_url, brand_colors, billing_address, billing_email, current_balance, credit_limit, created_by, is_active, gdpr_compliant, hipaa_compliant, data_encryption_enabled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45) RETURNING *',
      [name, subdomain, domain, contact_person, email, phone, address, city, state, country, pincode, gst_number, pan_number, license_number, nabl_accreditation, iso_certification, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, trial_end_date, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, settings, whatsapp_config, email_config, sms_config, payment_gateway_config, logo_url, letterhead_url, signature_url, brand_colors, billing_address, billing_email, current_balance, credit_limit, created_by, is_active, gdpr_compliant, hipaa_compliant, data_encryption_enabled]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single tenant
router.get('/:id', authenticate, checkPermission('Tenants', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM tenants WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a tenant
router.put('/:id', authenticate, checkPermission('Tenants', 'edit'), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    subdomain,
    domain,
    contact_person,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    gst_number,
    pan_number,
    license_number,
    nabl_accreditation,
    iso_certification,
    subscription_plan,
    subscription_status,
    subscription_start_date,
    subscription_end_date,
    trial_end_date,
    max_users,
    max_patients,
    max_tests_per_month,
    max_reports_per_month,
    max_storage_gb,
    features,
    settings,
    whatsapp_config,
    email_config,
    sms_config,
    payment_gateway_config,
    logo_url,
    letterhead_url,
    signature_url,
    brand_colors,
    billing_address,
    billing_email,
    current_balance,
    credit_limit,
    is_active,
    gdpr_compliant,
    hipaa_compliant,
    data_encryption_enabled
  } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE tenants SET name = $1, subdomain = $2, domain = $3, contact_person = $4, email = $5, phone = $6, address = $7, city = $8, state = $9, country = $10, pincode = $11, gst_number = $12, pan_number = $13, license_number = $14, nabl_accreditation = $15, iso_certification = $16, subscription_plan = $17, subscription_status = $18, subscription_start_date = $19, subscription_end_date = $20, trial_end_date = $21, max_users = $22, max_patients = $23, max_tests_per_month = $24, max_reports_per_month = $25, max_storage_gb = $26, features = $27, settings = $28, whatsapp_config = $29, email_config = $30, sms_config = $31, payment_gateway_config = $32, logo_url = $33, letterhead_url = $34, signature_url = $35, brand_colors = $36, billing_address = $37, billing_email = $38, current_balance = $39, credit_limit = $40, is_active = $41, gdpr_compliant = $42, hipaa_compliant = $43, data_encryption_enabled = $44, updated_at = NOW() WHERE id = $45 RETURNING *',
      [name, subdomain, domain, contact_person, email, phone, address, city, state, country, pincode, gst_number, pan_number, license_number, nabl_accreditation, iso_certification, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, trial_end_date, max_users, max_patients, max_tests_per_month, max_reports_per_month, max_storage_gb, features, settings, whatsapp_config, email_config, sms_config, payment_gateway_config, logo_url, letterhead_url, signature_url, brand_colors, billing_address, billing_email, current_balance, credit_limit, is_active, gdpr_compliant, hipaa_compliant, data_encryption_enabled, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a tenant
router.delete('/:id', authenticate, checkPermission('Tenants', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tenants WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Assign tenant admins
router.post('/:id/admins', authenticate, checkPermission('Tenants', 'assign-admin'), async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    // In a real application, you would have more robust logic to ensure the user exists
    // and to handle potential errors.
    await db.query('UPDATE users SET role = $1 WHERE id = $2 AND tenant_id = $3', ['admin', user_id, id]);
    res.json({ msg: 'Admin assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
