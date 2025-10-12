import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppSender = ({ reportId }) => {
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!recipient || !reportId) {
        setError("Recipient number and report are required.");
        return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post('/api/whatsapp/send-report', {
        to: `whatsapp:${recipient}`,
        reportId: reportId,
      }, {
        headers: {
          // You'll need to include your auth token here
          // 'Authorization': `Bearer ${token}`
        },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h3>Send Report via WhatsApp</h3>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Enter recipient phone number with country code"
      /><br/>
      <button onClick={handleSend} disabled={sending || !recipient}>
        {sending ? 'Sending...' : 'Send Report'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Message sent successfully!</p>}
    </div>
  );
};

export default WhatsAppSender;
