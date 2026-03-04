/* ═══════════════════════════════════════════════════════════
   Sovereign V25 — Premium Shared JS
   Scroll reveal · Scroll-top · Hamburger · Counter · Site-info
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── 1. IntersectionObserver Scroll Reveal ──
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer;

  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }
    observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
  }

  // Re-observe after dynamic content renders
  window.sovereignReveal = function () {
    if (!observer && !prefersReduced) initReveal();
    if (observer) document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
    if (prefersReduced) document.querySelectorAll('.reveal:not(.revealed)').forEach(el => el.classList.add('revealed'));
  };

  // ── 2. Scroll-to-Top ──
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => { scrollBtn.classList.toggle('show', window.scrollY > 300); }, { passive: true });
  }

  // ── 3. Hamburger Menu Toggle ──
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const nav = document.querySelector('.nav-links');
      if (!nav) return;
      const open = nav.classList.toggle('open');
      this.setAttribute('aria-expanded', open);
      this.innerHTML = open ? '&times;' : '&#9776;';
    });
  }

  // ── 4. Number Counter Animation ──
  window.animateValue = function (el, start, end, duration, decimals, suffix) {
    decimals = decimals || 0;
    suffix = suffix || '';
    if (prefersReduced || !el) { el.textContent = end.toFixed(decimals) + suffix; return; }
    const range = end - start;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  // ── 5. Site-Info Brand + Timestamp ──
  fetch('data/site-info.json?t=' + Date.now())
    .then(r => r.json())
    .then(info => {
      const b = document.querySelector('.brand');
      if (b && info.label) b.textContent = info.label;
      const el = document.getElementById('site-updated');
      const page = document.body.dataset.page || '';
      const ts = info.updated && info.updated[page];
      if (ts && el) {
        const d = new Date(ts);
        el.textContent = '\u6700\u5f8c\u66f4\u65b0\uff1a' + d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
          ' ' + d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    })
    .catch(() => {});

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();
