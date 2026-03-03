require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'bioarchive',
  user: process.env.DB_USER || 'bioarchive_user',
  password: process.env.DB_PASSWORD || '',
});

async function migrate() {
  console.log('[MIGRATE] Veritabani semasini olusturuyor...');

  try {
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('[MIGRATE] Sema basariyla olusturuldu!');
  } catch (err) {
    console.error('[MIGRATE] Hata:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
