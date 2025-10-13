const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio WhatsApp-enabled number, e.g., 'whatsapp:+14155238886'

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('Twilio credentials are missing. Make sure to set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
}

// const client = twilio(accountSid, authToken);

/**
 * Sends a text message via WhatsApp.
 * @param {string} to - The recipient's WhatsApp number (e.g., 'whatsapp:+1234567890').
 * @param {string} body - The message content.
 * @returns {Promise<object>} The Twilio message object.
 */
const sendTextMessage = async (to, body) => {
  /*
  try {
    const message = await client.messages.create({
      from: twilioPhoneNumber,
      to: to,
      body: body,
    });
    console.log(`Message sent with SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp text message:', error.message);
    throw new Error('Failed to send WhatsApp message.');
  }
  */
    console.log('Twilio is not configured. Skipping sending text message.');
    return Promise.resolve({});
};

/**
 * Sends a PDF file via WhatsApp.
 * @param {string} to - The recipient's WhatsApp number (e.g., 'whatsapp:+1234567890').
 * @param {string} mediaUrl - A publicly accessible URL to the PDF file.
 * @returns {Promise<object>} The Twilio message object.
 */
const sendPdfMessage = async (to, mediaUrl) => {
  /*
  try {
    const message = await client.messages.create({
      from: twilioPhoneNumber,
      to: to,
      mediaUrl: [mediaUrl],
    });
    console.log(`Media message sent with SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp PDF message:', error.message);
    throw new Error('Failed to send WhatsApp PDF.');
  }
  */
    console.log('Twilio is not configured. Skipping sending PDF.');
    return Promise.resolve({});
};

module.exports = {
  sendTextMessage,
  sendPdfMessage,
};
