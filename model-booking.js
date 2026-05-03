const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Ownership — every query filters by this field to isolate users
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userEmail: { type: String, required: true },
  userName:  { type: String, default: '' },

  // Ride
  from: { type: String, required: true },
  to:   { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },

  // Car snapshot at booking time
  car: {
    id:      Number,
    name:    String,
    brand:   String,
    type:    String,
    price:   Number,
    img:     String,
    rating:  Number,
    seats:   Number,
    mileage: String,
  },

  // Fare breakdown
  distKm:      { type: Number, default: 0 },
  baseFare:    { type: Number, required: true },
  gst:         { type: Number, required: true },
  platformFee: { type: Number, default: 25 },
  discount:    { type: Number, default: 0 },
  totalFare:   { type: Number, required: true },

  // Status
  status:        { type: String, enum: ['pending','confirmed','driver_assigned','on_the_way','completed','rejected','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','paid'], default: 'unpaid' },
  paymentMethod: { type: String, default: '' },

  // Assigned driver (set on confirm)
  driver: {
    name:          { type: String, default: '' },
    phone:         { type: String, default: '' },
    vehicleNumber: { type: String, default: '' },
  },

  // Rating (post-ride)
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Booking', bookingSchema);