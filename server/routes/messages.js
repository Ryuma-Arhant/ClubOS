const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/:clubId', auth, async (req, res) => {
  try {
    const msgs = await Message.find({ clubId: req.params.clubId })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:clubId', auth, async (req, res) => {
  try {
    const msg = new Message({
      clubId: req.params.clubId,
      userId: req.user.id,
      sender: req.body.sender,
      avatar: req.body.avatar,
      text:   req.body.text,
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
