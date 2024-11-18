// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');
const { protect, verifyUser, verifyAdmin } = require('../middleware/authMiddleware');
const { createEvent } = require('../controllers/eventController');

// Create a new event
router.post(
  '/',
  protect,
  [
    body('organizer').notEmpty().withMessage('Organizer is required').trim().escape(),
    body('name').notEmpty().withMessage('Event name is required').trim().escape(),
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('date').notEmpty().withMessage('Date is required').isISO8601().toDate(),
    body('location').notEmpty().withMessage('Location is required').trim().escape(),
    body('imageUrl').notEmpty().withMessage('Image URL is required').trim().escape().isURL().withMessage('Invalid URL')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organizer, name, title, description, date, location, imageUrl } = req.body;

    try {
      const newEvent = new Event({
        organizer,
        name,
        title,
        description,
        date,
        location,
        imageUrl,
      });
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an event
router.put(
  '/:id',
  protect,
  verifyUser,
  [
    body('organizer').notEmpty().withMessage('Organizer is required').trim().escape(),
    body('name').notEmpty().withMessage('Event name is required').trim().escape(),
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('date').notEmpty().withMessage('Date is required').isISO8601().toDate(),
    body('location').notEmpty().withMessage('Location is required').trim().escape(),
    body('imageUrl').notEmpty().withMessage('Image URL is required').trim().escape().isURL().withMessage('Invalid URL')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organizer, name, title, description, date, location, imageUrl } = req.body;

    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { organizer, name, title, description, date, location, imageUrl },
        { new: true, runValidators: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete an event
router.delete('/:id', protect, verifyUser, verifyAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const { createEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/events', protect, createEvent);

module.exports = router;
