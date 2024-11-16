// backend/routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const router = express.Router();

// 사용자 회원가입 라우트
router.post('/register', registerUser);

// 사용자 로그인 라우트
router.post('/login', loginUser);

// 사용자 프로필 조회 라우트 (인증 필요)
router.get('/profile', getUserProfile);

module.exports = router;
