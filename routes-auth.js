const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('./model-user');
const { protect } = require('./middleware-auth');
const router  = express.Router();

const sign = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET || 'swiftride_secret',
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password required' });

    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'Email already registered' });

    const role  = (await User.countDocuments()) === 0 ? 'admin' : 'user';
    const user  = await User.create({ name, email, password, phone, role });
    const token = sign(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOneAndUpdate({ email }, { otp, otpExpiry: expiry });
    if (!user) return res.status(404).json({ error: 'No account with that email' });

    console.log(`OTP for ${email}: ${otp}`);
    res.json({ message: 'OTP sent', ...(process.env.NODE_ENV !== 'production' && { otp }) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /auth/verify
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)                   return res.status(404).json({ error: 'User not found' });
    if (user.otp !== otp)        return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: 'OTP expired' });

    user.otp = undefined; user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    const token = sign(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /auth/me
router.get('/me', protect, (req, res) => res.json({ user: req.user }));

module.exports = router;
