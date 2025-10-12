import React, { useState } from 'react';
import axios from 'axios';

const PdfGenerator = ({ onGenerationSuccess }) => {
  const [htmlContent, setHtmlContent] = useState('<h1>Hello, PDF!</h1>');
  const [filename, setFilename] = useState('generated-pdf.pdf');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const response = await axios.post('/api/storage/generate-pdf', {
        html: htmlContent,
        filename: filename,
      }, {
        headers: {
          // You'll need to include your auth token here
          // 'Authorization': `Bearer ${token}`
        },
      });

      const fileId = response.data.id;

      // Get the signed URL for the newly created PDF
      const signedUrlResponse = await axios.get(`/api/storage/${fileId}/signed-url`, {
        headers: {
            // 'Authorization': `Bearer ${token}`
        }
      });

      setDownloadUrl(signedUrlResponse.data.signedUrl);

      if (onGenerationSuccess) {
        onGenerationSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'PDF generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h3>PDF Generator</h3>
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        rows={10}
        cols={50}
      /><br/>
      <input 
        type="text" 
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Enter filename"
      /><br/>
      <button onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate PDF'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {downloadUrl && <a href={downloadUrl} target="_blank" rel="noreferrer">Download PDF</a>}
    </div>
  );
};

export default PdfGenerator;
