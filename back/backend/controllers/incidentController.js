const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { requireFields, ensureAllowedValue } = require('../utils/validators');
const Incident = require('../models/Incident');

const severityValues = ['low', 'medium', 'high'];
const statusValues = ['open', 'in_progress', 'resolved'];

const createIncident = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    severity,
    cause,
    corrective_action,
    status = 'open',
    reported_by,
    assigned_to,
  } = req.body;

  requireFields(req.body, ['title', 'description', 'category', 'severity']);
  ensureAllowedValue(severity, severityValues, 'severity');
  ensureAllowedValue(status, statusValues, 'status');

  const incident = await Incident.create({
    title,
    description,
    category,
    severity,
    cause,
    corrective_action,
    status,
    reported_by: reported_by || req.user.id,
    assigned_to,
  });

  res.status(201).json({
    success: true,
    message: 'Incident created successfully',
    data: incident,
  });
});

const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.findAll();

  res.status(200).json({
    success: true,
    count: incidents.length,
    data: incidents,
  });
});

const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  res.status(200).json({
    success: true,
    data: incident,
  });
});

const updateIncident = asyncHandler(async (req, res) => {
  const { severity, status } = req.body;

  ensureAllowedValue(severity, severityValues, 'severity');
  ensureAllowedValue(status, statusValues, 'status');

  const incident = await Incident.update(req.params.id, req.body);

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Incident updated successfully',
    data: incident,
  });
});

const deleteIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.remove(req.params.id);

  if (!incident) {
    throw new AppError('Incident not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Incident deleted successfully',
    data: incident,
  });
});

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
};