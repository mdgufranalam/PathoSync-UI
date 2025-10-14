const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      error: err.message 
    });
  }
});

module.exports = router;