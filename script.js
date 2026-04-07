document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const tempDisplay = document.getElementById('temp-display');
  const grid = document.getElementById('productsGrid');

  // Реальные модели с прозрачным фоном (или качественные фото)
  const products = [
    { name: "Daikin Emura Premium", image: "https://v-p-k.ru/image/catalog/Daikin/emura-silver.png", price: "от 124 900 ₽" },
    { name: "Mitsubishi Electric LN", image: "https://ja-split.ru/image/catalog/tovar/mitsubishi-electric/msz-ln25vgv.png", price: "от 149 900 ₽" },
    { name: "LG ARTCOOL Mirror", image: "https://www.lg.com/ru/images/air-conditioning/md07521570/gallery/Mirror-D01.png", price: "от 83 000 ₽" },
    { name: "Panasonic Etherea", image: "https://www.aircon.panasonic.eu/RU_ru/product_images/16238_CS-Z25VKEW_ProductImage_551.png", price: "от 96 500 ₽" },
    { name: "Samsung WindFree Elite", image: "https://images.samsung.com/is/image/samsung/p6pim/ru/ar09axhcawknner/gallery/ru-ar09axhcawknner-397143-ar09axhcawknner-thumb-436034177", price: "от 72 000 ₽" },
    { name: "Toshiba Haori (Fabric)", image: "https://toshiba-aircon.ru/upload/iblock/d76/d76504b868e42f6f59b66d870509618a.png", price: "от 110 000 ₽" }
  ];

  // Рендер карточек
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p style="font-size:0.9rem; color: #666; margin-bottom: 15px;">Премиальная инверторная система</p>
        <a href="#" class="btn">Заказать монтаж</a>
      </div>
    `;
    grid.appendChild(card);
  });

  // Логика переключения
  toggle.addEventListener('click', () => {
    if (body.classList.contains('theme-cold')) {
      body.classList.replace('theme-cold', 'theme-warm');
      tempDisplay.textContent = '26°C';
    } else {
      body.classList.replace('theme-warm', 'theme-cold');
      tempDisplay.textContent = '18°C';
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});
