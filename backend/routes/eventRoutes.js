// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const { createEvent, joinEvent, getUserHostedEvents, getUserJoinedEvents, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Event routes
router.post('/', protect, createEvent);
router.post('/join', protect, joinEvent);
router.get('/hosted', protect, getUserHostedEvents);
router.get('/joined', protect, getUserJoinedEvents);
router.get('/', getEvents);

module.exports = router;
