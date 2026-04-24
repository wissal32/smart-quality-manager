const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { requireFields, ensureAllowedValue } = require('../utils/validators');
const Equipment = require('../models/Equipment');

const statusValues = ['available', 'broken', 'maintenance'];

const createEquipment = asyncHandler(async (req, res) => {
  const { name, type, serial_number, qr_code, status = 'available', last_maintenance } = req.body;

  requireFields(req.body, ['name', 'type', 'serial_number']);
  ensureAllowedValue(status, statusValues, 'status');

  const equipment = await Equipment.create({
    name,
    type,
    serial_number,
    qr_code,
    status,
    last_maintenance,
  });

  res.status(201).json({
    success: true,
    message: 'Equipment created successfully',
    data: equipment,
  });
});

const getAllEquipment = asyncHandler(async (req, res) => {
  const equipmentList = await Equipment.findAll();

  res.status(200).json({
    success: true,
    count: equipmentList.length,
    data: equipmentList,
  });
});

const getEquipmentById = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    throw new AppError('Equipment not found', 404);
  }

  res.status(200).json({
    success: true,
    data: equipment,
  });
});

const updateEquipment = asyncHandler(async (req, res) => {
  const { status } = req.body;

  ensureAllowedValue(status, statusValues, 'status');

  const equipment = await Equipment.update(req.params.id, req.body);

  if (!equipment) {
    throw new AppError('Equipment not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Equipment updated successfully',
    data: equipment,
  });
});

const deleteEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.remove(req.params.id);

  if (!equipment) {
    throw new AppError('Equipment not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Equipment deleted successfully',
    data: equipment,
  });
});

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};