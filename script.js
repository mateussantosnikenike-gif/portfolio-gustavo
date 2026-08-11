/* =========================================================
   Portfólio — Gustavo Pereira Lima
   ========================================================= */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var progressBar = document.getElementById('progressBar');
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('#navLinks a')
  );

  /* ---------- nav: sticky + progresso + scroll-spy ---------- */
  var sections = navAnchors
    .map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    })
    .filter(Boolean);

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    nav.classList.toggle('is-stuck', y > 20);

    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';

    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= 140) current = sections[i];
    }
    navAnchors.forEach(function (a) {
      a.classList.toggle(
        'active',
        !!current && a.getAttribute('href') === '#' + current.id
      );
    });
  }

  var ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- menu mobile ---------- */
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  navAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .ratio');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  /* ---------- contadores animados ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var ioC = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            ioC.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      ioC.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent =
        el.getAttribute('data-to') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- galeria / lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal__item'));
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    var it = items[idx];
    lbImg.src = it.getAttribute('data-src');
    lbImg.alt = it.getAttribute('data-cap') || '';
    lbCap.textContent = it.getAttribute('data-cap') || '';
  }

  function open(i) {
    show(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  items.forEach(function (it, i) {
    it.addEventListener('click', function () {
      open(i);
    });
    it.setAttribute('tabindex', '0');
    it.setAttribute('role', 'button');
    it.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function (e) {
    e.stopPropagation();
    show(idx - 1);
  });
  document.getElementById('lbNext').addEventListener('click', function (e) {
    e.stopPropagation();
    show(idx + 1);
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ---------- parallax suave na capa ---------- */
  var heroImg = document.querySelector('.hero__bg img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroImg.style.transform = 'translate3d(0,' + y * 0.18 + 'px,0) scale(1.06)';
        }
      },
      { passive: true }
    );
  }
})();
