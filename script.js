document.addEventListener("DOMContentLoaded", () => {
  // 1) Slider
  const slides = document.querySelectorAll(".slide");
  let current = 0;
  if (slides.length) {
    slides.forEach((s,i)=> s.classList.toggle('active', i===0));
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 6000);
  }

  // 2) Hide header on scroll down / show on scroll up
  let lastScroll = window.scrollY || 0;
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    const sc = window.scrollY || 0;
    if (sc > lastScroll && sc > 120) header.classList.add('hide');
    else header.classList.remove('hide');
    lastScroll = sc;
  });

  // 3) Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll("nav a");
  function activateLink(){
    const pos = window.scrollY + 160;
    sections.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`nav a[href="#${s.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', activateLink);
  activateLink(); // initial
});
