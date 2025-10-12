const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;