const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction,
} = require('../controllers/actionController');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createAction).get(getAllActions);
router.route('/:id').get(getActionById).put(updateAction).delete(deleteAction);

module.exports = router;