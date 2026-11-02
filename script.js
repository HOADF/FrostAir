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
  const STORAGE_KEY = 'frostair-theme';

  // Модели каталога — иконка рисуется локальным inline-SVG (images/ac-unit.svg
  // хранится в репозитории как эталон превью), без хотлинков на сторонние сайты
  const products = [
    { name: "Daikin Emura Premium", accent: "#00bcd4", price: "от 124 900 ₽" },
    { name: "Mitsubishi Electric LN", accent: "#2196f3", price: "от 149 900 ₽" },
    { name: "LG ARTCOOL Mirror", accent: "#9c27b0", price: "от 83 000 ₽" },
    { name: "Panasonic Etherea", accent: "#4caf50", price: "от 96 500 ₽" },
    { name: "Samsung WindFree Elite", accent: "#3f51b5", price: "от 72 000 ₽" },
    { name: "Toshiba Haori (Fabric)", accent: "#ff7043", price: "от 110 000 ₽" }
  ];

  // Рендер карточек
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

  // --- Общая логика температуры/темы: синхронизирует все виджены на странице ---
  // (большой блок в hero + компактный плавающий виджет вверху, всегда видимый)
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  const tempDisplays = document.querySelectorAll('[data-temp-display]');

  function applyTheme(theme, persist) {
    const isWarm = theme === 'warm';
    body.classList.toggle('theme-cold', !isWarm);
    body.classList.toggle('theme-warm', isWarm);
    tempDisplays.forEach(el => { el.textContent = isWarm ? '26°C' : '18°C'; });
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* localStorage недоступен — не критично для демо */ }
    }
  }

  function currentTheme() {
    return body.classList.contains('theme-warm') ? 'warm' : 'cold';
  }

  // Восстанавливаем последний выбранный режим между визитами
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) { /* режим приватного окна и т.п. */ }
  if (savedTheme === 'warm' || savedTheme === 'cold') {
    applyTheme(savedTheme, false);
  } else {
    applyTheme(currentTheme(), false);
  }

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(currentTheme() === 'warm' ? 'cold' : 'warm', true);
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Выпадающее меню кондиционера-шапки на мобильном ---
  const burger = document.getElementById('acBurger');
  const dropdown = document.getElementById('acDropdown');
  if (burger && dropdown) {
    burger.addEventListener('click', () => {
      const isOpen = dropdown.classList.toggle('active');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        dropdown.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
