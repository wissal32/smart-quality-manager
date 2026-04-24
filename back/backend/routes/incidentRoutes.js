const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
} = require('../controllers/incidentController');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createIncident).get(getAllIncidents);
router.route('/:id').get(getIncidentById).put(updateIncident).delete(deleteIncident);

module.exports = router;