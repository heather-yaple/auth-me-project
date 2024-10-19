// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }
    // console.log('logging in a user here', user);
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    (req, res) => {
        const { user } = req;
        // console.log('--- user here', user);
        if (user) {
            const safeUser = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
            };
            return res.status(200).json({
              user: safeUser
            });
        } else {
          return res.status(200).json({ user: null });
        }
    }
);
  
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a transport for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email service you're using
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send confirmation email
const sendConfirmationEmail = async (user) => {
  const confirmationToken = crypto.randomBytes(32).toString('hex');

  // Save token to the user's record (you may need to add this field in your database)
  user.confirmationToken = confirmationToken;
  await user.save();

  const url = `http://yourfrontend.com/confirm/${confirmationToken}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Confirm your email',
    html: `<h3>Welcome ${user.username}</h3><p>Please confirm your email by clicking <a href="${url}">here</a></p>`
  });
};

// Sign up user and send email
router.post('/signup', validateSignup, async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({
    email,
    username,
    hashedPassword
  });

  await sendConfirmationEmail(user);

  return res.status(201).json({ message: 'Please confirm your email' });
});

module.exports = router;