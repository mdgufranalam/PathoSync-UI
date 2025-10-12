import React, { useState } from 'react';
import axios from 'axios';

const Refund = ({ paymentId }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRefund = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const refundData = { paymentId };
      if (amount) {
        refundData.amount = parseFloat(amount) * 100; // Amount in paise
      }

      await axios.post('/api/razorpay/process-refund', refundData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Process Refund</h4>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount for partial refund"
      />
      <button onClick={handleRefund} disabled={loading}>
        {loading ? 'Refunding...' : 'Refund Payment'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Refund processed successfully!</p>}
    </div>
  );
};

export default Refund;
