const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { requireFields, ensureAllowedValue } = require('../utils/validators');
const Idea = require('../models/Idea');

const statusValues = ['pending', 'approved', 'rejected'];

const createIdea = asyncHandler(async (req, res) => {
  const { title, description, votes = 0, status = 'pending', created_by } = req.body;

  requireFields(req.body, ['title', 'description']);
  ensureAllowedValue(status, statusValues, 'status');

  const idea = await Idea.create({
    title,
    description,
    votes,
    status,
    created_by: created_by || req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Idea created successfully',
    data: idea,
  });
});

const getAllIdeas = asyncHandler(async (req, res) => {
  const ideas = await Idea.findAll();

  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas,
  });
});

const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    throw new AppError('Idea not found', 404);
  }

  res.status(200).json({
    success: true,
    data: idea,
  });
});

const updateIdea = asyncHandler(async (req, res) => {
  const { status } = req.body;

  ensureAllowedValue(status, statusValues, 'status');

  const idea = await Idea.update(req.params.id, req.body);

  if (!idea) {
    throw new AppError('Idea not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Idea updated successfully',
    data: idea,
  });
});

const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.remove(req.params.id);

  if (!idea) {
    throw new AppError('Idea not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Idea deleted successfully',
    data: idea,
  });
});

module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
};