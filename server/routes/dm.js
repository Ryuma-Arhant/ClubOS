const router        = require('express').Router();
const auth          = require('../middleware/auth');
const DirectMessage = require('../models/DirectMessage');

router.get('/:channelId', auth, async (req, res) => {
  try {
    const msgs = await DirectMessage.find({ channelId: req.params.channelId })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:channelId', auth, async (req, res) => {
  try {
    const msg = new DirectMessage({
      channelId: req.params.channelId,
      userId:    req.user.id,
      sender:    req.body.sender,
      avatar:    req.body.avatar,
      text:      req.body.text,
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
