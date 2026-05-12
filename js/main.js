/* main.js — Portfolio interactions & animations */
(function () {
  'use strict';

  /* -------- PAGE LOADER -------- */
  function initLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-logo">&lt;MAL/&gt;</div>
      <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>
    `;
    document.body.prepend(loader);
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 600);
    }, 1400);
  }
  initLoader();

  /* -------- CUSTOM CURSOR -------- */
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (dot && outline) {
    let ox = 0, oy = 0;
    document.addEventListener('mousemove', e => {
      const { clientX: x, clientY: y } = e;
      dot.style.left = x + 'px';
      dot.style.top  = y + 'px';
      ox += (x - ox) * 0.15;
      oy += (y - oy) * 0.15;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
    });
    function animateCursor() {
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* -------- NAVBAR SCROLL -------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightNav();
  }, { passive: true });

  /* -------- HAMBURGER -------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* -------- ACTIVE NAV HIGHLIGHT -------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  highlightNav();

  /* -------- TYPEWRITER -------- */
  const phrases = [
    'CSE (AI & ML) Student',
    'AI Enthusiast',
    'Problem Solver',
    'ML Explorer',
    'Open Source Contributor'
  ];
  const tw = document.getElementById('typewriter');
  if (tw) {
    let pi = 0, ci = 0, deleting = false;
    function type() {
      const phrase = phrases[pi];
      if (!deleting) {
        tw.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(type, 1600); return; }
      } else {
        tw.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, deleting ? 45 : 80);
    }
    setTimeout(type, 600);
  }

  /* -------- INTERSECTION OBSERVER (REVEAL) -------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
        // Trigger skill bars
        const bars = e.target.querySelectorAll('.skill-fill');
        bars.forEach(b => {
          setTimeout(() => { b.style.width = b.dataset.width + '%'; }, 300);
        });
        // Trigger counters
        const nums = e.target.querySelectorAll('.stat-num');
        nums.forEach(animateCounter);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObs.observe(el));

  // Also observe skills section parent to trigger bars
  const skillsFills = document.querySelectorAll('.skill-fill');
  const skillsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        skillsFills.forEach(b => { b.style.width = b.dataset.width + '%'; });
        skillsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const skillsSec = document.getElementById('skills');
  if (skillsSec) skillsObs.observe(skillsSec);

  /* -------- COUNTER ANIMATION -------- */
  function animateCounter(el) {
    const target = +el.dataset.target;
    if (!target) return;
    let current = 0;
    const step  = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + '+';
      if (current >= target) clearInterval(timer);
    }, 40);
  }

  /* -------- PROJECT CARD GLOW COLOR -------- */
  document.querySelectorAll('.project-card').forEach(card => {
    const color = card.dataset.color || '#00d4ff';
    const glow  = card.querySelector('.card-glow');
    if (glow) {
      const hex = color.replace('#','');
      const r = parseInt(hex.slice(0,2),16);
      const g = parseInt(hex.slice(2,4),16);
      const b = parseInt(hex.slice(4,6),16);
      glow.style.background = `radial-gradient(circle at 50% -10%, rgba(${r},${g},${b},0.1) 0%, transparent 70%)`;
    }
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(${
        parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)}, 0.2)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  /* -------- SMOOTH SCROLL -------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -------- CONTACT FORM -------- */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const success = document.getElementById('form-success');
    if (success) {
      success.classList.remove('hidden');
      e.target.reset();
      setTimeout(() => success.classList.add('hidden'), 4000);
    }
  };

  /* -------- SECTION LABELS STAGGER -------- */
  setTimeout(() => {
    document.querySelectorAll('.hero-badge, .hero-name, .hero-subtitle, .hero-intro, .hero-cta, .hero-socials, .hero-visual').forEach((el, i) => {
      el.style.transitionDelay = i * 0.12 + 's';
      el.classList.add('visible');
    });
  }, 1500);

})();
