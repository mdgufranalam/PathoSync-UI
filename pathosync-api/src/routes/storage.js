const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate, checkPermission } = require('../middleware/auth');
const { uploadFile, createSignedUrl } = require('../storageService');
const { generatePdfFromHtml } = require('../pdfService');

const upload = multer({ storage: multer.memoryStorage() });

// Upload a file
router.post('/upload', authenticate, checkPermission('Storage', 'upload'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const fileMetadata = await uploadFile(req.file, req.user);
    res.status(201).json(fileMetadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a signed URL for a file
router.get('/:id/signed-url', authenticate, checkPermission('Storage', 'download'), async (req, res) => {
  try {
    const signedUrl = await createSignedUrl(req.params.id, req.user);
    res.json({ signedUrl });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Generate a PDF and upload it
router.post('/generate-pdf', authenticate, checkPermission('Storage', 'generate-pdf'), async (req, res) => {
  const { html, filename } = req.body;

  if (!html || !filename) {
    return res.status(400).json({ message: 'Missing html or filename.' });
  }

  try {
    const pdfBuffer = await generatePdfFromHtml(html);
    
    const pdfFile = {
      originalname: filename,
      mimetype: 'application/pdf',
      buffer: pdfBuffer,
      size: pdfBuffer.length,
    };

    const fileMetadata = await uploadFile(pdfFile, req.user);
    res.status(201).json(fileMetadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
