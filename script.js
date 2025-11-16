// Script: theme toggle, product render, frost reveal
document.addEventListener('DOMContentLoaded', ()=> {
  // products: реальные названия; фото — представляющие (Unsplash), цену — пример
  const products = [
    {
      name: "Daikin FTXS35K",
      image: "https://images.unsplash.com/photo-1585738384067-829bf02509e8?auto=format&fit=crop&w=1000&q=80",
      price: "от 49 900 ₽"
    },
    {
      name: "Mitsubishi MSZ-LN25VG",
      image: "https://images.unsplash.com/photo-1613390419819-8b9a5378a61a?auto=format&fit=crop&w=1000&q=80",
      price: "от 59 900 ₽"
    },
    {
      name: "LG Dual Inverter (12k)",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80",
      price: "от 43 000 ₽"
    },
    {
      name: "Panasonic ClimaPure XZ9",
      image: "https://images.unsplash.com/photo-1623766238166-1d4d90997c71?auto=format&fit=crop&w=1000&q=80",
      price: "от 46 500 ₽"
    },
    {
      name: "Toshiba RAS-10PKVPG",
      image: "https://images.unsplash.com/photo-1613363421383-5a7b8b3e1166?auto=format&fit=crop&w=1000&q=80",
      price: "от 39 900 ₽"
    },
    {
      name: "Samsung WindFree AR12",
      image: "https://images.unsplash.com/photo-1585412727339-54e4bae11b6d?auto=format&fit=crop&w=1000&q=80",
      price: "от 52 000 ₽"
    }
  ];

  // render products
  const grid = document.getElementById('productsGrid');
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product reveal-from-frost';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">${p.price ? p.price : ''}</div>
        <div style="color:rgba(0,0,0,0.6);font-size:0.92rem">Инвертор / монтаж под ключ</div>
      </div>
      <div class="actions">
        <a class="btn" href="#contacts">Заказать</a>
        <a class="btn btn-outline" href="#contacts">Подробнее</a>
      </div>
    `;
    grid.appendChild(card);
  });

  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // THEME TOGGLE
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const themeSwitcher = document.getElementById('themeSwitcher');
  // initial icon state
  function setSwitcherVisual() {
    const isCold = body.classList.contains('theme-cold');
    toggle.style.background = isCold ? 'linear-gradient(180deg,#f6fbff,#fff)' : 'linear-gradient(180deg,#fff7ed,#fff)';
    // small transform to hint current
    toggle.innerHTML = isCold ? '<span style="font-size:22px">❄</span>' : '<span style="font-size:22px">☀</span>';
    // hero product image can change to represent warm/cold
    const heroImg = document.getElementById('heroProductImage');
    if(heroImg) heroImg.src = isCold ? products[0].image : 'https://images.unsplash.com/photo-1531842477197-8ac6d45f5eb3?auto=format&fit=crop&w=900&q=80';
    // bottom layer style
    document.getElementById('bottomLayer').querySelector('.frost').style.background = isCold
      ? 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.92))'
      : 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,200,140,0.7))';
  }
  setSwitcherVisual();

  toggle.addEventListener('click', ()=> {
    if(body.classList.contains('theme-cold')){
      body.classList.remove('theme-cold');
      body.classList.add('theme-warm');
    } else {
      body.classList.remove('theme-warm');
      body.classList.add('theme-cold');
    }
    setSwitcherVisual();
  });

  // SIDE AIR coloring by theme (CSS variable)
  const leftAir = document.querySelector('.side-air.left');
  const rightAir = document.querySelector('.side-air.right');
  function applyAirColor() {
    const style = getComputedStyle(document.body);
    const val = style.getPropertyValue('--air-color') || 'rgba(0,153,255,0.16)';
    leftAir.style.setProperty('--air-color', val);
    rightAir.style.setProperty('--air-color', val);
  }
  applyAirColor();
  // watch for theme changes (MutationObserver)
  const obs = new MutationObserver(()=> applyAirColor());
  obs.observe(document.body, {attributes:true, attributeFilter:['class']});

  // FROST reveal logic: as user scrolls up into catalog / features, reveal elements that are under the frost
  const revealEls = document.querySelectorAll('.reveal-from-frost');
  function revealOnScroll(){
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    revealEls.forEach(el=>{
      const r = el.getBoundingClientRect();
      const elTop = r.top + window.scrollY;
      if (elTop < viewportBottom - 60) {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // ensure side-air variables are set initially
  setTimeout(()=> applyAirColor(),100);

});
