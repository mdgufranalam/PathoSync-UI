const express = require('express');
const router = express.Router();
const { query } = require('../db/index'); // CHANGE: Import the shared query function

router.get('/', async (req, res) => {
  try {
    // Check database connection using the shared query function
    await query('SELECT 1');
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