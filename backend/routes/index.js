const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const path = require('path');

// Use the API router for /api routes
router.use('/api', apiRouter);

// CSRF protection route
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

// Serve static files and index.html in production
if (process.env.NODE_ENV === 'production') {
    // Serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });

    // Serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
        );
    });
}

module.exports = router;
