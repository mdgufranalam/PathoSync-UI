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
      CREATE TABLE IF NOT EXISTS doctors (
        doctor_id SERIAL PRIMARY KEY,
        tenant_id INT,
        name VARCHAR(255),
        specialization VARCHAR(255),
        qualification VARCHAR(255),
        experience VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        license_number VARCHAR(255),
        hospital_affiliation VARCHAR(255),
        consultation_fee INT,
        address JSONB,
        availability JSONB,
        total_patients INT,
        total_consultations INT,
        rating FLOAT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Doctors table created successfully');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();