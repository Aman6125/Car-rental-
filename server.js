require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(__dirname));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftride')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

app.use('/auth',    require('./routes-auth'));
app.use('/booking', require('./routes-booking'));
app.use('/admin',   require('./routes-admin'));
console.log('✅  Routes registered: /auth  /booking  /admin');

app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal server error' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚗  SwiftRide API → http://localhost:${PORT}`));