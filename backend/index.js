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

connectDB();

app.get('/', (req, res) => {
  res.send('EventHub Backend is running!');
});

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 서버를 실행하는 대신, app을 내보냄
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// 테스트용으로 app을 내보냄
module.exports = app;
