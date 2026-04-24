const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
} = require('../controllers/ideaController');

const router = express.Router();

router.use(authMiddleware);

router.route('/').post(createIdea).get(getAllIdeas);
router.route('/:id').get(getIdeaById).put(updateIdea).delete(deleteIdea);

module.exports = router;