// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

// Middleware to log incoming requests (optional)
router.use((req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next();
});

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

// Use the API router for all /api routes
router.use('/api', apiRouter);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = router;
