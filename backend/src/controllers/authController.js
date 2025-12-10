const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not set in .env — set one before production');
}

async function register(req, res, next) {
  try {
    console.log('DEBUG register req.body =', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, display_name } = req.body;
    const existing = await userService.findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const created = await userService.createUser({ email, passwordHash, displayName: display_name });

    // create JWT
    const token = jwt.sign({ sub: created.id, email: created.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      user: {
        id: created.id,
        email: created.email,
        display_name: created.display_name
      },
      token
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      },
      token
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
