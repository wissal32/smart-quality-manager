const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { requireFields, ensureAllowedValue } = require('../utils/validators');
const User = require('../models/User');

const allowedRoles = ['admin', 'quality_manager', 'it_manager', 'employee'];

const userPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  created_at: user.created_at,
});

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'employee', department = '' } = req.body;
  const isAdminRequest = req.user && req.user.role === 'admin';
  const effectiveRole = isAdminRequest ? role : 'employee';

  requireFields(req.body, ['name', 'email', 'password']);
  ensureAllowedValue(effectiveRole, allowedRoles, 'role');

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: effectiveRole,
    department,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  requireFields(req.body, ['email', 'password']);

  const user = await User.findByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    data: userPayload(user),
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { password, email, ...updateData } = req.body;

  if (updateData.role) {
    ensureAllowedValue(updateData.role, allowedRoles, 'role');
  }

  if (email) {
    const existingUser = await User.findByEmail(email);

    if (existingUser && existingUser.id !== req.params.id) {
      throw new AppError('Email already exists', 409);
    }

    updateData.email = email;
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.update(req.params.id, updateData);

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.remove(req.params.id);

  if (!deletedUser) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
};