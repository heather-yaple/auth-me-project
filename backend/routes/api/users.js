// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, firstName, lastName, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      // console.log("right before create");
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser
      });
    }
);
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.'),
  handleValidationErrors
];

// Log in
router.post('/login', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    const err = new Error('Login failed');
    err.status = 401;
    return next(err);
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});
// Log out
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Success' });
});
// Restore session user
router.get('/me', requireAuth, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({ user });
  } else {
    return res.json({});
  }
});
// Update user profile
router.put('/:id', requireAuth, async (req, res, next) => {
  const { firstName, lastName, email, username } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.username = username || user.username;

  await user.save();

  return res.json({ user });
});
// Delete user account
router.delete('/:id', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.destroy();
  res.json({ message: 'User deleted successfully' });
});
// Password reset
router.put('/:id/password', requireAuth, async (req, res) => {
  const { password } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = bcrypt.hashSync(password);
  user.hashedPassword = hashedPassword;

  await user.save();
  return res.json({ message: 'Password updated successfully' });
});
// List all users with pagination
router.get('/', async (req, res) => {
  let { page, size } = req.query;
  
  // Convert query params to integers
  page = page ? parseInt(page) : 1;
  size = size ? parseInt(size) : 10;

  const offset = (page - 1) * size;

  const users = await User.findAndCountAll({
    limit: size,
    offset: offset,
    attributes: ['id', 'firstName', 'lastName', 'email', 'username']
  });

  return res.json({
    users: users.rows,
    totalPages: Math.ceil(users.count / size),
    currentPage: page
  });
});

module.exports = router;