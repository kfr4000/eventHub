const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// 로그인 엔드포인트
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login request for email:', email); // 디버깅 로그 추가

    // 데이터베이스에서 사용자를 찾기
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email); // 사용자를 찾지 못한 경우 로그 추가
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 비밀번호 검사
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password does not match for email:', email); // 비밀번호가 일치하지 않는 경우 로그 추가
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 토큰 생성 및 반환
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });

  } catch (error) {
    console.error('Login error:', error.message); // 오류 로그 추가
    res.status(500).json({ message: 'Server error' });
  }
});

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
