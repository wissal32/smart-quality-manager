const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authorization token is required', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const result = await query(
    'SELECT id, name, email, role, department, created_at FROM users WHERE id = $1',
    [decoded.id],
  );

  if (result.rows.length === 0) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = result.rows[0];
  next();
});

module.exports = authMiddleware;