const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

/**
 * Generates a PDF from an HTML string, optionally embedding a QR code in the header.
 * @param {string} html - The HTML content to render into a PDF.
 * @param {string} [reportId] - The ID of the report to embed in the QR code. If provided, a QR code will be added.
 * @returns {Buffer} The generated PDF as a Buffer.
 */
const generatePdfFromHtml = async (html, reportId) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Currently needed for running in containers
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    let pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: "40px",
            right: "40px",
            bottom: "40px",
            left: "40px"
        }
    };

    if (reportId) {
      const reportDownloadUrl = `https://app.pathosync.com/reportdownload/${reportId}`;
      const qrCodeDataURL = await QRCode.toDataURL(reportDownloadUrl, { errorCorrectionLevel: 'H', margin: 1 });
      
      const headerTemplate = `
        <div style="width: 100%; font-size: 9px; padding: 0 25px 0 25px; display: flex; justify-content: flex-end; align-items: flex-start; -webkit-print-color-adjust: exact;">
            <div style="text-align: center;">
                <img src="${qrCodeDataURL}" alt="Scan to download PDF" style="width:70px; height:70px;" />
                <p style="font-size:8px; margin:2px 0 0 0;">Scan to Download</p>
            </div>
        </div>`;
      
      pdfOptions.displayHeaderFooter = true;
      pdfOptions.headerTemplate = headerTemplate;
      pdfOptions.footerTemplate = '<div></div>'; // Empty footer to prevent default page number
      pdfOptions.margin.top = "110px"; // Increase top margin to accommodate the QR code header
    }

    const pdfBuffer = await page.pdf(pdfOptions);
    return pdfBuffer;

  } catch (error) {_
    console.error("Error generating PDF:", error);
    throw new Error('Failed to generate PDF.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { generatePdfFromHtml };
