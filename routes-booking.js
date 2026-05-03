const express = require('express');
const Booking = require('./model-booking');
const { protect } = require('./middleware-auth');
const router  = express.Router();

router.use(protect);

// POST /booking
router.post('/', async (req, res) => {
  try {
    const { from, to, date, time, car, distKm, baseFare, gst, platformFee, discount, totalFare, paymentMethod } = req.body;

    if (!from || !to || !car || !totalFare)
      return res.status(400).json({ error: 'from, to, car and totalFare are required' });

    const booking = await Booking.create({
      userId:        req.user._id,
      userEmail:     req.user.email,
      userName:      req.user.name,
      from, to,
      date:          date || new Date().toISOString().split('T')[0],
      time:          time || '00:00',
      car,
      distKm:        distKm      || 0,
      baseFare:      baseFare    || 0,
      gst:           gst         || 0,
      platformFee:   platformFee || 25,
      discount:      discount    || 0,
      totalFare,
      paymentMethod: paymentMethod || '',
      status:        'pending',
      paymentStatus: 'unpaid',
    });

    res.status(201).json({ booking, message: 'Booking created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /booking/my-bookings  — strictly filtered by userId
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /booking/confirm  — mark paid + confirmed (user owns the booking)
const DRIVERS = [
  { name: 'Rahul Singh', phone: '9876543210', vehicleNumber: 'UP32 AB1234' },
  { name: 'Amit Kumar',  phone: '9123456780', vehicleNumber: 'UP78 XY5678' },
  { name: 'Ravi Verma',  phone: '9988776655', vehicleNumber: 'DL01 CD9090' },
  { name: 'Suresh Yadav',phone: '9871234560', vehicleNumber: 'MH12 EF3456' },
  { name: 'Deepak Joshi',phone: '9765432100', vehicleNumber: 'RJ14 GH7890' },
];

router.post('/confirm', async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, userId: req.user._id },
      {
        status:        'confirmed',
        paymentStatus: 'paid',
        paymentMethod: paymentMethod || 'card',
        driver,
        updatedAt:     new Date(),
      },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json({ booking, message: 'Payment confirmed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /booking/cancel/:id  — MUST be before /:id wildcard routes
router.post('/cancel/:id', async (req, res) => {
  console.log(`[CANCEL] userId=${req.user._id} bookingId=${req.params.id}`);
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, status: { $in: ['pending', 'confirmed'] } },
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    console.log(`[CANCEL] success — new status: cancelled`);
    res.json({ booking, message: 'Booking cancelled' });
  } catch (err) {
    console.error('[CANCEL] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /booking/:id  — wildcard, keep AFTER all named routes
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /booking/:id/rate
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: 'rating must be 1–5' });

    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.rating = rating;
    booking.review = review || '';
    await booking.save();
    res.json({ booking, message: 'Rating saved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /booking/:id/advance-status
// Moves booking to the next logical status in the pipeline.
// Used by the frontend simulator; in production the driver app calls this.
const STATUS_PIPELINE = ['pending','confirmed','driver_assigned','on_the_way','completed'];

router.post('/:id/advance-status', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const idx  = STATUS_PIPELINE.indexOf(booking.status);
    if (idx === -1 || idx === STATUS_PIPELINE.length - 1)
      return res.status(400).json({ error: 'Booking already completed or rejected' });

    booking.status    = STATUS_PIPELINE[idx + 1];
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ booking, message: `Status updated to ${booking.status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;