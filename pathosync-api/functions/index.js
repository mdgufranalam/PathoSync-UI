const functions = require("firebase-functions");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { sendPdfMessage } = require("./whatsappService"); // You'll need to copy whatsappService.js to your functions folder
const { createSignedUrl } = require("./storageService"); // You'll need to copy storageService.js to your functions folder

initializeApp();

exports.onReportGenerated = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const reportData = snap.data();

    const patientPhoneNumber = reportData.patientPhoneNumber; // e.g., from a linked patient document
    const fileId = reportData.fileId; // The ID of the PDF in your storage

    if (!patientPhoneNumber || !fileId) {
      console.log("Missing patient phone number or file ID. Cannot send WhatsApp message.");
      return null;
    }

    try {
      const signedUrl = await createSignedUrl(fileId, { tenant_id: reportData.tenant_id }); // Pass tenant_id for permission checks

      await sendPdfMessage(`whatsapp:${patientPhoneNumber}`, signedUrl);

      console.log(`WhatsApp message sent for report ${context.params.reportId}`);
      return null;
    } catch (error) {
      console.error(`Failed to send WhatsApp message for report ${context.params.reportId}:`, error);
      return null;
    }
  });


exports.messageWebhook = functions.https.onRequest(async (req, res) => {
    const db = getFirestore();
    const message = req.body;

    try {
        await db.collection('incoming_messages').add(message);
        res.status(200).send('Message received and stored.');
    } catch (error) {
        console.error('Error storing incoming message:', error);
        res.status(500).send('Error storing message.');
    }
});
