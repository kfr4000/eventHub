// backend/index.js

const express = require('express');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

const dotenv = require('dotenv');
const cors = require('cors');

const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

// .env 파일을 불러오기 위해 dotenv 설정
dotenv.config();

const app = express();

// Body parser middleware - JSON 요청 본문을 파싱하도록 설정
app.use(express.json());

// CORS 허용
app.use(cors());

// MongoDB 연결
connectDB();

// 기본 라우트
app.get('/', (req, res) => {
  res.send('EventHub Backend is running!');
});

// 사용자 및 이벤트 관련 라우트 설정
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
