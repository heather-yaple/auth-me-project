// backend/routes/api/session.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
router.post('/', validateLogin, async (req, res) => {
    const { credential, password } = req.body;

    try {
        const user = await User.findOne({ where: { [Op.or]: { username: credential, email: credential } } });

        // Check if user exists and password matches
        if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        await setTokenCookie(res, safeUser);
        return res.json({ user: safeUser });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to log in. Please try again.' });
    }
});

// Log out route
router.delete('/', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Successfully logged out' });
});

// Restore session user route
router.get('/me', requireAuth, (req, res) => {
    const { user } = req;
    return res.json({ user: user || {} });
});

// Additional routes can be added here for other functionalities

module.exports = router;
