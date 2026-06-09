/* ═══════════════════════════════════════
   WILSON ZANNOU · PORTFOLIO JS
═══════════════════════════════════════ */

/* ── HEADER : apparaît au scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── MENU BURGER (mobile) ── */
const burger  = document.getElementById('burger');
const nav     = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Fermer le menu en cliquant sur un lien
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('header').offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - offset,
      behavior: 'smooth'
    });
  });
});


/* ── RÉVÈLE LES ÉLÉMENTS AU SCROLL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    // Délai progressif pour les éléments côte à côte
    setTimeout(() => {
      entry.target.classList.add('in');
    }, i * 100);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── BARRES DE COMPÉTENCES (animées au scroll) ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.sk-fill').forEach(fill => {
      const w = fill.dataset.w;
      if (w) fill.style.width = w + '%';
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));


/* ── COPIER DANS LE PRESSE-PAPIER ── */
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✓ Copié dans le presse-papier !');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
  }).catch(() => {
    showToast('Copie manuelle : ' + text);
  });
}


/* ── TOAST (notification) ── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ── ANNÉE DANS LE FOOTER ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── LIEN ACTIF DANS LA NAV AU SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#nav a:not(.nav-btn)');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`#nav a[href="#${entry.target.id}"]`);
      if (active) active.style.color = '#a78bfa';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));