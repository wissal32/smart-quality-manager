const AppError = require('./AppError');

const sendError = (err, res) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.code === '23505') {
    statusCode = 409;
    message = 'Duplicate record already exists';
  }

  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof AppError) && !err.statusCode) {
    console.error(err);
  }

  sendError(err, res);
};

module.exports = errorHandler;