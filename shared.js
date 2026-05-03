// ── Car Data ──────────────────────────────────────────────────────────────────
const CARS = [
  { id:1,  name:'BMW 5 Series',    brand:'BMW',        type:'Luxury',  price:28, rating:4.9, mileage:'18 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', color:'#1a1a2e' },
  { id:2,  name:'Mercedes E-Class',brand:'Mercedes',   type:'Luxury',  price:32, rating:4.8, mileage:'16 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=600&q=80', color:'#1a1a2e' },
  { id:3,  name:'Audi A6',         brand:'Audi',       type:'Luxury',  price:30, rating:4.8, mileage:'15 km/l', seats:5, available:false, img:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80', color:'#1a1a2e' },
  { id:4,  name:'Toyota Camry',    brand:'Toyota',     type:'Sedan',   price:14, rating:4.6, mileage:'22 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80', color:'#0f2027' },
  { id:5,  name:'Honda City',      brand:'Honda',      type:'Sedan',   price:12, rating:4.5, mileage:'24 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80', color:'#0f2027' },
  { id:6,  name:'Maruti Swift',    brand:'Maruti',     type:'Mini',    price:8,  rating:4.3, mileage:'28 km/l', seats:4, available:true,  img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', color:'#0a1628' },
  { id:7,  name:'Hyundai i20',     brand:'Hyundai',    type:'Mini',    price:9,  rating:4.4, mileage:'26 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', color:'#0a1628' },
  { id:8,  name:'Mahindra XUV700', brand:'Mahindra',   type:'SUV',     price:18, rating:4.7, mileage:'17 km/l', seats:7, available:false, img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', color:'#1a0a2e' },
  { id:9,  name:'Toyota Fortuner', brand:'Toyota',     type:'SUV',     price:22, rating:4.7, mileage:'14 km/l', seats:7, available:true,  img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', color:'#1a0a2e' },
  { id:10, name:'Kia Seltos',      brand:'Kia',        type:'SUV',     price:16, rating:4.6, mileage:'19 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&q=80', color:'#1a0a2e' },
  { id:11, name:'Porsche Cayenne', brand:'Porsche',    type:'Luxury',  price:45, rating:4.9, mileage:'13 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', color:'#2a1a0e' },
  { id:12, name:'Tesla Model 3',   brand:'Tesla',      type:'Sedan',   price:25, rating:4.9, mileage:'Electric', seats:5, available:true,  img:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80', color:'#0a1a2e' },
  { id:13, name:'Tata Nexon EV',   brand:'Tata',       type:'SUV',     price:13, rating:4.5, mileage:'Electric', seats:5, available:false, img:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80', color:'#0a1a2e' },
  { id:14, name:'Maruti Ertiga',   brand:'Maruti',     type:'Mini',    price:10, rating:4.3, mileage:'20 km/l', seats:7, available:true,  img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80', color:'#1a280e' },
  { id:15, name:'Jaguar XF',       brand:'Jaguar',     type:'Luxury',  price:38, rating:4.8, mileage:'14 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80', color:'#1a1a2e' },
  { id:16, name:'Hyundai Creta',   brand:'Hyundai',    type:'SUV',     price:15, rating:4.6, mileage:'18 km/l', seats:5, available:true,  img:'https://images.unsplash.com/photo-1588362951121-3ee319b018b2?w=600&q=80', color:'#0a1a28' },
  { id:17, name:'Volkswagen Polo', brand:'Volkswagen', type:'Mini',    price:10, rating:4.4, mileage:'23 km/l', seats:5, available:false, img:'https://images.unsplash.com/photo-1622194992810-c42f4bdf7b16?w=600&q=80', color:'#1a1a1a' },
  { id:18, name:'Ford Endeavour',  brand:'Ford',       type:'SUV',     price:20, rating:4.6, mileage:'13 km/l', seats:7, available:true,  img:'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80', color:'#1a1a2e' },
];

// ── Stars helper ───────────────────────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '½';
  return s;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openCarModal(car) {
  const overlay = document.getElementById('carModal');
  if (!overlay) return;

  document.getElementById('mImg').src = car.img;
  document.getElementById('mImg').alt = car.name;
  document.getElementById('mName').textContent = car.name;
  document.getElementById('mBrand').textContent = car.brand;
  document.getElementById('mType').textContent = car.type;
  document.getElementById('mPrice').textContent = `₹${car.price}/km`;
  document.getElementById('mMileage').textContent = car.mileage;
  document.getElementById('mSeats').textContent = car.seats + ' Seats';
  document.getElementById('mRating').textContent = car.rating;
  document.getElementById('mStars').textContent = renderStars(car.rating);
  document.getElementById('mAvail').textContent = car.available ? '✓ Available' : '✗ Booked';
  document.getElementById('mAvail').className = 'badge ' + (car.available ? 'badge-available' : 'badge-booked');

  const selectBtn = document.getElementById('mSelectBtn');
  if (car.available) {
    selectBtn.disabled = false;
    selectBtn.textContent = 'Select This Car';
    selectBtn.onclick = () => { selectCar(car); };
  } else {
    selectBtn.disabled = true;
    selectBtn.textContent = 'Currently Unavailable';
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('carModal');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

async function selectCar(car) {
  // Auth guard
  const token = localStorage.getItem('sr_token');
  if (!token) {
    closeModal();
    showToast('🔒 Please log in to book a ride');
    setTimeout(() => { window.location.href = 'auth.html'; }, 1200);
    return;
  }

  // rideData guard
  const rideData = JSON.parse(localStorage.getItem('rideData') || 'null');
  if (!rideData || !rideData.pickup || !rideData.drop) {
    showToast('⚠️ Please enter pickup and drop locations first');
    closeModal();
    return;
  }

  // Disable button while request is in flight
  const btn = document.getElementById('mSelectBtn');
  const origLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Booking...';

  try {
    const distKm    = rideData.distanceKm || 10;
    const totalFare = calcFare(car.type, distKm);

    const res = await fetch(`${API_BASE}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        from:      rideData.pickup,
        to:        rideData.drop,
        car:       car.name,
        distKm,
        totalFare,
        date:      rideData.date || new Date().toISOString().split('T')[0],
        time:      rideData.time || '00:00',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed');

    // Persist the full booking document (contains _id for confirm step)
    localStorage.setItem('selectedRide', JSON.stringify(data.booking));
    localStorage.setItem('selectedCar',  JSON.stringify(car));

    closeModal();
    showToast('🚗 Booking created! Redirecting...');
    setTimeout(() => { window.location.href = 'booking.html'; }, 1000);

  } catch (err) {
    showToast('❌ ' + err.message);
    btn.disabled = false;
    btn.textContent = origLabel;
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, duration = 3000) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon">✓</span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.background = window.scrollY > 30
      ? 'rgba(10,10,15,0.95)'
      : 'rgba(10,10,15,0.7)';
  });
}

// ── Distance & Pricing ────────────────────────────────────────────────────────
const PRICE_RATES = { Mini: 8, Sedan: 10, SUV: 15, Luxury: 25 };

// Geocode a city/address string to [lon, lat] using Nominatim (free, no key)
async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place + ', India')}&format=json&limit=1`;
  const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data.length) throw new Error('Location not found: ' + place);
  return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
}

// Get driving distance (km) + duration (min) via OSRM public API (free, no key)
async function getDistanceKm(pickup, drop) {
  try {
    const [fromCoord, toCoord] = await Promise.all([geocode(pickup), geocode(drop)]);
    const url = `https://router.project-osrm.org/route/v1/driving/${fromCoord[0]},${fromCoord[1]};${toCoord[0]},${toCoord[1]}?overview=false`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.code !== 'Ok') throw new Error('Routing failed');
    const km  = Math.round(data.routes[0].distance / 1000 * 10) / 10;  // metres → km
    const min = Math.round(data.routes[0].duration / 60);               // seconds → minutes
    return { km, min };
  } catch {
    // Fallback: random 5–20 km, assume 2.5 min/km
    const km  = Math.round((5 + Math.random() * 15) * 10) / 10;
    const min = Math.round(km * 2.5);
    return { km, min, fallback: true };
  }
}

function calcFare(carType, distKm) {
  const rate = PRICE_RATES[carType] || 10;
  return Math.round(rate * distKm);
}

// ── Car Card HTML ──────────────────────────────────────────────────────────────
function carCardHTML(car, idx = 0) {
  // If rideData has a real distance, show dynamic fare + distance in seats slot
  const rideData   = JSON.parse(localStorage.getItem('rideData') || '{}');
  const distKm     = rideData.distanceKm;
  const durationMin= rideData.durationMin;
  const dynamicFare= distKm ? calcFare(car.type, distKm) : null;

  const priceDisplay  = dynamicFare
    ? `₹${dynamicFare}<span style="font-size:11px;color:var(--text-muted);font-weight:400"> total</span>`
    : `₹${car.price}<span>/km</span>`;

  const seatsDisplay  = distKm
    ? `📍 ${distKm} km · ⏱ ${durationMin} min`
    : `⟳ ${car.mileage}`;

  return `
  <div class="car-card fade-in" style="animation-delay:${idx * 0.07}s" onclick="openCarModal(${JSON.stringify(car).replace(/"/g, '&quot;')})">
    <div class="car-card-img-wrap">
      <img src="${car.img}" alt="${car.name}" class="car-card-img" loading="lazy">
      <span class="badge ${car.available ? 'badge-available' : 'badge-booked'} car-card-badge">
        ${car.available ? '● Available' : '● Booked'}
      </span>
      <div class="car-card-overlay">
        <span class="car-card-type">${car.type}</span>
      </div>
    </div>
    <div class="car-card-body">
      <div class="car-card-top">
        <div>
          <div class="car-card-name">${car.name}</div>
          <div class="car-card-brand">${car.brand}</div>
        </div>
        <div class="car-card-price">${priceDisplay}</div>
      </div>
      <div class="car-card-footer">
        <div class="rating">
          <span class="star">★</span>
          <span>${car.rating}</span>
        </div>
        <div class="car-card-seats">${seatsDisplay}</div>
      </div>
    </div>
  </div>`;
}

// ── Modal HTML ─────────────────────────────────────────────────────────────────
function injectModal() {
  if (document.getElementById('carModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="carModal" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <img id="mImg" class="modal-img" src="" alt="">
      <div class="modal-body">
        <div class="modal-header">
          <div>
            <h2 style="font-family:var(--font-display);font-size:22px;font-weight:800" id="mName"></h2>
            <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
              <span id="mBrand" style="color:var(--text-secondary);font-size:13px"></span>
              <span id="mType" style="color:var(--accent);font-size:13px"></span>
              <span id="mAvail" class="badge"></span>
            </div>
          </div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-specs">
          <div class="spec-item"><div class="spec-value" id="mPrice"></div><div class="spec-label">Price</div></div>
          <div class="spec-item"><div class="spec-value" id="mMileage"></div><div class="spec-label">Mileage</div></div>
          <div class="spec-item"><div class="spec-value" id="mSeats"></div><div class="spec-label">Capacity</div></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div class="rating" style="font-size:15px">
            <span class="star" style="font-size:18px" id="mStars"></span>
            <span id="mRating" style="font-weight:700"></span>
            <span style="color:var(--text-secondary);font-size:13px">/ 5.0</span>
          </div>
        </div>
        <button id="mSelectBtn" class="btn btn-primary btn-lg" style="width:100%;justify-content:center">Select This Car</button>
      </div>
    </div>
  </div>`);
}

// ── User nav ───────────────────────────────────────────────────────────────────
// Reads sr_user from localStorage and swaps the nav-actions content.
// Works on any page that has id="navActions" in its navbar.
function initUserNav() {
  const el = document.getElementById('navActions');
  if (!el) return;

  try {
    const user = JSON.parse(localStorage.getItem('sr_user'));
    if (user && user.name) {
      el.innerHTML = `
        <a href="my-rides.html" class="btn btn-ghost">🎫 My Rides</a>
        <a href="my-rides.html" class="btn btn-ghost">👤 ${user.name}</a>
        <button class="btn btn-ghost" onclick="logOut()">Logout</button>`;
    }
    // If no user, the original Login / Get Started buttons remain untouched
  } catch (_) { /* corrupt storage — leave default buttons */ }
}

function logOut() {
  localStorage.removeItem('sr_token');
  localStorage.removeItem('sr_user');
  localStorage.removeItem('selectedRide');
  window.location.href = 'auth.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  injectModal();
  initUserNav();
});
