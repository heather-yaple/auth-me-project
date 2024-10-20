// backend/utils/endpoint-validation.js
const { checkSchema } = require('express-validator');
const { handleValidationErrors } = require('./validation');

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.user || req.throwErr) {
        const err = new Error("User isn't logged in!");
        err.title = "Unauthorized Access";
        err.message = "Forbidden";
        err.status = 403;
        return next(err);
    }
    return next();
};

// Prepare SQL statements based on environment
const prepareSubqStatement = () => {
    const schemaPrefix = process.env.NODE_ENV === 'production' ? `${process.env.SCHEMA}."` : '';
    return {
        get schema() { return schemaPrefix; },
        statement: (subquery) => this[subquery],
    };
};

// Validation for retrieving all spots
const allSpotsValidation = [
    checkSchema({
        page: {
            optional: true,
            isInt: { options: { min: 1 }, errorMessage: "Page must be an integer" },
            toInt: true,
        },
        size: {
            optional: true,
            isInt: { options: { min: 1, max: 20 }, errorMessage: "Size must be between 1 and 20" },
            toInt: true,
        },
        minLat: {
            optional: true,
            isFloat: { options: { min: -90, max: 90 }, errorMessage: "Minimum latitude is invalid" },
            toFloat: true,
        },
        maxLat: {
            optional: true,
            isFloat: { options: { min: -90, max: 90 }, errorMessage: "Maximum latitude is invalid" },
            toFloat: true,
        },
        minLng: {
            optional: true,
            isFloat: { options: { min: -180, max: 180 }, errorMessage: "Minimum longitude is invalid" },
            toFloat: true,
        },
        maxLng: {
            optional: true,
            isFloat: { options: { min: -180, max: 180 }, errorMessage: "Maximum longitude is invalid" },
            toFloat: true,
        },
        minPrice: {
            optional: true,
            isFloat: { options: { min: 0 }, errorMessage: "Minimum price must be greater than or equal to 0" },
            toFloat: true,
        },
        maxPrice: {
            optional: true,
            isFloat: { options: { min: 0 }, errorMessage: "Maximum price must be greater than or equal to 0" },
            toFloat: true,
        },
    }),
    handleValidationErrors,
];

// Validation for creating a spot
const createSpotValidation = [
    checkSchema({
        address: { exists: true, errorMessage: "Street address is required" },
        city: { exists: true, errorMessage: "City is required" },
        state: { exists: true, errorMessage: "State is required" },
        country: { exists: true, errorMessage: "Country is required" },
        lat: { isFloat: { options: { min: -90, max: 90 }, errorMessage: "Latitude must be within -90 and 90" }},
        lng: { isFloat: { options: { min: -180, max: 180 }, errorMessage: "Longitude must be within -180 and 180" }},
        name: { isLength: { options: { min: 1, max: 50 }, errorMessage: "Name must be between 1 and 50 characters" }},
        description: { exists: true, errorMessage: "Description is required" },
        price: { isFloat: { options: { gt: 0 }, errorMessage: "Price per day must be a positive number" }},
    }),
    handleValidationErrors,
];

// Validation for creating a review
const createReviewValidation = [
    checkSchema({
        review: { isLength: { options: { min: 1 }, errorMessage: "Review text is required" }},
        stars: { isInt: { options: { min: 1, max: 5 }, errorMessage: "Stars must be an integer from 1 to 5" }},
    }),
    handleValidationErrors,
];

module.exports = {
    isLoggedIn,
    prepareSubqStatement,
    allSpotsValidation,
    createSpotValidation,
    createReviewValidation,
};
