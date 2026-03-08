require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/clubs',    require('./routes/clubs'));
app.use('/api/events',   require('./routes/events'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/dm',       require('./routes/dm'));
app.use('/api/gallery',  require('./routes/gallery'));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => { console.error(err); process.exit(1); });
