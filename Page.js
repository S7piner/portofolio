/* ═════════════════════════════════════════════════════════════════
   D. STÉPHANE WILSON ZANNOU · PORTFOLIO JAVASCRIPT ENGINE
   Micro-interactions, Filtres dynamiques, Toast & Navigation
═════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HEADER DYNAMIQUE AU DÉFILEMENT ── */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── 2. MENU MOBILE BURGER & LIENS ── */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ── 3. DÉFILEMENT FLUIDE (SMOOTH SCROLL) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight + 10 : 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });


  /* ── 4. APPARITION AU SCROLL (REVEAL) ── */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in');
          }, index * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }


  /* ── 5. FILTRAGE DYNAMIQUE DES PROJETS ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'translateY(14px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });


  /* ── 6. NAVIGATION ACTIVE AU SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav a:not(.nav-cta)');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.style.color = '');
          const activeLink = document.querySelector(`#nav a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.style.color = '#38bdf8';
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(sec => navObserver.observe(sec));
  }


  /* ── 7. ANNÉE DU FOOTER AUTOMATIQUE ── */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});


/* ── 8. FONCTION GLOBALE : COPIE DANS LE PRESSE-PAPIER ── */
function copyToClipboard(text, btn) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      notifyCopySuccess(btn, text);
    }).catch(() => {
      fallbackCopyText(text, btn);
    });
  } else {
    fallbackCopyText(text, btn);
  }
}

function fallbackCopyText(text, btn) {
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.focus();
  input.select();
  try {
    document.execCommand('copy');
    notifyCopySuccess(btn, text);
  } catch (err) {
    showAppToast('Copie : ' + text);
  }
  document.body.removeChild(input);
}

function notifyCopySuccess(btn, text) {
  showAppToast(`✓ ${text} copié dans le presse-papier !`);
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check" style="color:#10b981;"></i>';
    btn.style.borderColor = '#10b981';
    btn.style.background = 'rgba(16, 185, 129, 0.15)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.borderColor = '';
      btn.style.background = '';
    }, 2000);
  }
}


/* ── 9. TOAST NOTIFICATION MODERNE ── */
let appToastTimer = null;
function showAppToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (appToastTimer) clearTimeout(appToastTimer);
  appToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}