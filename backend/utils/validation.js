// backend/utils/validation.js
const { validationResult } = require('express-validator');

// Middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) { 
        const errors = {};
        validationErrors.array().forEach(error => {
            errors[error.param] = error.msg; // Use 'param' instead of 'path' for clarity
        });

        const err = new Error("Bad Request");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request"; // Standardize title for clarity
        return next(err); // Return to prevent further processing
    }
    return next(); // Proceed if there are no validation errors
};

module.exports = {
    handleValidationErrors,
};
