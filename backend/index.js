const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: '../.env' });

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
