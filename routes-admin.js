const express = require('express');
const Booking = require('./model-booking');
const User    = require('./model-user');
const { protect, adminOnly } = require('./middleware-auth');
const router  = express.Router();

router.use(protect, adminOnly);

// GET /admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};

    const [bookings, total, revenue] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Booking.countDocuments(filter),
      Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalFare' } } }]),
    ]);

    res.json({ bookings, total, totalRevenue: revenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /admin/update-status
router.post('/update-status', async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!['pending','confirmed','rejected','completed'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking, message: `Booking ${status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpiry').sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalBookings, totalUsers, revenue, statusBreakdown] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalFare' } } }]),
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    res.json({ totalBookings, totalUsers, totalRevenue: revenue[0]?.total || 0, statusBreakdown });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
