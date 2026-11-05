// Иконка кондиционера — собственная inline-SVG (без внешних источников,
// поэтому не зависит от сторонних сайтов и не может «отвалиться»)
function acUnitIconMarkup(accentColor) {
  return `
    <svg viewBox="0 0 320 180" style="color:${accentColor}" role="img" aria-label="Иконка кондиционера">
      <defs>
        <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e9edf0"/>
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="280" height="70" rx="18" fill="url(#bodyGradient)" stroke="#d4dadf" stroke-width="2"/>
      <circle cx="270" cy="60" r="5" fill="currentColor" opacity="0.85"/>
      <rect x="40" y="58" width="56" height="20" rx="4" fill="#1c1c1c"/>
      <text x="68" y="73" font-family="monospace" font-size="12" fill="currentColor" text-anchor="middle">22°C</text>
      <g stroke="#c7ced4" stroke-width="2" stroke-linecap="round">
        <line x1="120" y1="56" x2="280" y2="56"/>
        <line x1="120" y1="66" x2="280" y2="66"/>
        <line x1="120" y1="76" x2="280" y2="76"/>
        <line x1="120" y1="86" x2="280" y2="86"/>
        <line x1="120" y1="96" x2="280" y2="96"/>
      </g>
      <rect x="20" y="110" width="280" height="14" rx="6" fill="#dfe4e8"/>
      <g stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.5">
        <line x1="90" y1="130" x2="80" y2="160"/>
        <line x1="160" y1="130" x2="160" y2="165"/>
        <line x1="230" y1="130" x2="240" y2="160"/>
      </g>
    </svg>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const grid = document.getElementById('productsGrid');

  // Модели каталога — иконка рисуется локальным inline-SVG, без хотлинков на сторонние сайты
  const products = [
    { name: "Daikin Emura Premium", accent: "#00bcd4", price: "от 124 900 ₽" },
    { name: "Mitsubishi Electric LN", accent: "#2196f3", price: "от 149 900 ₽" },
    { name: "LG ARTCOOL Mirror", accent: "#9c27b0", price: "от 83 000 ₽" },
    { name: "Panasonic Etherea", accent: "#4caf50", price: "от 96 500 ₽" },
    { name: "Samsung WindFree Elite", accent: "#3f51b5", price: "от 72 000 ₽" },
    { name: "Toshiba Haori (Fabric)", accent: "#ff7043", price: "от 110 000 ₽" }
  ];

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <div class="product-icon">${acUnitIconMarkup(p.accent)}</div>
      <div class="info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p style="font-size:0.9rem; color: #666; margin-bottom: 15px;">Премиальная инверторная система</p>
        <a href="#contacts" class="btn">Заказать монтаж</a>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // =========================================================
  // ТЕРМОСТАТ: питание и температура — отдельные друг от друга.
  // Режим (холод/тепло) — следствие заданной температуры
  // относительно «комнатной», а не отдельный переключатель.
  // =========================================================
  const ROOM_TEMP = 22;
  const MIN_TEMP = 16;
  const MAX_TEMP = 30;
  const MAX_DIFF = Math.max(ROOM_TEMP - MIN_TEMP, MAX_TEMP - ROOM_TEMP); // 8
  const TEMP_STORAGE_KEY = 'frostair-target-temp';
  const POWER_STORAGE_KEY = 'frostair-power';

  const state = { isOn: true, target: 18 };

  // Восстанавливаем сохранённые значения между визитами
  try {
    const savedTemp = parseInt(localStorage.getItem(TEMP_STORAGE_KEY), 10);
    if (!Number.isNaN(savedTemp) && savedTemp >= MIN_TEMP && savedTemp <= MAX_TEMP) {
      state.target = savedTemp;
    }
    const savedPower = localStorage.getItem(POWER_STORAGE_KEY);
    if (savedPower === 'on' || savedPower === 'off') {
      state.isOn = savedPower === 'on';
    }
  } catch (e) { /* localStorage недоступен — не критично для демо */ }

  function persist() {
    try {
      localStorage.setItem(TEMP_STORAGE_KEY, String(state.target));
      localStorage.setItem(POWER_STORAGE_KEY, state.isOn ? 'on' : 'off');
    } catch (e) { /* localStorage недоступен — не критично для демо */ }
  }

  function clampTemp(value) { return Math.min(MAX_TEMP, Math.max(MIN_TEMP, value)); }
  function modeFromTemp(temp) { return temp < ROOM_TEMP ? 'cold' : 'warm'; }
  function intensityFromTemp(temp) {
    const diff = Math.abs(temp - ROOM_TEMP);
    return Math.min(1, Math.max(0.25, diff / MAX_DIFF));
  }

  const ledEls = document.querySelectorAll('[data-led]');
  const displayEls = document.querySelectorAll('[data-display]');
  const modeIconEls = document.querySelectorAll('[data-mode-icon]');
  const tempDisplayEls = document.querySelectorAll('[data-temp-display]');
  const powerBtns = document.querySelectorAll('[data-power-toggle]');
  const tempUpBtns = document.querySelectorAll('[data-temp-up]');
  const tempDownBtns = document.querySelectorAll('[data-temp-down]');

  function updateUI() {
    const mode = modeFromTemp(state.target);
    const isWarm = mode === 'warm';

    body.classList.toggle('theme-cold', !isWarm);
    body.classList.toggle('theme-warm', isWarm);
    body.classList.toggle('is-off', !state.isOn);

    tempDisplayEls.forEach(el => {
      el.textContent = state.isOn ? `${state.target}°C` : '— —';
    });

    modeIconEls.forEach(el => {
      const iconClass = !state.isOn
        ? 'fa-solid fa-power-off'
        : (isWarm ? 'fa-solid fa-fire' : 'fa-solid fa-snowflake');
      el.className = `status-display__icon ${iconClass}`;
    });

    powerBtns.forEach(btn => btn.setAttribute('aria-pressed', String(state.isOn)));
  }

  function setPower(isOn) {
    state.isOn = isOn;
    persist();
    updateUI();
  }

  function adjustTemp(delta) {
    state.target = clampTemp(state.target + delta);
    persist();
    updateUI();
  }

  powerBtns.forEach(btn => btn.addEventListener('click', () => setPower(!state.isOn)));
  tempUpBtns.forEach(btn => btn.addEventListener('click', () => adjustTemp(1)));
  tempDownBtns.forEach(btn => btn.addEventListener('click', () => adjustTemp(-1)));

  updateUI();

  // =========================================================
  // ПОЛНОЭКРАННЫЙ ПУЛЬТ (мобильная версия) — открывается кнопкой
  // «Пульт» в шапке, дублирует те же элементы управления.
  // =========================================================
  const remoteTrigger = document.getElementById('remoteTrigger');
  const remoteOverlay = document.getElementById('remoteOverlay');

  function openRemote() {
    if (!remoteOverlay) return;
    remoteOverlay.hidden = false;
    body.classList.add('remote-open');
    if (remoteTrigger) remoteTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeRemote() {
    if (!remoteOverlay) return;
    remoteOverlay.hidden = true;
    body.classList.remove('remote-open');
    if (remoteTrigger) remoteTrigger.setAttribute('aria-expanded', 'false');
  }

  if (remoteTrigger) remoteTrigger.addEventListener('click', openRemote);
  if (remoteOverlay) {
    remoteOverlay.querySelectorAll('[data-remote-close]').forEach(el => {
      el.addEventListener('click', closeRemote);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && remoteOverlay && !remoteOverlay.hidden) closeRemote();
  });

  // =========================================================
  // ФОНОВЫЙ ЭФФЕКТ РАБОТЫ КОНДИЦИОНЕРА: снег (охлаждение) /
  // поднимающееся марево (обогрев) на canvas по бокам первого
  // экрана. Лежит за карточкой с текстом — контент не закрывает.
  // Интенсивность эффекта растёт с удалением заданной температуры
  // от «комнатной», поэтому видно, насколько сильно греет/охлаждает.
  // =========================================================
  function rand(min, max) { return min + Math.random() * (max - min); }

  function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return ctx;
  }

  const fxEls = [document.getElementById('fxLeft'), document.getElementById('fxRight')]
    .filter(Boolean)
    .map(el => ({ el, ctx: setupCanvas(el), particles: [], mode: null }));

  function spawnSnow(width, height) {
    return {
      x: rand(0, width),
      y: rand(-height, 0),
      r: rand(1.8, 4),
      speed: rand(18, 42),
      drift: rand(-8, 8),
      sway: rand(0, Math.PI * 2)
    };
  }

  function spawnHeat(width, height) {
    return {
      x: rand(0, width),
      y: rand(0, height) + height, // старт ниже видимой области, чтобы марево «вырастало» из-под низа
      len: rand(50, 100),
      speed: rand(26, 55),
      sway: rand(0, Math.PI * 2),
      swaySpeed: rand(1.2, 2.4),
      width: rand(6, 14),
      opacity: rand(0.22, 0.45)
    };
  }

  function ensureParticles(entry, mode, intensity, width, height) {
    if (width <= 0 || height <= 0) return;
    const base = mode === 'cold' ? 26 : 11;
    const count = Math.max(4, Math.round(base * (0.5 + intensity)));
    if (entry.mode !== mode || entry.particles.length !== count) {
      const spawn = mode === 'cold' ? spawnSnow : spawnHeat;
      entry.particles = Array.from({ length: count }, () => spawn(width, height));
      entry.mode = mode;
    }
  }

  let lastTime = performance.now();

  function frame(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const mode = modeFromTemp(state.target);
    const intensity = intensityFromTemp(state.target);

    fxEls.forEach(entry => {
      const width = entry.el.clientWidth;
      const height = entry.el.clientHeight;
      if (width === 0 || height === 0) return;

      if (!state.isOn) {
        entry.ctx.clearRect(0, 0, width, height);
        entry.mode = null; // пересоздать частицы заново, когда снова включат
        return;
      }

      ensureParticles(entry, mode, intensity, width, height);
      entry.ctx.clearRect(0, 0, width, height);

      if (mode === 'cold') {
        // снежинкам нужно собственное свечение (голубой ореол), иначе
        // белые точки сливаются со светлым фоном cold-тeмы
        entry.ctx.fillStyle = 'rgba(255,255,255,0.95)';
        entry.ctx.shadowColor = 'rgba(0,170,220,0.85)';
        entry.ctx.shadowBlur = 7;
        entry.particles.forEach(p => {
          p.sway += dt * 1.4;
          p.y += p.speed * dt * (0.6 + intensity * 0.8);
          p.x += Math.sin(p.sway) * p.drift * dt;
          if (p.y > height + 10) {
            Object.assign(p, spawnSnow(width, height));
            p.y = -10;
          }
          entry.ctx.beginPath();
          entry.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          entry.ctx.fill();
        });
        entry.ctx.shadowBlur = 0;
      } else {
        entry.particles.forEach(p => {
          p.sway += dt * p.swaySpeed;
          p.y -= p.speed * dt * (0.6 + intensity * 0.8);
          const offset = Math.sin(p.sway) * (6 + intensity * 10);
          const grad = entry.ctx.createLinearGradient(p.x, p.y, p.x, p.y - p.len);
          grad.addColorStop(0, `rgba(255,140,0,${p.opacity})`);
          grad.addColorStop(1, 'rgba(255,140,0,0)');
          entry.ctx.strokeStyle = grad;
          entry.ctx.lineWidth = p.width;
          entry.ctx.lineCap = 'round';
          entry.ctx.beginPath();
          entry.ctx.moveTo(p.x, p.y);
          entry.ctx.quadraticCurveTo(p.x + offset, p.y - p.len / 2, p.x, p.y - p.len);
          entry.ctx.stroke();
          if (p.y < -p.len) {
            Object.assign(p, spawnHeat(width, height));
            p.y = height + p.len;
          }
        });
      }
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
});
