const express = require('express');
require('express-async-errors'); // For handling async errors
const morgan = require('morgan'); // For logging
const cors = require('cors'); // For enabling CORS
const csurf = require('csurf'); // For CSRF protection
const helmet = require('helmet'); // For setting security headers
const cookieParser = require('cookie-parser'); // For parsing cookies

const routes = require('./routes'); // Import your routes

const { ValidationError } = require('sequelize');
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev')); // Logging middleware
app.use(cookieParser()); // Cookie parsing middleware
app.use(express.json()); // Body parsing middleware

// Security Middleware
if (!isProduction) {
  app.use(cors()); // Enable CORS only in development
}

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Set security headers

// CSRF Protection Middleware
app.use(csurf({ 
  cookie: {
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction && "Lax",
    httpOnly: true
  }
}));

app.use(routes); // Use the imported routes

// 404 Error Handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Sequelize Error Handler
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// General Error Handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  const errorObject = {
    message: err.message,
    errors: err.errors,
  };
  if (!isProduction) {
    errorObject.title = err.title || 'Server Error';
    errorObject.stack = isProduction ? null : err.stack;
  }
  res.json(errorObject);
});

module.exports = app; // Export the app
