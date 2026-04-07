document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const tempDisplay = document.getElementById('temp-display');
  const grid = document.getElementById('productsGrid');
  const bottomLayerFrost = document.querySelector('#bottomLayer .frost');
  const yearSpan = document.getElementById('year');

  // 1. Данные о товарах
  const products = [
    { name: "Daikin FTXS35K", image: "https://images.unsplash.com/photo-1585738384067-829bf02509e8?auto=format&fit=crop&w=1000&q=80", price: "от 49 900 ₽" },
    { name: "Mitsubishi MSZ-LN25VG", image: "https://images.unsplash.com/photo-1613390419819-8b9a5378a61a?auto=format&fit=crop&w=1000&q=80", price: "от 59 900 ₽" },
    { name: "LG Dual Inverter (12k)", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80", price: "от 43 000 ₽" },
    { name: "Panasonic ClimaPure XZ9", image: "https://images.unsplash.com/photo-1623766238166-1d4d90997c71?auto=format&fit=crop&w=1000&q=80", price: "от 46 500 ₽" },
    { name: "Toshiba RAS-10PKVPG", image: "https://images.unsplash.com/photo-1613363421383-5a7b8b3e1166?auto=format&fit=crop&w=1000&q=80", price: "от 39 900 ₽" },
    { name: "Samsung WindFree AR12", image: "https://images.unsplash.com/photo-1585412727339-54e4bae11b6d?auto=format&fit=crop&w=1000&q=80", price: "от 52 000 ₽" }
  ];

  // 2. Рендер каталога
  if (grid) {
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product reveal-from-frost';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <div class="price">${p.price}</div>
          <div style="color:rgba(0,0,0,0.6);font-size:0.92rem">Инвертор / монтаж под ключ</div>
        </div>
        <div class="actions">
          <a class="btn" href="#contacts">Заказать</a>
          <a class="btn btn-outline" href="#contacts">Подробнее</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // 3. Установка года
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 4. Функция обновления цветов бокового воздуха (CSS переменные)
  function applyAirColor() {
    const style = getComputedStyle(body);
    const val = style.getPropertyValue('--air-color').trim();
    const sideAirs = document.querySelectorAll('.side-air');
    sideAirs.forEach(air => air.style.setProperty('--air-color', val));
  }

  // 5. Главная функция визуализации темы
  function updateThemeVisuals() {
    const isCold = body.classList.contains('theme-cold');

    // Обновляем дисплей температуры на кондиционере
    if (tempDisplay) {
      tempDisplay.textContent = isCold ? '18°C' : '28°C';
      tempDisplay.style.color = isCold ? '#00d4ff' : '#ff8c00';
    }

    // Обновляем иконку/содержимое кнопки питания
    if (toggle) {
      toggle.innerHTML = isCold ? '<i class="fa-solid fa-snowflake"></i>' : '<i class="fa-solid fa-sun"></i>';
    }

    // Обновляем слой инея/дымки снизу
    if (bottomLayerFrost) {
      bottomLayerFrost.style.background = isCold
        ? 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.92))'
        : 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,200,140,0.7))';
    }

    // Применяем цвета для анимаций воздуха
    applyAirColor();
  }

  // 6. Слушатель клика по кнопке на кондиционере
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (body.classList.contains('theme-cold')) {
        body.classList.replace('theme-cold', 'theme-warm');
      } else {
        body.classList.replace('theme-warm', 'theme-cold');
      }
      updateThemeVisuals();
    });
  }

  // 7. Логика появления элементов при скролле (Reveal)
  const revealEls = document.querySelectorAll('.reveal-from-frost');
  function revealOnScroll() {
    const viewportBottom = window.scrollY + window.innerHeight;
    revealEls.forEach(el => {
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      if (elTop < viewportBottom - 60) {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }
    });
  }

  // Инициализация
  window.addEventListener('scroll', revealOnScroll);
  updateThemeVisuals(); // Установить начальное состояние
  setTimeout(revealOnScroll, 100); // Проверить видимость сразу после загрузки
});
