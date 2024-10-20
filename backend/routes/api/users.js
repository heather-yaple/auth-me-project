const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
    check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a valid first name."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a valid last name."),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
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

    if (Object.values(req.body).some(value => !value)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { common: "All fields are required" },
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const response = {
        message: "User already exists",
        errors: {
          "email": "User with that email already exists"
        },
      };

      if (existingUser.email === email) {
        response.errors.email = "User with that email already exists";
      }

      if (existingUser.username === username) {
        response.errors.username = "User with that username already exists";
      }

      return res.status(500).json(response);
    }

    const user = await User.create({ email, firstName, lastName, username, hashedPassword });

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

module.exports = router;