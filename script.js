const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const cursorGlow = document.querySelector('.cursor-glow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
  mobileNav?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
  mobileNav?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const updateScrollUI = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  if (progress) progress.style.width = `${ratio * 100}%`;
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${-y * 2.4}deg) rotateY(${x * 2.4}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
