const router = require('express').Router();
const path   = require('path');
const fs     = require('fs');
const multer = require('multer');
const auth   = require('../middleware/auth');
const Album  = require('../models/Album');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// Upload photos to existing album — must be before /:clubId to avoid route conflict
router.post('/album/:albumId/photos', auth, upload.array('photos', 20), async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    if (!album) return res.status(404).json({ message: 'Album not found' });

    const newPhotos = (req.files || []).map(f => ({
      url:  `/uploads/${f.filename}`,
      name: f.originalname,
    }));
    album.photos.push(...newPhotos);
    await album.save();
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/:clubId', auth, async (req, res) => {
  try {
    const albums = await Album.find({ clubId: req.params.clubId }).sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:clubId', auth, async (req, res) => {
  try {
    const album = new Album({ clubId: req.params.clubId, ...req.body });
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
