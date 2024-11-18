const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 직접 환경 변수를 설정합니다.
dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('MONGO_URI:', uri); // 디버깅을 위해 추가
    if (!uri) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;