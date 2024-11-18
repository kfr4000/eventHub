const Event = require('../models/Event');

// 이벤트 생성
exports.createEvent = async (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      imageUrl,
      user: req.user.id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// 이벤트 참가
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 참가자 목록에 이미 사용자가 있는지 확인
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already participating in this event' });
    }

    // 참가자 목록에 사용자 추가
    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({ message: 'Successfully joined the event' });
  } catch (err) {
    res.status(500).json({ message: 'Error joining the event' });
  }
};

// 사용자 주최 이벤트 목록 조회
exports.getUserHostedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hosted events' });
  }
};

// 사용자 참가 이벤트 목록 조회
exports.getUserJoinedEvents = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching joined events' });
  }
};
