// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');
const { verifyUser, verifyAdmin } = require('../middleware/auth');

// Create a new event
router.post(
  '/',
  [
    body('organizer').notEmpty().withMessage('Organizer is required').trim().escape(),
    body('name').notEmpty().withMessage('Event name is required').trim().escape(),
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('date').notEmpty().withMessage('Date is required').isISO8601().toDate(),
    body('location').notEmpty().withMessage('Location is required').trim().escape(),
    body('imageUrl').notEmpty().withMessage('Image URL is required').trim().escape().isURL().withMessage('Invalid URL format'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organizer, name, title, description, date, location, imageUrl } = req.body;

    const newEvent = new Event({
      organizer,
      name,
      title,
      description,
      date,
      location,
      imageUrl,
    });

    try {
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all events with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const events = await Event.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Event.countDocuments();

    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
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
  [
    body('organizer').optional().trim().escape(),
    body('name').optional().trim().escape(),
    body('title').optional().trim().escape(),
    body('description').optional().trim().escape(),
    body('date').optional().isISO8601().toDate(),
    body('location').optional().trim().escape(),
    body('imageUrl').optional().trim().escape().isURL().withMessage('Invalid URL format'),
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
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete an event with authorization check
router.delete('/:id', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure only the organizer or an admin can delete the event
    if (req.user.role !== 'admin' && req.user.id !== event.organizer) {
      return res.status(403).json({ message: 'You do not have permission to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;