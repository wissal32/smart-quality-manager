const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createEquipment).get(getAllEquipment);
router.route('/:id').get(getEquipmentById).put(updateEquipment).delete(deleteEquipment);

module.exports = router;