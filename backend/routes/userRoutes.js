const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const { registerUser, loginUser } = require('../controllers/userController');

dotenv.config();

// 사용자 회원가입 라우트
router.post('/register', registerUser);

// 사용자 로그인 라우트
router.post('/login', loginUser);

module.exports = router;

// CORS 설정 추가
const cors = require('cors');
const app = express();

// CORS 옵션 설정
const corsOptions = {
  origin: 'http://localhost:3000', // 프론트엔드 도메인
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // 쿠키 및 인증 정보 허용
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
