const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { validateSignup } = require('./users'); // Import validateSignup
const usersRouter = require('./users');

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors,
];

// Login handler
const loginHandler = async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = { credential: 'The provided credentials were invalid.' };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });
};

// Log in route
router.post('/login', validateLogin, loginHandler);

// Log out route
router.delete('/logout', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

// Restore session user route
router.get('/me', (req, res) => {
  const { user } = req;
  const safeUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      }
    : null;

  return res.status(200).json({ user: safeUser });
});

// Send confirmation email function
const sendConfirmationEmail = async ({ id, email, username }) => {
  // Logic to send confirmation email goes here
  return true;
};

// Sign up route
router.post('/signup', validateSignup, async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({
    email,
    username,
    hashedPassword,
  });

  await sendConfirmationEmail(user); // Ensure this function is implemented

  return res.status(201).json({ message: 'Please confirm your email' });
});

module.exports = router;
