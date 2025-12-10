const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET;

function unauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized' });
}

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return unauthorized(res);

    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.sub) return unauthorized(res);

    const user = await userService.findUserById(payload.sub);
    if (!user) return unauthorized(res);

    // attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error', err);
    return unauthorized(res);
  }
}

module.exports = { requireAuth };
