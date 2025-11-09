document.addEventListener("DOMContentLoaded", () => {
  /* === Hero background slider === */
  const hero = document.querySelector(".hero");
  const slides = [
    "https://images.unsplash.com/photo-1606813902798-04e7f92eb2e1?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1598300054521-2c9a58c831cc?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613363421383-5a7b8b3e1166?auto=format&fit=crop&w=1600&q=80",
  ];
  let current = 0;
  hero.style.backgroundImage = `url(${slides[current]})`;
  setInterval(() => {
    current = (current + 1) % slides.length;
    hero.style.backgroundImage = `url(${slides[current]})`;
  }, 6000);

  /* === Hide header on scroll down / show on scroll up === */
  let lastScroll = window.scrollY;
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    const sc = window.scrollY;
    if (sc > lastScroll && sc > 120) header.classList.add("hide");
    else header.classList.remove("hide");
    lastScroll = sc;
  });

  /* === Active nav link on scroll === */
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll("nav a");

  function activateLink() {
    const pos = window.scrollY + 160;
    sections.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        links.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`nav a[href="#${s.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", activateLink);
  activateLink();
});
