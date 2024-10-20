// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (email) => {
            const user = await User.findOne({ where: { email } });
            if (user) throw new Error('Email already in use');
        }),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.')
        .custom(async (username) => {
            const user = await User.findOne({ where: { username } });
            if (user) throw new Error('Username already in use');
        }),
    check('firstName').exists({ checkFalsy: true }).withMessage('First Name is required'),
    check('lastName').exists({ checkFalsy: true }).withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up route
router.post('/', validateSignup, async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password); // Correctly hashing the password
    
    try {
        const user = await User.create({ email, username, hashedPassword, firstName, lastName });
        return res.status(201).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to sign up. Please try again.' });
    }
});

// List all users with pagination route
router.get('/', async (req, res) => {
    try {
        let { page, size } = req.query;
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
    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve users. Please try again.' });
    }
});

// Other user routes...

module.exports = router;

