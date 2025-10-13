const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { generatePdfFromHtml } = require('../pdfService');

// Public endpoint to get report details (for UI)
router.get('/:reportId', async (req, res) => {
  const { reportId } = req.params;
  try {
    // We only need to check if the report exists and is completed.
    const { data: report, error } = await supabase
      .from('reports')
      .select('id, status')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    if (report.status !== 'Completed') {
        return res.status(403).json({ message: 'Report is not yet available for download.' });
    }

    res.status(200).json({ message: 'Report is available.' });

  } catch (err) {
    console.error('Error fetching report for public view:', err.message);
    res.status(500).send('Server Error');
  }
});

// Public endpoint to download a report with mobile verification
router.post('/:reportId/download', async (req, res) => {
  const { reportId } = req.params;
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required.' });
  }

  try {
    // Verify the mobile number matches the patient associated with the report
    const { data: report, error: reportError } = await supabase
        .from('reports')
        .select(`
            id, status, content, 
            patient:patients ( mobile ) 
        `)
        .eq('id', reportId)
        .single();

    if (reportError || !report) {
        return res.status(404).json({ message: 'Report not found.' });
    }
    
    if (report.patient.mobile !== mobileNumber) {
        return res.status(403).json({ message: 'The mobile number does not match our records for this report.' });
    }

    if (report.status !== 'Completed') {
        return res.status(403).json({ message: 'Report is not yet available for download.' });
    }

    // Generate the PDF with the QR code
    const pdfBuffer = await generatePdfFromHtml(report.content, report.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report.id}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating or downloading public report:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;