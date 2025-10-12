const express = require('express');
const router = express.Router();
const { createOrder, processRefund } = require('../razorpayService');

// Create a Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ message: 'Missing required fields: amount, currency.' });
  }

  try {
    const order = await createOrder(amount, currency, receipt);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process a refund
router.post('/process-refund', async (req, res) => {
  const { paymentId, amount } = req.body;

  if (!paymentId) {
    return res.status(400).json({ message: 'Missing required field: paymentId.' });
  }

  try {
    const refund = await processRefund(paymentId, amount);
    res.status(200).json(refund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle Razorpay webhooks
router.post('/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    // Signature is valid, process the event
    console.log('Razorpay webhook event received:', req.body.event);
    // You can add your logic here to handle different events
    // For example, update the payment status in your database
  } else {
    console.warn('Invalid Razorpay webhook signature.');
  }

  res.status(200).json({ status: 'ok' });
});

module.exports = router;
