/* ═══════════════════════════════════════════════
   ORBIT — Application Logic
   Carbon footprint decision-layer assistant
   ═══════════════════════════════════════════════ */

// ── State ──
const state = {
  profile: null,
  currentSurface: 'pulse',
  totalSaved: 24.3,
  streak: 7,
  swapsMade: 5,
  trendPercent: 12,
  trendDirection: 'down', // down = improving
  challengeMeals: 38,
  challengeGoal: 50,
};

// ── Carbon Data (realistic estimates in kg CO₂) ──
const carbonData = {
  'beef': { co2: 27.0, unit: 'per kg', category: 'food', swap: 'lentils (0.9 kg CO₂/kg)', swapSave: 26.1 },
  'beef mince': { co2: 27.0, unit: 'per kg', category: 'food', swap: 'lentil mince (0.9 kg CO₂/kg)', swapSave: 26.1 },
  'lamb': { co2: 39.2, unit: 'per kg', category: 'food', swap: 'chickpeas (0.8 kg CO₂/kg)', swapSave: 38.4 },
  'cheese': { co2: 13.5, unit: 'per kg', category: 'food', swap: 'hummus (1.0 kg CO₂/kg)', swapSave: 12.5 },
  'chicken': { co2: 6.9, unit: 'per kg', category: 'food', swap: 'tofu (3.0 kg CO₂/kg)', swapSave: 3.9 },
  'chicken breast': { co2: 6.9, unit: 'per kg', category: 'food', swap: 'tofu (3.0 kg CO₂/kg)', swapSave: 3.9 },
  'pork': { co2: 12.1, unit: 'per kg', category: 'food', swap: 'tempeh (1.0 kg CO₂/kg)', swapSave: 11.1 },
  'milk': { co2: 3.2, unit: 'per liter', category: 'food', swap: 'oat milk (0.9 kg CO₂/L)', swapSave: 2.3 },
  'whole milk': { co2: 3.2, unit: 'per liter', category: 'food', swap: 'oat milk (0.9 kg CO₂/L)', swapSave: 2.3 },
  'eggs': { co2: 4.8, unit: 'per dozen', category: 'food', swap: 'silken tofu for baking (1.5 kg CO₂)', swapSave: 3.3 },
  'rice': { co2: 4.0, unit: 'per kg', category: 'food', swap: 'potatoes (0.5 kg CO₂/kg)', swapSave: 3.5 },
  'coffee': { co2: 16.5, unit: 'per kg beans', category: 'food', swap: 'locally roasted (saves ~30%)', swapSave: 5.0 },
  'coffee beans': { co2: 16.5, unit: 'per kg beans', category: 'food', swap: 'locally roasted (saves ~30%)', swapSave: 5.0 },
  'chocolate': { co2: 19.0, unit: 'per kg', category: 'food', swap: 'fair-trade dark chocolate (saves ~25%)', swapSave: 4.8 },
  'avocado': { co2: 2.5, unit: 'per kg', category: 'food', swap: 'local seasonal fruit (0.3 kg CO₂/kg)', swapSave: 2.2 },
  'avocados': { co2: 2.5, unit: 'per kg', category: 'food', swap: 'local seasonal fruit (0.3 kg CO₂/kg)', swapSave: 2.2 },
  'butter': { co2: 11.5, unit: 'per kg', category: 'food', swap: 'olive oil (3.5 kg CO₂/L)', swapSave: 8.0 },
  'prawns': { co2: 18.0, unit: 'per kg', category: 'food', swap: 'mussels (0.6 kg CO₂/kg)', swapSave: 17.4 },
  'salmon': { co2: 11.9, unit: 'per kg', category: 'food', swap: 'sardines (3.5 kg CO₂/kg)', swapSave: 8.4 },
  'bread': { co2: 1.4, unit: 'per loaf', category: 'food', swap: null, swapSave: 0 },
  'white bread': { co2: 1.4, unit: 'per loaf', category: 'food', swap: null, swapSave: 0 },
  'pasta': { co2: 1.6, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'tomatoes': { co2: 1.4, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'potatoes': { co2: 0.5, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'lentils': { co2: 0.9, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'tofu': { co2: 3.0, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'bananas': { co2: 0.7, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
  'apples': { co2: 0.4, unit: 'per kg', category: 'food', swap: null, swapSave: 0 },
};

// ── Simulation scenarios ──
const simScenarios = {
  'vegetarian': {
    query: /vegetarian|veg diet|plant.?based|no meat/i,
    monthlySave: 54,
    description: 'Switching to a vegetarian diet eliminates the carbon cost of meat production — one of the highest-emission food categories. This includes savings from reduced land use, methane emissions, and supply chain transport.',
    cityMultiplier: 'a city of 500,000 people would save 27,000 tons of CO₂ per month — equivalent to taking 5,800 cars off the road permanently.'
  },
  'bike': {
    query: /bike|bicycle|cycl/i,
    monthlySave: 28,
    description: 'Replacing car trips with cycling eliminates tailpipe emissions, fuel production emissions, and reduces road wear. A 10 km round-trip commute by bike instead of car saves about 3.2 kg CO₂ per trip.',
    cityMultiplier: 'a city of 500,000 people would save 14,000 tons of CO₂ per month — equivalent to planting 700,000 trees.'
  },
  'electric|ev': {
    query: /electric car|EV|electric vehicle/i,
    monthlySave: 95,
    description: 'An electric vehicle produces zero tailpipe emissions. Even accounting for electricity generation, EVs produce 50-70% less CO₂ over their lifetime compared to gas cars. The savings depend on your local energy grid mix.',
    cityMultiplier: 'a city of 500,000 people would save 47,500 tons of CO₂ per month — equivalent to shutting down a small coal power plant.'
  },
  'shower': {
    query: /shower|bath|water/i,
    monthlySave: 12,
    description: 'Reducing shower time from 15 to 5 minutes cuts water heating energy by ~67%. Water heating is typically 15-20% of home energy use, so this is a significant lever with zero cost.',
    cityMultiplier: 'a city of 500,000 people would save 6,000 tons of CO₂ per month — equivalent to removing 1,300 cars from the road.'
  },
  'local': {
    query: /local|locally|farm|farmer/i,
    monthlySave: 18,
    description: 'Buying local produce eliminates long-distance transport emissions (air freight, refrigerated shipping). On average, locally-sourced food travels 80% fewer kilometers, significantly reducing its carbon footprint.',
    cityMultiplier: 'a city of 500,000 people would save 9,000 tons of CO₂ per month — equivalent to grounding 45 transatlantic flights.'
  },
  'fashion': {
    query: /fashion|clothes|secondhand|thrift/i,
    monthlySave: 22,
    description: 'The fashion industry produces 10% of global CO₂ emissions. Buying secondhand avoids the production emissions entirely — including raw materials, dyeing, manufacturing, and international shipping.',
    cityMultiplier: 'a city of 500,000 people would save 11,000 tons of CO₂ per month — equivalent to planting 550,000 trees.'
  },
};

// ── Swap suggestions for action card ──
const swapSuggestions = [
  { icon: '🥩 → 🌱', title: 'Swap beef for lentil bolognese tonight', desc: 'This single swap saves <strong>6.2 kg CO₂</strong> — equal to not driving for 3 days.' },
  { icon: '🚗 → 🚲', title: 'Bike to work tomorrow', desc: 'A 10 km ride instead of driving saves <strong>3.2 kg CO₂</strong> — like powering your home for half a day less.' },
  { icon: '🥛 → 🌾', title: 'Try oat milk in your coffee this week', desc: 'Switching 1L of dairy milk saves <strong>2.3 kg CO₂</strong> — as much as charging your phone for 6 months.' },
  { icon: '🍔 → 🍲', title: 'Cook dinner instead of ordering delivery', desc: 'Home cooking saves <strong>2.4 kg CO₂</strong> from packaging, transport, and food waste.' },
  { icon: '🚿 → ⏱️', title: 'Take a 5-minute shower instead of 15', desc: 'Saving 10 minutes of hot water saves <strong>1.6 kg CO₂</strong> daily — that\\'s 48 kg per month.' },
  { icon: '☕ → 🏠', title: 'Brew coffee at home instead of takeaway', desc: 'Skipping the disposable cup and transport saves <strong>0.8 kg CO₂</strong> per cup.' },
];

let currentSwapIndex = 0;

// ══════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════
function nextOnboardingStep() {
  const steps = document.querySelectorAll('.onboarding-step');
  const dots = document.querySelectorAll('.dot');
  steps[0].classList.remove('active');
  steps[1].classList.add('active');
  dots[0].classList.remove('active');
  dots[1].classList.add('active');
}

function completeOnboarding() {
  const diet = document.getElementById('ob-diet').value;
  const transport = document.getElementById('ob-transport').value;
  const housing = document.getElementById('ob-housing').value;

  state.profile = { diet, transport, housing };

  // Customize initial data based on profile
  if (diet === 'vegan' || diet === 'vegetarian') {
    state.trendPercent = 18;
    state.totalSaved = 31.2;
  }
  if (transport === 'bike' || transport === 'public') {
    state.totalSaved += 8;
    state.swapsMade += 2;
  }

  const overlay = document.getElementById('onboarding-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }, 500);
}

// ══════════════════════════════════════════════
// APP INITIALIZATION
// ══════════════════════════════════════════════
function initApp() {
  initBackground();
  initPulseRing();
  initRippleCanvas();
  updatePulseStats();
  animateHabitBars();
}

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════
function navigate(target) {
  state.currentSurface = target;

  // Update desktop nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });

  // Update mobile nav
  document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === target);
  });

  // Show surface
  document.querySelectorAll('.surface').forEach(s => s.classList.remove('active'));
  const surface = document.getElementById(`surface-${target}`);
  if (surface) {
    surface.classList.add('active');
    // Re-animate on navigate
    if (target === 'ripple') initRippleCanvas();
    if (target === 'pulse') { initPulseRing(); animateHabitBars(); }
  }
}

// Desktop nav click handlers
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.target));
});

// ══════════════════════════════════════════════
// BACKGROUND ANIMATION
// ══════════════════════════════════════════════
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating orbs
  const orbs = [];
  for (let i = 0; i < 5; i++) {
    orbs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 150 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: [260, 280, 160, 200, 220][i],
      alpha: 0.04 + Math.random() * 0.03,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background base
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    orbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

      const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, ${orb.alpha})`);
      gradient.addColorStop(1, `hsla(${orb.hue}, 70%, 60%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════════════════
// PULSE RING ANIMATION
// ══════════════════════════════════════════════
function initPulseRing() {
  const canvas = document.getElementById('pulse-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // Outer ring
    const outerRadius = center - 20;
    const innerRadius = center - 45;

    // Draw animated ring segments
    const segments = 60;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
      const nextAngle = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;

      const wave = Math.sin(time * 0.02 + i * 0.15) * 0.3 + 0.7;
      const r = innerRadius + (outerRadius - innerRadius) * wave;

      const progress = i / segments;
      let color;
      if (state.trendDirection === 'down') {
        // Purple to green gradient
        const hue = 260 + progress * (160 - 260);
        const sat = 70 + wave * 20;
        const light = 55 + wave * 15;
        color = `hsla(${hue < 0 ? hue + 360 : hue}, ${sat}%, ${light}%, ${0.4 + wave * 0.6})`;
      } else {
        // Amber to orange gradient
        const hue = 45 - progress * 20;
        const sat = 80;
        const light = 55 + wave * 15;
        color = `hsla(${hue}, ${sat}%, ${light}%, ${0.4 + wave * 0.6})`;
      }

      ctx.beginPath();
      ctx.arc(center, center, r, angle, nextAngle + 0.02, false);
      ctx.arc(center, center, innerRadius - 2, nextAngle + 0.02, angle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Glow ring
    const glowGrad = ctx.createRadialGradient(center, center, innerRadius - 10, center, center, outerRadius + 10);
    glowGrad.addColorStop(0, 'rgba(167, 139, 250, 0)');
    glowGrad.addColorStop(0.5, `rgba(167, 139, 250, ${0.03 + Math.sin(time * 0.03) * 0.02})`);
    glowGrad.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, size, size);

    time++;
    requestAnimationFrame(draw);
  }
  draw();
}

function updatePulseStats() {
  const arrow = document.getElementById('pulse-arrow');
  const percent = document.getElementById('pulse-percent');
  const label = document.getElementById('pulse-label');

  if (state.trendDirection === 'down') {
    arrow.textContent = '↓';
    arrow.style.color = '#a78bfa';
    label.textContent = 'Momentum';
  } else {
    arrow.textContent = '↑';
    arrow.style.color = '#fb923c';
    label.textContent = 'Trending Up';
  }
  percent.textContent = `${state.trendPercent}%`;

  document.getElementById('stat-saved').textContent = state.totalSaved.toFixed(1);
  document.getElementById('stat-streak').textContent = state.streak;
  document.getElementById('stat-swaps').textContent = state.swapsMade;
}

function animateHabitBars() {
  // Reset and re-animate
  document.querySelectorAll('.habit-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = target; }, 300);
  });
}

// ── Swap Actions ──
function completeSwap() {
  state.swapsMade++;
  state.totalSaved += 3 + Math.random() * 4;
  state.trendPercent = Math.min(state.trendPercent + 2, 30);
  updatePulseStats();

  const card = document.getElementById('action-card');
  card.classList.add('swapped');
  document.getElementById('action-title').textContent = 'Swap logged! 🎉';
  document.getElementById('action-desc').innerHTML = `Great choice! You've saved <strong>${state.totalSaved.toFixed(1)} kg CO₂</strong> total.`;
  document.getElementById('btn-do-swap').disabled = true;
  document.getElementById('btn-do-swap').textContent = 'Done ✓';

  setTimeout(() => {
    card.classList.remove('swapped');
    document.getElementById('btn-do-swap').disabled = false;
    document.getElementById('btn-do-swap').textContent = "I'll Do It ✓";
    showNextSwap();
  }, 3000);
}

function skipSwap() {
  showNextSwap();
}

function showNextSwap() {
  currentSwapIndex = (currentSwapIndex + 1) % swapSuggestions.length;
  const s = swapSuggestions[currentSwapIndex];
  document.querySelector('.action-card-icon').textContent = s.icon;
  document.getElementById('action-title').textContent = s.title;
  document.getElementById('action-desc').innerHTML = s.desc;
}

// ══════════════════════════════════════════════
// LENS (Scanner)
// ══════════════════════════════════════════════
function switchLensTab(tab) {
  document.querySelectorAll('.lens-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lens-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.lens-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`lens-${tab}`).classList.add('active');
}

function addQuickItem(item) {
  const input = document.getElementById('lens-item-input');
  const current = input.value.trim();
  if (current) {
    input.value = current + ', ' + item;
  } else {
    input.value = item;
  }
}

function parseItems(text) {
  // Parse input text into recognizable items
  const items = [];
  const parts = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    const lower = part.toLowerCase();
    let matched = false;

    for (const [key, data] of Object.entries(carbonData)) {
      if (lower.includes(key)) {
        // Try to extract quantity
        let qty = 1;
        const qtyMatch = lower.match(/([\d.]+)\s*(kg|g|l|ml|x|\b)/i);
        if (qtyMatch) {
          let num = parseFloat(qtyMatch[1]);
          const unit = (qtyMatch[2] || '').toLowerCase();
          if (unit === 'g') num /= 1000;
          if (unit === 'ml') num /= 1000;
          if (num > 0) qty = num;
        }

        const co2 = data.co2 * qty;
        items.push({
          name: part,
          key: key,
          qty: qty,
          co2: co2,
          swap: data.swap,
          swapSave: data.swapSave * qty,
        });
        matched = true;
        break;
      }
    }

    if (!matched && part.length > 1) {
      // Unknown item — estimate
      items.push({
        name: part,
        key: null,
        qty: 1,
        co2: 1.5 + Math.random() * 2,
        swap: null,
        swapSave: 0,
      });
    }
  }

  return items;
}

function getCO2Class(co2) {
  if (co2 < 2) return 'low';
  if (co2 < 5) return 'medium';
  if (co2 < 15) return 'high';
  return 'very-high';
}

function co2ToEquiv(co2) {
  const km = (co2 / 0.21).toFixed(0);
  if (co2 < 1) return `≈ charging your phone for ${(co2 * 180).toFixed(0)} days`;
  if (co2 < 5) return `≈ driving ${km} km in a car`;
  if (co2 < 15) return `≈ ${(co2 / 3.2).toFixed(1)} days of not driving`;
  return `≈ ${(co2 / 20).toFixed(1)} trees needed to absorb this in a year`;
}

function analyzeItems() {
  const input = document.getElementById('lens-item-input').value.trim();
  if (!input) return;
  showLensResults(parseItems(input));
}

function analyzeReceipt() {
  const input = document.getElementById('lens-receipt-input').value.trim();
  if (!input) return;
  showLensResults(parseItems(input));
}

function showLensResults(items) {
  if (items.length === 0) return;

  // Show loading
  document.getElementById('lens-loading').classList.remove('hidden');
  document.getElementById('lens-results').classList.add('hidden');

  setTimeout(() => {
    document.getElementById('lens-loading').classList.add('hidden');

    const totalCO2 = items.reduce((sum, i) => sum + i.co2, 0);

    // Update header
    document.getElementById('lens-total-co2').textContent = `${totalCO2.toFixed(1)} kg CO₂`;
    document.getElementById('lens-total-equiv').textContent = co2ToEquiv(totalCO2);

    // Build items list
    const listEl = document.getElementById('lens-items-list');
    listEl.innerHTML = '';
    items.sort((a, b) => b.co2 - a.co2);
    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'lens-item';
      div.style.animationDelay = `${i * 0.08}s`;
      div.innerHTML = `
        <div class="lens-item-info">
          <span class="lens-item-name">${item.name}</span>
          <span class="lens-item-detail">${item.swap ? `Swap: ${item.swap}` : 'Low-impact item ✓'}</span>
        </div>
        <span class="lens-item-co2 ${getCO2Class(item.co2)}">${item.co2.toFixed(1)} kg</span>
      `;
      listEl.appendChild(div);
    });

    // Best swap suggestion
    const bestSwap = items.filter(i => i.swapSave > 0).sort((a, b) => b.swapSave - a.swapSave)[0];
    const swapBox = document.getElementById('lens-swap-box');
    if (bestSwap) {
      document.getElementById('lens-swap-text').innerHTML =
        `The highest-impact swap: replace <strong>${bestSwap.name}</strong> with <strong>${bestSwap.swap}</strong>. ` +
        `This saves <strong>${bestSwap.swapSave.toFixed(1)} kg CO₂</strong> — ${co2ToEquiv(bestSwap.swapSave)}.`;
      swapBox.style.display = 'block';
    } else {
      swapBox.style.display = 'none';
    }

    document.getElementById('lens-results').classList.remove('hidden');
  }, 1200);
}

// ══════════════════════════════════════════════
// SIMULATOR (What If?)
// ══════════════════════════════════════════════
function fillSimulation(text) {
  document.getElementById('sim-input').value = text;
  runSimulation();
}

function runSimulation() {
  const input = document.getElementById('sim-input').value.trim();
  if (!input) return;

  document.getElementById('sim-loading').classList.remove('hidden');
  document.getElementById('sim-results').classList.add('hidden');
  document.getElementById('sim-results').classList.remove('visible');

  // Match scenario
  let matched = null;
  for (const [, scenario] of Object.entries(simScenarios)) {
    if (scenario.query.test(input)) {
      matched = scenario;
      break;
    }
  }

  if (!matched) {
    // Fallback generic scenario
    matched = {
      monthlySave: 15 + Math.floor(Math.random() * 30),
      description: `Making this change would reduce your carbon footprint by addressing one of the key emission areas in your daily routine. The savings come from reduced energy consumption, lower transport emissions, or more sustainable consumption patterns.`,
      cityMultiplier: `a city of 500,000 people would save ${(15 + Math.floor(Math.random() * 30)) * 500} tons of CO₂ per month — a meaningful contribution to urban climate goals.`
    };
  }

  setTimeout(() => {
    document.getElementById('sim-loading').classList.add('hidden');

    const m1 = matched.monthlySave;
    const m6 = m1 * 6;
    const m12 = m1 * 12;

    document.getElementById('sim-1m-val').textContent = `${m1} kg`;
    document.getElementById('sim-1m-equiv').textContent = co2ToEquiv(m1);

    document.getElementById('sim-6m-val').textContent = `${m6} kg`;
    document.getElementById('sim-6m-equiv').textContent = co2ToEquiv(m6);

    document.getElementById('sim-1y-val').textContent = `${(m12 / 1000).toFixed(1)} tons`;
    document.getElementById('sim-1y-equiv').textContent = `≈ ${Math.round(m12 / 20)} trees growing for a year`;

    document.getElementById('sim-city-impact').innerHTML =
      `If everyone in <strong>${'your city'}</strong> made this change, ${matched.cityMultiplier}`;

    document.getElementById('sim-explanation').textContent = matched.description;

    document.getElementById('sim-results').classList.remove('hidden');
    document.getElementById('sim-results').classList.add('visible');

    // Animate cards
    document.querySelectorAll('.sim-impact-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 150);
    });
  }, 1500);
}

// ══════════════════════════════════════════════
// RIPPLE CANVAS
// ══════════════════════════════════════════════
function initRippleCanvas() {
  const canvas = document.getElementById('ripple-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  let time = 0;

  const ripples = [];
  for (let i = 0; i < 6; i++) {
    ripples.push({
      radius: 30 + i * 28,
      maxRadius: 30 + i * 28,
      speed: 0.008 + Math.random() * 0.005,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.15 - i * 0.02,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    ripples.forEach((r, i) => {
      const pulse = Math.sin(time * r.speed + r.phase) * 10;
      const currentR = r.maxRadius + pulse;
      const alpha = r.alpha + Math.sin(time * r.speed + r.phase) * 0.03;

      ctx.beginPath();
      ctx.arc(center, center, currentR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(167, 139, 250, ${Math.max(0, alpha)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glow
      ctx.beginPath();
      ctx.arc(center, center, currentR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(110, 231, 183, ${Math.max(0, alpha * 0.4)})`;
      ctx.lineWidth = 4;
      ctx.filter = 'blur(4px)';
      ctx.stroke();
      ctx.filter = 'none';
    });

    // Center dot
    const centerGlow = ctx.createRadialGradient(center, center, 0, center, center, 20);
    centerGlow.addColorStop(0, 'rgba(167, 139, 250, 0.6)');
    centerGlow.addColorStop(0.5, 'rgba(110, 231, 183, 0.2)');
    centerGlow.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.fillStyle = centerGlow;
    ctx.fillRect(center - 20, center - 20, 40, 40);

    time++;
    requestAnimationFrame(draw);
  }
  draw();

  // Update equivalents
  updateRippleEquivalents();
}

function updateRippleEquivalents() {
  const saved = state.totalSaved;
  document.getElementById('ripple-total').textContent = `${saved.toFixed(1)} kg`;
  document.getElementById('equiv-trees').textContent = (saved / 21).toFixed(1);
  document.getElementById('equiv-driving').textContent = `${Math.round(saved / 0.21)} km`;
  document.getElementById('equiv-bulbs').textContent = `${Math.round(saved * 33)} hrs`;
  document.getElementById('equiv-homes').textContent = `${(saved / 13.5).toFixed(1)} days`;
}

// ══════════════════════════════════════════════
// CIRCLE (Community)
// ══════════════════════════════════════════════
function logMeal() {
  state.challengeMeals = Math.min(state.challengeMeals + 1, state.challengeGoal);
  const pct = (state.challengeMeals / state.challengeGoal) * 100;

  document.querySelector('.challenge-fill').style.width = `${pct}%`;
  document.querySelector('.challenge-numbers').textContent =
    `${state.challengeMeals} / ${state.challengeGoal} meals`;

  if (state.challengeMeals >= state.challengeGoal) {
    document.querySelector('.challenge-desc').innerHTML =
      '🎉 <strong>Goal reached!</strong> Your circle hit the weekly target. Amazing teamwork!';
  }

  // Add to activity feed
  const feed = document.getElementById('activity-feed');
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.style.animation = 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  item.innerHTML = `
    <div class="activity-avatar" style="background: var(--gradient-primary);">Y</div>
    <div class="activity-text">
      <strong>You</strong> logged a plant-based meal
      <span class="activity-time">just now</span>
    </div>
    <span class="activity-save">-1.5 kg</span>
  `;
  feed.insertBefore(item, feed.firstChild);

  // Update totals
  state.totalSaved += 1.5;
  state.swapsMade++;
  updatePulseStats();
}

// ══════════════════════════════════════════════
// ENTER KEY HANDLERS
// ══════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (state.currentSurface === 'lens') {
      const activeTab = document.querySelector('.lens-tab.active');
      if (activeTab && activeTab.dataset.tab === 'type') {
        analyzeItems();
      } else {
        analyzeReceipt();
      }
    } else if (state.currentSurface === 'simulator') {
      runSimulation();
    }
  }
});

// ══════════════════════════════════════════════
// AUTO-SKIP ONBOARDING (for demo)
// ══════════════════════════════════════════════
// Check if we should auto-skip
if (sessionStorage.getItem('orbit-onboarded')) {
  document.getElementById('onboarding-overlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  state.profile = JSON.parse(sessionStorage.getItem('orbit-profile') || '{}');
  // Defer init to next frame
  requestAnimationFrame(initApp);
} else {
  // Store onboarding completion
  const origComplete = window.completeOnboarding;
  const _origComplete = completeOnboarding;
  window.completeOnboarding = function () {
    sessionStorage.setItem('orbit-onboarded', 'true');
    sessionStorage.setItem('orbit-profile', JSON.stringify(state.profile));
    _origComplete();
  };
}
