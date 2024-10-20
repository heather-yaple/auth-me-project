// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // Token expiry in seconds
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction, // Secure cookie in production
      sameSite: isProduction ? 'Lax' : 'None' // Consider using 'None' for cross-site requests in dev
    });

    return token;
};

// Restores the user from the JWT token in the cookie
const restoreUser = (req, res, next) => {
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        // Token verification failed, proceed without user
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (error) {
        console.error('Error restoring user:', error);
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');
      return next();
    });
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
