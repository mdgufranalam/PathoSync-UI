import React from 'react';

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  timestamp: number;
}

const PaymentReceipt = ({ paymentDetails }: { paymentDetails: PaymentDetails }) => {
  const { paymentId, orderId, amount, currency, timestamp } = paymentDetails;

  const printReceipt = () => {
    const receiptElement = document.getElementById('payment-receipt');
    if (receiptElement) {
        const receiptContent = receiptElement.innerHTML;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>Payment Receipt</title></head><body>${receiptContent}</body></html>`);
            printWindow.document.close();
            printWindow.print();
        } else {
            alert('Please allow popups to print the receipt.');
        }
    }
  };

  return (
    <div>
      <div id="payment-receipt">
        <h3>Payment Receipt</h3>
        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Amount:</strong> {amount / 100} {currency}</p>
        <p><strong>Date:</strong> {new Date(timestamp).toLocaleString()}</p>
      </div>
      <button onClick={printReceipt}>Print Receipt</button>
    </div>
  );
};

export default PaymentReceipt;
