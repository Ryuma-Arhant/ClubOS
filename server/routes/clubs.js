const router = require('express').Router();
const auth   = require('../middleware/auth');
const Club   = require('../models/Club');

router.get('/', auth, async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const club = new Club({ ...req.body, submittedBy: req.user.id });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    const already = club.applications.some(a => a.user?.toString() === req.user.id);
    if (already) return res.status(400).json({ message: 'Already applied' });
    club.applications.push({ user: req.user.id, name: req.body.name, email: req.body.email });
    await club.save();
    res.json({ message: 'Application submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/applications/:appId', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    const app = club.applications.id(req.params.appId);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    app.status = req.body.status;
    if (req.body.status === 'approved' && app.user) {
      club.members.addToSet(app.user);
    }
    await club.save();
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
