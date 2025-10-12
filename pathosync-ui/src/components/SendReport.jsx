import React, { useState } from 'react';
import axios from 'axios';

const SendReport = ({ reportId, patient }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('whatsapp'); // whatsapp, email, or sms
  const [recipient, setRecipient] = useState(patient?.phone || '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!recipient) {
      setError(`Please provide a recipient ${deliveryMethod === 'email' ? 'email' : 'phone number'}.`);
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`/api/reports/${reportId}/send`, {
        channel: deliveryMethod,
        recipient: recipient,
      }, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      });
      setSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setSuccess(false);
        setSending(false);
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || `Failed to send report via ${deliveryMethod}.`);
    } finally {
      setSending(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    // Reset state when opening the modal
    setError(null);
    setSuccess(false);
    setDeliveryMethod('whatsapp');
    setRecipient(patient?.phone || '');
  }

  return (
    <div>
      <button onClick={openModal}>Send Report</button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h3>Send Report</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label>Delivery Method: </label>
              <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Recipient: </label>
              <input
                type={deliveryMethod === 'email' ? 'email' : 'text'}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={deliveryMethod === 'email' ? 'Enter email address' : 'Enter phone number'}
              />
            </div>
            <button onClick={handleSend} disabled={sending}>
              {sending ? 'Sending...' : `Send via ${deliveryMethod}`}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '1rem' }}>Report sent successfully!</p>}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 500px;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SendReport;
