(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Année du pied de page
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');
  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Apparition au défilement
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Lien actif dans le menu selon la section visible
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);
  function setActive() {
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach(function (l) {
      l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  // Visionneuse d'affiches
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var lastFocus = null;
  function openBox(src, alt, trigger) {
    lastFocus = trigger;
    boxImg.src = src;
    boxImg.alt = alt || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeBox() {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () { openBox(b.dataset.zoom, b.dataset.alt, b); });
  });
  closeBtn.addEventListener('click', closeBox);
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) closeBox();
  });
})();
