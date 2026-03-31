const router = require('express').Router();
const auth   = require('../middleware/auth');
const Event  = require('../models/Event');

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const idx = event.rsvps.findIndex(id => id.toString() === req.user.id);
    if (idx !== -1) {
      event.rsvps.splice(idx, 1);
    } else {
      if (event.rsvps.length >= event.capacity) {
        return res.status(400).json({ message: 'Event at capacity' });
      }
      event.rsvps.push(req.user.id);
    }
    await event.save();
    res.json({ rsvpCount: event.rsvps.length, hasRsvp: event.rsvps.some(id => id.toString() === req.user.id) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
