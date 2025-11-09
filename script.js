document.addEventListener("DOMContentLoaded", () => {
  /* === 1. Фон-слайдер === */
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  showSlide(current);
  setInterval(nextSlide, 6000); // смена каждые 6 секунд

  /* === 2. Скрытие меню при скролле вниз === */
  let lastScroll = 0;
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    lastScroll = currentScroll;
  });

  /* === 3. Подсветка активного раздела === */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  function activateLink() {
    let scrollPos = window.scrollY + 150;
    sections.forEach((section) => {
      if (
        scrollPos > section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`nav a[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateLink);
});
