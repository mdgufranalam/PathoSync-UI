const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, checkPermission } = require('../middleware/auth');

// Get all bills
router.get('/', authenticate, checkPermission('Billing', 'list'), async (req, res) => {
  const { tenant_id } = req.user;
  try {
    const { rows } = await db.query('SELECT * FROM bills WHERE tenant_id = $1', [tenant_id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new bill
router.post('/', authenticate, checkPermission('Billing', 'create'), async (req, res) => {
  const { patient_id, line_items, discount, tax, referring_doctor_id } = req.body;
  const { tenant_id } = req.user;

  try {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      let total = 0;
      line_items.forEach(item => {
        total += item.amount;
      });
      const final_amount = total - discount + tax;

      const { rows: billRows } = await client.query(
        'INSERT INTO bills (tenant_id, patient_id, total_amount, discount, tax, final_amount, referring_doctor_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [tenant_id, patient_id, total, discount, tax, final_amount, referring_doctor_id]
      );
      const bill = billRows[0];

      const itemPromises = line_items.map(item => {
        return client.query('INSERT INTO bill_items (bill_id, description, amount, tenant_id) VALUES ($1, $2, $3, $4)', [bill.id, item.description, item.amount, tenant_id]);
      });
      await Promise.all(itemPromises);

      if (referring_doctor_id) {
        await client.query('INSERT INTO referrals (doctor_id, patient_id, bill_id, tenant_id) VALUES ($1, $2, $3, $4)', [referring_doctor_id, patient_id, bill.id, tenant_id]);
      }

      await client.query('COMMIT');
      res.status(201).json(bill);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single bill
router.get('/:id', authenticate, checkPermission('Billing', 'view'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM bills WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    const bill = rows[0];

    const { rows: items } = await db.query('SELECT * FROM bill_items WHERE bill_id = $1', [id]);
    bill.line_items = items;

    res.json(bill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a bill
router.put('/:id', authenticate, checkPermission('Billing', 'edit'), async (req, res) => {
  const { id } = req.params;
  const { line_items, discount, tax, referring_doctor_id, patient_id } = req.body;
  const { tenant_id } = req.user;

  try {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      let total = 0;
      line_items.forEach(item => {
        total += item.amount;
      });
      const final_amount = total - discount + tax;

      const { rows } = await client.query(
        'UPDATE bills SET total_amount = $1, discount = $2, tax = $3, final_amount = $4, referring_doctor_id = $5, updated_at = NOW() WHERE id = $6 AND tenant_id = $7 RETURNING *',
        [total, discount, tax, final_amount, referring_doctor_id, id, tenant_id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      await client.query('DELETE FROM bill_items WHERE bill_id = $1', [id]);

      const itemPromises = line_items.map(item => {
        return client.query('INSERT INTO bill_items (bill_id, description, amount, tenant_id) VALUES ($1, $2, $3, $4)', [id, item.description, item.amount, tenant_id]);
      });
      await Promise.all(itemPromises);

      await client.query('DELETE FROM referrals WHERE bill_id = $1 AND tenant_id = $2', [id, tenant_id]);
      if (referring_doctor_id) {
        await client.query('INSERT INTO referrals (doctor_id, patient_id, bill_id, tenant_id) VALUES ($1, $2, $3, $4)', [referring_doctor_id, patient_id, id, tenant_id]);
      }

      await client.query('COMMIT');
      res.json(rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a bill
router.delete('/:id', authenticate, checkPermission('Billing', 'delete'), async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  try {
    await db.query('DELETE FROM referrals WHERE bill_id = $1 AND tenant_id = $2', [id, tenant_id]);
    await db.query('DELETE FROM bill_items WHERE bill_id = $1', [id]);
    await db.query('DELETE FROM bills WHERE id = $1 AND tenant_id = $2', [id, tenant_id]);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
