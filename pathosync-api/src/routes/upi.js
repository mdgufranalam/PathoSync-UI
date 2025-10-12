const express = require('express');
const router = express.Router();
const { generateUpiQrCode } = require('../upiService');
const { getTenantUpiId } = require('../tenantService'); // Assuming you have a service to get tenant details

// Generate UPI QR Code
router.post('/generate-qr', async (req, res) => {
  const { amount, tenantId } = req.body;

  if (!amount || !tenantId) {
    return res.status(400).json({ message: 'Missing required fields: amount, tenantId.' });
  }

  try {
    const upiId = await getTenantUpiId(tenantId);
    if (!upiId) {
      return res.status(404).json({ message: 'UPI ID not configured for this tenant.' });
    }

    const qrCode = await generateUpiQrCode(upiId, amount);
    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
