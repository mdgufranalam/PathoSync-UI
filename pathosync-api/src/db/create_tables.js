const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        report_id SERIAL PRIMARY KEY,
        tenant_id INT,
        report_no VARCHAR(255),
        patient_name VARCHAR(255),
        patient_age INT,
        patient_gender VARCHAR(255),
        patient_phone VARCHAR(255),
        doctor_name VARCHAR(255),
        status VARCHAR(255),
        report_type VARCHAR(255),
        technician VARCHAR(255),
        verified_by VARCHAR(255),
        remarks TEXT,
        impression TEXT,
        clinical_history TEXT,
        specimen_type VARCHAR(255),
        collection_time TIMESTAMP
      )
    `);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();