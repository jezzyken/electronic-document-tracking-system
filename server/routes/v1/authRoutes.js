const express = require('express');
const authController = require('../../controllers/authController');
const { auth, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get('/verify-token', auth, authController.verifyUser);
router.post('/login', authController.login);

module.exports = router;