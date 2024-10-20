// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
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
    const hashedPassword = bcrypt.hashSync(password);
    
    try {
        const user = await User.create({ email, username, hashedPassword, firstName, lastName });
        const safeUser = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username };

        await setTokenCookie(res, safeUser);
        return res.status(201).json({ user: safeUser });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to sign up. Please try again.' });
    }
});

// Validation for login
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required.'),
    handleValidationErrors
];

// Log in route
router.post('/login', validateLogin, async (req, res) => {
    const { credential, password } = req.body;

    try {
        const user = await User.findOne({ where: { [Op.or]: { username: credential, email: credential } } });

        if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const safeUser = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username };
        await setTokenCookie(res, safeUser);
        return res.json({ user: safeUser });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to log in. Please try again.' });
    }
});

// Log out route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Success' });
});

// Restore session user route
router.get('/me', requireAuth, (req, res) => {
    const { user } = req;
    return res.json({ user: user || {} });
});

// Update user profile route
router.put('/:id', requireAuth, async (req, res) => {
    const { firstName, lastName, email, username } = req.body;

    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) return res.status(400).json({ message: 'Email already in use' });
        }

        if (username) {
            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) return res.status(400).json({ message: 'Username already in use' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.username = username || user.username;

        await user.save();
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update user profile. Please try again.' });
    }
});

// Delete user account route
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete user. Please try again.' });
    }
});

// Password reset route
router.put('/:id/password', requireAuth, async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = bcrypt.hashSync(password);
        user.hashedPassword = hashedPassword;

        await user.save();
        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update password. Please try again.' });
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

module.exports = router;
