const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all bill items for a given bill
router.get('/', authenticate, checkPermission('Billing', 'view'), async (req, res) => {
  const { bill_id } = req.query;
  try {
    const { rows } = await db.query('SELECT * FROM bill_items WHERE bill_id = $1', [bill_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single bill item
router.get('/:id', authenticate, checkPermission('Billing', 'view'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM bill_items WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new bill item
router.post('/', authenticate, checkPermission('Billing', 'create'), async (req, res) => {
  const { bill_id, item_type, item_id, description, quantity, unit_price, total_price, discount_percentage, discount_amount, tax_percentage, tax_amount, final_amount, is_optional, sort_order } = req.body;

  try {
    const { rows } = await db.query(
      'INSERT INTO bill_items (bill_id, item_type, item_id, description, quantity, unit_price, total_price, discount_percentage, discount_amount, tax_percentage, tax_amount, final_amount, is_optional, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [bill_id, item_type, item_id, description, quantity, unit_price, total_price, discount_percentage, discount_amount, tax_percentage, tax_amount, final_amount, is_optional, sort_order]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a bill item
router.put('/:id', authenticate, checkPermission('Billing', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { bill_id, item_type, item_id, description, quantity, unit_price, total_price, discount_percentage, discount_amount, tax_percentage, tax_amount, final_amount, is_optional, sort_order } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE bill_items SET bill_id = $1, item_type = $2, item_id = $3, description = $4, quantity = $5, unit_price = $6, total_price = $7, discount_percentage = $8, discount_amount = $9, tax_percentage = $10, tax_amount = $11, final_amount = $12, is_optional = $13, sort_order = $14 WHERE id = $15 RETURNING *',
      [bill_id, item_type, item_id, description, quantity, unit_price, total_price, discount_percentage, discount_amount, tax_percentage, tax_amount, final_amount, is_optional, sort_order, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a bill item
router.delete('/:id', authenticate, checkPermission('Billing', 'delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM bill_items WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill item not found' });
    }
    res.json({ message: 'Bill item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
