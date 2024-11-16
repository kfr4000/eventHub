// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

module.exports = router;
