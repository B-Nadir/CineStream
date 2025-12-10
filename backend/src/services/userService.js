// userService: DB queries for users
const { getPool } = require('../db/mysql');

async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, email, display_name, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createUser({ email, passwordHash, displayName = null }) {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
    [email, passwordHash, displayName]
  );
  return { id: result.insertId, email, display_name: displayName };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
