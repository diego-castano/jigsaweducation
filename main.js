// Active section highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`nav a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.2 });

sections.forEach(s => obs.observe(s));

// Back to top visibility
window.addEventListener('scroll', () => {
  document.getElementById('btt').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Accordion
function toggleQ(btn) {
  btn.closest('.q-group').classList.toggle('open');
}

// Recommendation cards expand/collapse
function toggleRec(head) {
  head.closest('.rec-card').classList.toggle('open');
}

// Mobile sidebar
const menuBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

const hamburgerIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const closeIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

menuBtn.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menuBtn.innerHTML = open ? closeIcon : hamburgerIcon;
});

document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
    menuBtn.innerHTML = hamburgerIcon;
  }
});

navLinks.forEach(l => l.addEventListener('click', () => {
  sidebar.classList.remove('open');
  menuBtn.innerHTML = hamburgerIcon;
}));
