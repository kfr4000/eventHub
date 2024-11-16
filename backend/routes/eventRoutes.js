// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const {
  createEvent,
  joinEvent,
  getUserHostedEvents,
  getUserJoinedEvents,
} = require('../controllers/eventController');

// 모든 이벤트 조회
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// 특정 이벤트 조회
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// 이벤트 생성 (인증된 사용자만)
router.post('/', protect, async (req, res) => {
  const { title, description, date, location, organizer, tickets } = req.body;
  try {
    const newEvent = new Event({ title, description, date, location, organizer, tickets });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// 이벤트 수정 (인증된 사용자만)
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// 이벤트 삭제 (인증된 사용자만)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// 이벤트 참가 (인증된 사용자만)
router.post('/:id/join', protect, joinEvent);

// 사용자 주최 이벤트 조회 (인증된 사용자만)
router.get('/user/hosted', protect, getUserHostedEvents);

// 사용자 참가 이벤트 조회 (인증된 사용자만)
router.get('/user/joined', protect, getUserJoinedEvents);

module.exports = router;
