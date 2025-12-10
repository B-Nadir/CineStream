const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').notEmpty().isEmail().withMessage('Valid email required'),
    body('password')
  .isLength({ min: 6 })
  .withMessage('Password min 6 chars')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
    body('display_name').optional().isLength({ max: 100 })
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
  ],
  login
);

module.exports = router;
