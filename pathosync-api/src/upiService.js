const QRCode = require('qrcode');

/**
 * Generates a UPI QR code.
 * @param {string} upiId - The UPI ID to receive the payment.
 * @param {number} amount - The amount to be paid.
 * @param {string} [name] - The name of the payee.
 * @returns {Promise<string>} A data URL representing the QR code image.
 */
const generateUpiQrCode = async (upiId, amount, name) => {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name || 'PathoSync')}&am=${amount}&cu=INR`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating UPI QR code:', error);
    throw new Error('Failed to generate UPI QR code.');
  }
};

module.exports = { generateUpiQrCode };
