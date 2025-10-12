const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const { sendTextMessage, sendPdfMessage } = require('../whatsappService');
const { createSignedUrl } = require('../storageService');

// Send a text message
router.post('/send-text', authenticate, checkPermission('WhatsApp', 'send'), async (req, res) => {
  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ message: 'Missing \'to\' or \'body\' in request.' });
  }

  try {
    await sendTextMessage(to, body);
    res.status(200).json({ message: 'Text message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a PDF report
router.post('/send-report', authenticate, checkPermission('WhatsApp', 'send-report'), async (req, res) => {
  const { to, reportId } = req.body;

  if (!to || !reportId) {
    return res.status(400).json({ message: 'Missing \'to\' or \'reportId\' in request.' });
  }

  try {
    // 1. Generate a signed URL for the report PDF
    const signedUrl = await createSignedUrl(reportId, req.user);

    // 2. Send the PDF via WhatsApp
    await sendPdfMessage(to, signedUrl);

    res.status(200).json({ message: 'PDF report sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
