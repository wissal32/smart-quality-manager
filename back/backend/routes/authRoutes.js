const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.post('/users', authMiddleware, roleMiddleware(['admin']), createUser);
router.get('/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;