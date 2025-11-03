const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddle = require('../middleware/authMiddleware');

router.post('/register',
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  authController.register
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  authController.login
);

router.get('/me', authMiddle, authController.me);

module.exports = router;