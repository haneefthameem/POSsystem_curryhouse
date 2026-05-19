// ── CURRY HOUSE POS — Shared Data & Utilities ──────────────────────────────

// ── DEFAULT MENU DATA (prices in LKR) ──
const DEFAULT_MENU = [
  // Starters
  { id: 1, name: 'Samosa (2 pcs)',        category: 'Starters',   price: 450,   emoji: '🥟', desc: 'Crispy fried pastry with spiced filling' },
  { id: 2, name: 'Onion Bhaji',           category: 'Starters',   price: 500,   emoji: '🧅', desc: 'Golden fried onion fritters, mint chutney' },
  { id: 3, name: 'Seekh Kebab',           category: 'Starters',   price: 750,   emoji: '🍢', desc: 'Minced lamb with aromatic herbs on skewer' },
  { id: 4, name: 'Paneer Tikka',          category: 'Starters',   price: 700,   emoji: '🧀', desc: 'Chargrilled cottage cheese, bell peppers' },
  // Mains
  { id: 5, name: 'Butter Chicken',        category: 'Mains',      price: 1450,  emoji: '🍗', desc: 'Tender chicken in rich tomato-butter sauce' },
  { id: 6, name: 'Lamb Rogan Josh',       category: 'Mains',      price: 1550,  emoji: '🥩', desc: 'Slow-cooked lamb, Kashmiri spices' },
  { id: 7, name: 'Chicken Biryani',       category: 'Mains',      price: 1350,  emoji: '🍚', desc: 'Basmati rice, saffron-marinated chicken' },
  { id: 8, name: 'Paneer Makhani',        category: 'Mains',      price: 1250,  emoji: '🫕', desc: 'Cottage cheese in creamy butter gravy' },
  { id: 9, name: 'Prawn Masala',          category: 'Mains',      price: 1600,  emoji: '🦐', desc: 'Juicy prawns in tangy onion-tomato masala' },
  { id:10, name: 'Vegetable Korma',       category: 'Mains',      price: 1150,  emoji: '🥦', desc: 'Mixed vegetables in mild coconut cream' },
  // Breads & Rice
  { id:11, name: 'Garlic Naan',           category: 'Breads',     price: 350,   emoji: '🫓', desc: 'Tandoor-baked garlic butter flatbread' },
  { id:12, name: 'Plain Rice',            category: 'Breads',     price: 300,   emoji: '🍚', desc: 'Steamed fragrant basmati rice' },
  { id:13, name: 'Peshwari Naan',         category: 'Breads',     price: 400,   emoji: '🫓', desc: 'Sweet naan with coconut and almond' },
  { id:14, name: 'Paratha',               category: 'Breads',     price: 350,   emoji: '🥙', desc: 'Layered whole wheat flatbread' },
  // Sides
  { id:15, name: 'Raita',                 category: 'Sides',      price: 250,   emoji: '🥣', desc: 'Cooling yogurt with cucumber and mint' },
  { id:16, name: 'Mango Chutney',         category: 'Sides',      price: 150,   emoji: '🥭', desc: 'Sweet and tangy mango preserve' },
  { id:17, name: 'Dal Tadka',             category: 'Sides',      price: 550,   emoji: '🍲', desc: 'Yellow lentils tempered with cumin' },
  // Desserts
  { id:18, name: 'Gulab Jamun',           category: 'Desserts',   price: 450,   emoji: '🍮', desc: 'Soft milk dumplings in rose syrup' },
  { id:19, name: 'Mango Kulfi',           category: 'Desserts',   price: 500,   emoji: '🍦', desc: 'Traditional Indian ice cream, mango' },
  { id:20, name: 'Kheer',                 category: 'Desserts',   price: 400,   emoji: '🍚', desc: 'Creamy rice pudding, cardamom' },
  // Drinks
  { id:21, name: 'Mango Lassi',           category: 'Drinks',     price: 450,   emoji: '🥭', desc: 'Chilled yogurt mango drink' },
  { id:22, name: 'Masala Chai',           category: 'Drinks',     price: 300,   emoji: '🍵', desc: 'Spiced Indian tea with milk' },
  { id:23, name: 'Sparkling Water',       category: 'Drinks',     price: 200,   emoji: '💧', desc: '330ml carbonated water' },
  { id:24, name: 'Mango Juice',           category: 'Drinks',     price: 350,   emoji: '🥤', desc: 'Fresh mango juice, chilled' },
];

const TAX_RATE      = 0.15;   // 15%
const SERVICE_CHARGE = 0.10;  // 10%

// ── STORAGE HELPERS ──
function loadMenu() {
  const raw = localStorage.getItem('ch_menu');
  if (!raw) { saveMenu(DEFAULT_MENU); return DEFAULT_MENU; }
  return JSON.parse(raw);
}
function saveMenu(menu) {
  localStorage.setItem('ch_menu', JSON.stringify(menu));
}

function loadOrders() {
  const raw = localStorage.getItem('ch_orders');
  return raw ? JSON.parse(raw) : [];
}
function saveOrders(orders) {
  localStorage.setItem('ch_orders', JSON.stringify(orders));
}

function loadNextId() {
  const raw = localStorage.getItem('ch_next_id');
  return raw ? parseInt(raw) : 100;
}
function saveNextId(id) {
  localStorage.setItem('ch_next_id', id.toString());
}

// ── ORDER HELPERS ──
function generateOrderId() {
  const id = loadNextId();
  saveNextId(id + 1);
  return id;
}

function calcOrderTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * TAX_RATE;
  const service  = subtotal * SERVICE_CHARGE;
  const total    = subtotal + tax + service;
  return { subtotal, tax, service, total };
}

function fmt(n) {
  return 'Rs. ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── TOAST ──
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── CLOCK ──
function startClock(el) {
  if (!el) return;
  function tick() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    el.innerHTML = `<div>${date}</div><div class="time">${time}</div>`;
  }
  tick(); setInterval(tick, 1000);
}

// ── CATEGORIES ──
const CATEGORIES = ['All', 'Starters', 'Mains', 'Breads', 'Sides', 'Desserts', 'Drinks'];

// ── SEED DEMO ORDERS (if none exist) ──
function seedDemoOrders() {
  const existing = loadOrders();
  if (existing.length > 0) return;

  const menu = loadMenu();
  const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed'];
  const now = Date.now();
  const orders = [];

  const picks = [
    [5,11,21], [6,13,22], [1,2,7], [8,15,12], [9,14],
    [3,10,16], [18,19,23], [5,6,11,22], [4,7,15], [2,8,17,20]
  ];

  picks.forEach((ids, i) => {
    const items = ids.map(id => {
      const item = menu.find(m => m.id === id);
      if (!item) return null;
      return { ...item, qty: Math.ceil(Math.random() * 2) };
    }).filter(Boolean);

    const totals = calcOrderTotals(items);
    const hoursAgo = (picks.length - i) * 1.5;

    orders.push({
      id: 100 + i,
      items,
      ...totals,
      tableNo: Math.ceil(Math.random() * 12),
      payMethod: ['Cash','Card','Card','Cash','Card'][i % 5],
      status: 'Completed',
      createdAt: new Date(now - hoursAgo * 3600000).toISOString(),
    });
  });

  saveOrders(orders);
  saveNextId(200);
}

// Init on load — clear legacy USD data on first LKR load
(function clearLegacyData() {
  const flag = localStorage.getItem('ch_lkr_v1');
  if (!flag) {
    localStorage.removeItem('ch_menu');
    localStorage.removeItem('ch_orders');
    localStorage.removeItem('ch_next_id');
    localStorage.setItem('ch_lkr_v1', '1');
  }
}());
seedDemoOrders();

// ── INJECT WAVE BAR & FLOATING BUBBLES ──
(function injectAnimations() {
  // Rainbow wave bar at top
  const waveBar = document.createElement('div');
  waveBar.className = 'wave-bar';
  document.body.prepend(waveBar);

  // Floating bubbles
  const sizes   = [18, 24, 14, 30, 20, 12, 28, 16, 22, 10, 26, 18];
  const delays  = [0, 3, 6, 1.5, 8, 4, 10, 2, 7, 5, 9, 11];
  const durations = [14, 18, 12, 20, 16, 22, 15, 19, 13, 21, 17, 11];
  const lefts   = [5,12,20,30,42,55,63,72,80,88,95,48];

  sizes.forEach((size, i) => {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${lefts[i]}%;
      animation-duration:${durations[i]}s;
      animation-delay:${delays[i]}s;
    `;
    document.body.appendChild(b);
  });
}());
