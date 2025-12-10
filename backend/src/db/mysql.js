const mysql = require('mysql2/promise');

let pool;

async function initMySQL() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // quick test query
  await pool.query('SELECT 1');
  console.log('MySQL connected');
}

function getPool() {
  if (!pool) throw new Error('MySQL pool not initialized');
  return pool;
}

module.exports = { initMySQL, getPool };
