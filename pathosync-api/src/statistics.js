const pool = require('./db');

async function getStatistics(tenantId, period) {
  let startDate, endDate;
  endDate = new Date();

  switch (period) {
    case '7days':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '3months':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '1year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      throw new Error('Invalid period specified');
  }

  const dailyRevenueQuery = pool.query(
    `SELECT TO_CHAR(bill_date, 'YYYY-MM-DD') as date, SUM(total_amount) as revenue, COUNT(id) as bills
     FROM bills
     WHERE tenant_id = $1 AND bill_date BETWEEN $2 AND $3
     GROUP BY date
     ORDER BY date ASC`,
    [tenantId, startDate, endDate]
  );

  const monthlyRevenueQuery = pool.query(
    `SELECT TO_CHAR(bill_date, 'YYYY-MM') as month, SUM(total_amount) as revenue, COUNT(id) as bills
     FROM bills
     WHERE tenant_id = $1 AND bill_date BETWEEN $2 AND $3
     GROUP BY month
     ORDER BY month ASC`,
    [tenantId, startDate, endDate]
  );

  const testCategoryQuery = pool.query(
    `SELECT tc.name, COUNT(bi.id) as value
     FROM bill_items bi
     JOIN tests t ON bi.test_id = t.id
     JOIN test_categories tc ON t.category_id = tc.id
     WHERE bi.tenant_id = $1 AND bi.created_at BETWEEN $2 AND $3
     GROUP BY tc.name`,
    [tenantId, startDate, endDate]
  );

  const topTestsQuery = pool.query(
    `SELECT t.name, COUNT(bi.id) as count, SUM(bi.final_amount) as revenue
     FROM bill_items bi
     JOIN tests t ON bi.test_id = t.id
     WHERE bi.tenant_id = $1 AND bi.created_at BETWEEN $2 AND $3
     GROUP BY t.name
     ORDER BY count DESC
     LIMIT 5`,
    [tenantId, startDate, endDate]
  );

  const keyMetricsQuery = pool.query(
    `SELECT
       COUNT(id) as totalBills,
       SUM(total_amount) as totalRevenue,
       SUM(discount_amount) as totalDiscount,
       SUM(total_amount) - SUM(discount_amount) as netRevenue,
       AVG(total_amount) as avgBillValue,
       (SELECT COUNT(id) FROM patients WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3) as totalPatients,
       (SELECT COUNT(id) FROM patients WHERE tenant_id = $1 AND created_at < $2 AND id IN (SELECT patient_id FROM bills WHERE tenant_id = $1 AND bill_date BETWEEN $2 AND $3)) as repeatPatients,
       (SELECT COUNT(id) FROM bill_items WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3) as totalTests
     FROM bills
     WHERE tenant_id = $1 AND bill_date BETWEEN $2 AND $3`,
    [tenantId, startDate, endDate]
  );

  const billStatusQuery = pool.query(
    `SELECT payment_status as status, COUNT(id) as count
     FROM bills
     WHERE tenant_id = $1 AND bill_date BETWEEN $2 AND $3
     GROUP BY payment_status`,
    [tenantId, startDate, endDate]
  );

  const patientAgeQuery = pool.query(
    `SELECT
        CASE
            WHEN age_years BETWEEN 0 AND 18 THEN '0-18'
            WHEN age_years BETWEEN 19 AND 30 THEN '19-30'
            WHEN age_years BETWEEN 31 AND 45 THEN '31-45'
            WHEN age_years BETWEEN 46 AND 60 THEN '46-60'
            ELSE '60+'
        END as range,
        COUNT(id) as count
     FROM patients
     WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3
     GROUP BY range`,
    [tenantId, startDate, endDate]
  );

  const [dailyRevenue, monthlyRevenue, testCategory, topTests, keyMetrics, billStatus, patientAge] = await Promise.all([
    dailyRevenueQuery,
    monthlyRevenueQuery,
    testCategoryQuery,
    topTestsQuery,
    keyMetricsQuery,
    billStatusQuery,
    patientAgeQuery,
  ]);

  const totalBills = keyMetrics.rows[0].totalbills;
  const billStatusDistribution = billStatus.rows.map(row => ({
    ...row,
    percentage: totalBills > 0 ? (row.count / totalBills) * 100 : 0,
  }));

  return {
    dailyRevenueData: dailyRevenue.rows,
    monthlyData: monthlyRevenue.rows,
    testCategoryData: testCategory.rows.map(row => ({ ...row, color: '#' + Math.floor(Math.random()*16777215).toString(16) })),
    topTests: topTests.rows,
    keyMetrics: keyMetrics.rows[0],
    billStatusDistribution,
    patientAgeDistribution: patientAge.rows,
  };
}

module.exports = { getStatistics };
