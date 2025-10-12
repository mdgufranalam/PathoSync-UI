const Razorpay = require('razorpay');
const shortid = require('shortid');

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.error('Razorpay credentials are missing. Make sure to set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

/**
 * Creates a Razorpay order.
 * @param {number} amount - The order amount in the smallest currency unit (e.g., paise for INR).
 * @param {string} currency - The currency of the order (e.g., 'INR').
 * @param {string} receipt - A unique receipt ID for the order.
 * @returns {Promise<object>} The Razorpay order object.
 */
const createOrder = async (amount, currency, receipt) => {
  const options = {
    amount, // amount in the smallest currency unit
    currency,
    receipt: receipt || `receipt_${shortid.generate()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    throw new Error('Failed to create Razorpay order.');
  }
};

/**
 * Processes a full or partial refund.
 * @param {string} paymentId - The ID of the payment to be refunded.
 * @param {number} [amount] - The amount to be refunded. If not provided, a full refund is processed.
 * @returns {Promise<object>} The Razorpay refund object.
 */
const processRefund = async (paymentId, amount) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount,
      speed: 'normal', // or 'optimum' for faster refunds
    });
    return refund;
  } catch (error) {
    console.error('Error processing Razorpay refund:', error.message);
    throw new Error('Failed to process Razorpay refund.');
  }
};

module.exports = {
  createOrder,
  processRefund,
};
