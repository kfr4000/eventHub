// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 사용자 회원가입
exports.registerUser = async (req, res) => {
const { username, email, password } = req.body;

try {
// 유저가 존재하는지 확인
const userExists = await User.findOne({ email });
if (userExists) {
return res.status(400).json({ message: 'User already exists' });
}

// 비밀번호 해시화
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// 유저 생성
const user = await User.create({
  username,
  email,
  password: hashedPassword,
});

// JWT 토큰 생성
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '30d',
});

res.status(201).json({
  _id: user._id,
  username: user.username,
  email: user.email,
  token,
});

} catch (error) {
res.status(500).json({ message: 'Error registering user' });
}
};

// 사용자 로그인
exports.loginUser = async (req, res) => {
const { email, password } = req.body;

try {
// 유저 찾기
const user = await User.findOne({ email });
if (!user) {
return res.status(401).json({ message: 'Invalid credentials' });
}

// 비밀번호 검증
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid credentials' });
}

// JWT 토큰 생성
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '30d',
});

res.json({
  _id: user._id,
  username: user.username,
  email: user.email,
  token,
});

} catch (error) {
res.status(500).json({ message: 'Error logging in' });
}
};

// 사용자 정보 가져오기
exports.getUserProfile = async (req, res) => {
try {
const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

res.json({
  _id: user._id,
  username: user.username,
  email: user.email,
});

} catch (error) {
res.status(500).json({ message: 'Error fetching user profile' });
}
};

