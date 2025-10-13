const Razorpay = require('razorpay');
const shortid = require('shortid');

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.error('Razorpay credentials are missing. Make sure to set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
}

// const razorpay = new Razorpay({
//   key_id: razorpayKeyId,
//   key_secret: razorpayKeySecret,
// });

const createOrder = async (amount, currency, receipt) => {
  /*
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
  */
  console.log('Razorpay is not configured. Skipping creating order.');
  return Promise.resolve({ id: `mock_order_${shortid.generate()}` });
};

const processRefund = async (paymentId, amount) => {
  /*
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
  */
  console.log('Razorpay is not configured. Skipping processing refund.');
  return Promise.resolve({ id: `mock_refund_${shortid.generate()}` });
};

module.exports = {
  createOrder,
  processRefund,
};
