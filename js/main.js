/* ============================================
   main.js — Justine Serdinola Portfolio
   Scroll-Snap + Navbar Sync + All Features
   ============================================ */

/* ─────────────────────────────────────────────
   1. THEME TOGGLE
───────────────────────────────────────────── */
const root         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* ─────────────────────────────────────────────
   2. SINGLE-PAGE SCROLL + NAVBAR SYNC
   Works on index.html (snap-sections exist)
───────────────────────────────────────────── */
const scrollContainer = document.getElementById('scrollContainer');
const snapSections    = document.querySelectorAll('.snap-section');
const navLinks        = document.querySelectorAll('.nav-link[data-section]');
const dotBtns         = document.querySelectorAll('.dot-btn[data-target]');

if (scrollContainer && snapSections.length) {

  /* ── 2a. IntersectionObserver — watches which section is visible ── */
  let activeSection = 'home';

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const id = entry.target.getAttribute('id');
          if (id && id !== activeSection) {
            activeSection = id;
            updateActiveNav(id);
          }
        }
      });
    },
    {
      root: scrollContainer,          // observe inside scroll container
      threshold: 0.5,                 // 50% visible triggers update
      rootMargin: '0px'
    }
  );

  snapSections.forEach(sec => sectionObserver.observe(sec));

  /* ── 2b. Update navbar + dots ── */
  function updateActiveNav(sectionId) {
    // Navbar links
    navLinks.forEach(link => {
      const matches = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', matches);
    });
    // Side dots
    dotBtns.forEach(dot => {
      const matches = dot.getAttribute('data-target') === sectionId;
      dot.classList.toggle('active', matches);
    });
  }

  // Set initial active state
  updateActiveNav('home');

  /* ── 2c. Click nav links → smooth scroll to section ── */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const sectionId = link.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (!target) return;

      // Only prevent default for #hash links (not external hrefs)
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
      } else {
        return; // let normal navigation happen (project pages)
      }

      // Smooth scroll within the container
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update active immediately on click (don't wait for observer)
      updateActiveNav(sectionId);

      // Close mobile menu if open
      navMenu && navMenu.classList.remove('open');
      burger && burger.classList.remove('open');
    });
  });

  /* ── 2d. Click side dots → scroll to section ── */
  dotBtns.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.getAttribute('data-target');
      const target = document.getElementById(sectionId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateActiveNav(sectionId);
    });
  });

  /* ── 2e. Keyboard arrow navigation ── */
  const sectionIds = Array.from(snapSections).map(s => s.id);

  document.addEventListener('keydown', e => {
    // Only when not focused in a form field
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    let idx = sectionIds.indexOf(activeSection);
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      idx = Math.min(idx + 1, sectionIds.length - 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      idx = Math.max(idx - 1, 0);
    } else {
      return;
    }
    const target = document.getElementById(sectionIds[idx]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateActiveNav(sectionIds[idx]);
    }
  });
}

/* ─────────────────────────────────────────────
   3. MULTI-PAGE NAVBAR (project detail pages)
   These pages don't have .snap-section
───────────────────────────────────────────── */
if (!scrollContainer) {
  // Highlight nav based on current filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─────────────────────────────────────────────
   4. MOBILE BURGER MENU
───────────────────────────────────────────── */
const burger  = document.getElementById('navBurger');
const navMenu = document.getElementById('navLinks');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });
  // Close on any link click
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });
}

/* ─────────────────────────────────────────────
   5. PROFILE IMAGE AUTO-LOAD
───────────────────────────────────────────── */
const profileContainer = document.getElementById('profileContainer');
if (profileContainer) {
  const img  = new Image();
  img.onload = () => {
    profileContainer.innerHTML =
      '<img src="assets/profile.jpg" alt="Justine Serdinola" class="profile-img" />';
  };
  img.onerror = () => {
    profileContainer.innerHTML = `
      <div class="profile-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Add photo as<br><code>assets/profile.jpg</code></span>
      </div>`;
  };
  img.src = 'assets/profile.jpg?t=' + Date.now();
}

/* ─────────────────────────────────────────────
   6. SCROLL FADE-IN (detail pages + about cards)
───────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.skill-card, .project-card, .feature-item, .help-pill, .contact-item'
).forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.45s ease ${i * 0.035}s, transform 0.45s ease ${i * 0.035}s`;
  fadeObserver.observe(el);
});

/* ─────────────────────────────────────────────
   7. CONTACT FORM
───────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = '✓ Message sent!';
    btn.style.background = '#22c55e';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

/* ─────────────────────────────────────────────
   8. SCREENSHOT GALLERY (project detail pages)
───────────────────────────────────────────── */
const galleryContainer = document.getElementById('screenshotGallery');
if (galleryContainer) {
  const folder = galleryContainer.getAttribute('data-folder');
  if (folder) loadScreenshots(folder, galleryContainer);
}

function loadScreenshots(folder, container) {
  const base = `assets/${folder}/`;
  container.innerHTML = '<div class="screenshot-loading">Loading screenshots...</div>';

  // Try manifest.json first for explicit ordered list
  fetch(base + 'manifest.json')
    .then(r => { if (!r.ok) throw new Error('no manifest'); return r.json(); })
    .then(m => {
      if (m.images && m.images.length) {
        renderGallery(container, m.images.map(f => base + f));
      } else {
        fallbackScan(base, container);
      }
    })
    .catch(() => fallbackScan(base, container));
}

function fallbackScan(base, container) {
  // Try numbered filenames 1–20 across common extensions
  const candidates = [];
  for (let i = 1; i <= 20; i++) {
    ['jpg','jpeg','png','webp'].forEach(ext => {
      candidates.push(`${i}.${ext}`);
      candidates.push(`screenshot${i}.${ext}`);
    });
  }

  Promise.all(
    candidates.map(name => new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(base + name);
      img.onerror = () => resolve(null);
      img.src = base + name + '?t=' + Date.now();
    }))
  ).then(results => {
    const found = [...new Set(results.filter(Boolean))];
    found.sort((a, b) => {
      const n = s => parseInt(s.replace(/\D+/g, '')) || 0;
      return n(a) - n(b);
    });
    renderGallery(container, found);
  });
}

function renderGallery(container, images) {
  if (!images.length) {
    container.innerHTML = `
      <div class="no-screenshots">
        <span>📸</span>
        No screenshots yet.<br>
        <small>Drop images into <code>assets/${container.dataset.folder}/</code> — they'll appear here automatically.</small>
      </div>`;
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'screenshot-grid';
  images.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'screenshot-item';
    const img = document.createElement('img');
    img.src    = src;
    img.alt    = `Screenshot ${i + 1}`;
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightbox(src));
    item.appendChild(img);
    grid.appendChild(item);
  });
  container.innerHTML = '';
  container.appendChild(grid);
}

/* ─────────────────────────────────────────────
   9. LIGHTBOX
───────────────────────────────────────────── */
function openLightbox(src) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `<span class="lightbox-close" id="lbClose">&times;</span>
                    <img id="lightboxImg" src="" alt="Preview" />`;
    document.body.appendChild(lb);
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }
  document.getElementById('lightboxImg').src = src;
  requestAnimationFrame(() => lb.classList.add('open'));
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}
