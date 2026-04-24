const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { requireFields, ensureAllowedValue } = require('../utils/validators');
const Action = require('../models/Action');

const priorityValues = ['low', 'medium', 'high'];
const statusValues = ['todo', 'in_progress', 'completed'];

const createAction = asyncHandler(async (req, res) => {
  const { title, description, priority, status = 'todo', deadline, assigned_to, created_by } = req.body;

  requireFields(req.body, ['title', 'description', 'priority', 'deadline', 'assigned_to']);
  ensureAllowedValue(priority, priorityValues, 'priority');
  ensureAllowedValue(status, statusValues, 'status');

  const action = await Action.create({
    title,
    description,
    priority,
    status,
    deadline,
    assigned_to,
    created_by: created_by || req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Action created successfully',
    data: action,
  });
});

const getAllActions = asyncHandler(async (req, res) => {
  const actions = await Action.findAll();

  res.status(200).json({
    success: true,
    count: actions.length,
    data: actions,
  });
});

const getActionById = asyncHandler(async (req, res) => {
  const action = await Action.findById(req.params.id);

  if (!action) {
    throw new AppError('Action not found', 404);
  }

  res.status(200).json({
    success: true,
    data: action,
  });
});

const updateAction = asyncHandler(async (req, res) => {
  const { priority, status } = req.body;

  ensureAllowedValue(priority, priorityValues, 'priority');
  ensureAllowedValue(status, statusValues, 'status');

  const action = await Action.update(req.params.id, req.body);

  if (!action) {
    throw new AppError('Action not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Action updated successfully',
    data: action,
  });
});

const deleteAction = asyncHandler(async (req, res) => {
  const action = await Action.remove(req.params.id);

  if (!action) {
    throw new AppError('Action not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Action deleted successfully',
    data: action,
  });
});

module.exports = {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction,
};