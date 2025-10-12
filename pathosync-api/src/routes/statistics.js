const express = require('express');
const router = express.Router();
const { authenticate, checkPermission } = require('../middleware/auth');
const excel = require('node-excel-export');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const { getStatistics } = require('../statistics');

router.get('/', authenticate, checkPermission('Statistics', 'read'), async (req, res) => {
  const { period } = req.query;
  const tenantId = req.user.tenant_id;

  try {
    const statisticsData = await getStatistics(tenantId, period);
    res.json(statisticsData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/export', authenticate, checkPermission('Statistics', 'export'), async (req, res) => {
  const { format, period } = req.query;
  const tenantId = req.user.tenant_id;

  try {
    const statisticsData = await getStatistics(tenantId, period);

    if (format === 'excel') {
      const styles = {
        headerDark: {
          fill: { fgColor: { rgb: 'FF000000' } },
          font: { color: { rgb: 'FFFFFFFF' }, sz: 14, bold: true, underline: true },
        },
        cell: {
          fill: { fgColor: { rgb: 'FFFFFFFF' } },
        },
      };

      const specification = {
        month: {
          displayName: 'Month',
          headerStyle: styles.headerDark,
          width: 120,
        },
        revenue: {
          displayName: 'Revenue',
          headerStyle: styles.headerDark,
          width: 120,
        },
        patients: {
          displayName: 'Patients',
          headerStyle: styles.headerDark,
          width: 120,
        },
        tests: {
          displayName: 'Tests',
          headerStyle: styles.headerDark,
          width: 120,
        },
      };

      const report = excel.buildExport([
        {
          name: `Statistics for ${period}`,
          specification: specification,
          data: statisticsData.monthlyData,
        },
      ]);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="statistics-${period}.xlsx"`);
      res.send(report);
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="statistics-${period}.pdf"`);
      doc.pipe(res);

      doc.fontSize(25).text(`Statistics for ${period}`, { align: 'center' });
      doc.moveDown();

      const tableTop = 200;
      const item = statisticsData.monthlyData[0];
      const headers = Object.keys(item);
      const rowHeight = 25;
      let y = tableTop;

      // Draw table header
      doc.fontSize(12).font('Helvetica-Bold');
      headers.forEach((header, i) => {
        doc.text(header, 100 + i * 100, y, { width: 90, align: 'left' });
      });
      y += rowHeight;
      doc.fontSize(10).font('Helvetica');

      // Draw table rows
      statisticsData.monthlyData.forEach(item => {
        headers.forEach((header, i) => {
          doc.text(item[header], 100 + i * 100, y, { width: 90, align: 'left' });
        });
        y += rowHeight;
      });

      doc.end();
    } else if (format === 'csv') {
      const json2csv = new Parser();
      const csv = json2csv.parse(statisticsData.monthlyData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="statistics-${period}.csv"`);
      res.send(csv);
    } else {
      res.status(400).send('Invalid format requested');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
