import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpiPayment = ({ amount, tenantId, onPaymentSuccess, onPaymentError }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQrCode = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post('/api/upi/generate-qr', {
          amount,
          tenantId,
        });
        setQrCode(data.qrCode);
        onPaymentSuccess();
      } catch (error) {
        onPaymentError(error);
      }
      setLoading(false);
    };

    fetchQrCode();
  }, [amount, tenantId, onPaymentSuccess, onPaymentError]);

  return (
    <div>
      {loading && <p>Generating QR code...</p>}
      {qrCode && (
        <div>
          <img src={qrCode} alt="UPI QR Code" />
          <p>Scan the QR code with your UPI app to complete the payment.</p>
        </div>
      )}
    </div>
  );
};

export default UpiPayment;
