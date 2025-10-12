import React, { useState } from 'react';
import axios from 'axios';

const Payment = ({ amount, currency = 'INR', onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: order } = await axios.post('/api/razorpay/create-order', {
        amount: amount * 100, // Amount in paise
        currency,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PathoSync',
        description: 'Test Report Payment',
        order_id: order.id,
        handler: async (response) => {
          onPaymentSuccess(response);
        },
        prefill: {
          // You can pre-fill customer details here
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default Payment;
