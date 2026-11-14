/* Pooja Pradeep portfolio: interactions */
(function () {
  'use strict';

  /* ---------- Comment explainer demo ----------
     A tiny hand-made word list that imitates how LIME shows word-level
     contributions. Positive weight pushes towards Toxic, negative towards Clean. */
  var WEIGHTS = {
    stupid: 3.2, idiot: 3.2, dumb: 2.6, moron: 3.2, hate: 2.2, shut: 1.6, ugly: 2.4,
    loser: 2.6, trash: 2.0, pathetic: 2.4, worthless: 2.8, nobody: 0.7, useless: 2.2,
    thanks: -1.8, thank: -1.8, great: -1.4, helpful: -1.6, agree: -1.0, please: -1.0,
    interesting: -1.1, appreciate: -1.6, good: -1.0, love: -0.9, nice: -1.2, sorry: -0.8
  };
  var STOP = /^(a|an|the|and|or|to|of|is|are|so|in|on|it|you|your|i|my|we|for|that|this|they|with|be|at|as|do|if)$/;
  var BIAS = 1.6;

  var input = document.getElementById('labInput');
  var wordsEl = document.getElementById('labWords');
  var barClean = document.getElementById('barClean');
  var barToxic = document.getElementById('barToxic');
  var pClean = document.getElementById('pClean');
  var pToxic = document.getElementById('pToxic');

  function analyse() {
    var tokens = input.value.match(/[A-Za-z']+/g) || [];
    var total = 0;
    wordsEl.textContent = '';
    tokens.forEach(function (raw) {
      var w = raw.toLowerCase();
      if (STOP.test(w)) return;
      var weight = WEIGHTS[w] || 0;
      total += weight;
      var chip = document.createElement('span');
      chip.textContent = raw;
      if (weight > 0) {
        var a = Math.min(0.9, 0.2 + weight / 4);
        chip.style.background = 'rgba(255,43,214,' + a + ')';
        chip.style.color = a > 0.55 ? '#fff' : 'inherit';
        chip.title = 'Pushes towards Toxic (+' + weight.toFixed(1) + ')';
      } else if (weight < 0) {
        var b = Math.min(0.85, 0.2 + Math.abs(weight) / 3);
        chip.style.background = 'rgba(0,240,255,' + b + ')';
        chip.style.color = b > 0.55 ? '#031018' : 'inherit';
        chip.title = 'Pushes towards Clean (' + weight.toFixed(1) + ')';
      } else {
        chip.style.borderColor = 'var(--line)';
        chip.title = 'No strong effect';
      }
      wordsEl.appendChild(chip);
    });
    var toxic = 1 / (1 + Math.exp(-(total - BIAS)));
    var tPct = Math.round(toxic * 100);
    barToxic.style.width = tPct + '%';
    barClean.style.width = (100 - tPct) + '%';
    pToxic.textContent = tPct + '%';
    pClean.textContent = (100 - tPct) + '%';
  }
  input.addEventListener('input', analyse);
  analyse();

  /* ---------- Animated counters ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function count(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { count(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(count);
  }

  /* ---------- Project filters ---------- */
  var buttons = document.querySelectorAll('.filters button');
  var cards = document.querySelectorAll('.card');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.dataset.f;
      cards.forEach(function (c) {
        c.classList.toggle('hide', f !== 'all' && c.dataset.c !== f);
      });
    });
  });

  /* ---------- Expandable project cards ---------- */
  cards.forEach(function (card) {
    var t = card.querySelector('.toggle');
    t.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      t.setAttribute('aria-expanded', open);
      t.textContent = open ? 'Hide details' : 'Show details';
    });
  });

  /* ---------- Scroll progress + footer year ---------- */
  var bar = document.getElementById('progress');
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }, { passive: true });
  document.getElementById('yr').textContent = new Date().getFullYear();
})();

/* ---------- Dark neon layer: typing, 3D tilt, reveal, particles, cursor glow ---------- */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* Typing role line */
  var roles = ['Software Developer', 'Data Science enthusiast', 'ML & NLP builder', 'Business analytics learner', 'Python & Flask developer'];
  var typed = document.getElementById('typed');
  var ri = 0, ci = 0, del = false;
  function type() {
    var word = roles[ri];
    typed.textContent = word.slice(0, ci);
    if (!del && ci < word.length) ci++;
    else if (!del) { del = true; return setTimeout(type, 1400); }
    else if (ci > 0) ci--;
    else { del = false; ri = (ri + 1) % roles.length; }
    setTimeout(type, del ? 35 : 70);
  }
  if (reduce) typed.textContent = roles[0]; else type();

  /* 3D tilt */
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt], .card, .stats div').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt || 8);
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (x * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * max * 2).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
    var glow = document.getElementById('glow');
    window.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* Scroll reveal */
  var targets = document.querySelectorAll('section h2, .intro, .lab, .card, .job, .timeline li, .skills > div, .facts li, #about p, .contact p, .contact .cta, .stats div');
  if ('IntersectionObserver' in window && !reduce) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (t, i) {
      t.classList.add('rv'); t.style.transitionDelay = (i % 4) * 70 + 'ms'; obs.observe(t);
    });
  }

  /* Neon particle network */
  var cv = document.getElementById('bg');
  if (!cv.getContext || reduce) return;
  var ctx = cv.getContext('2d'), W, H, pts = [], mouse = { x: -999, y: -999 };
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    W /= d; H /= d;
    var n = Math.round(Math.min(90, W * H / 14000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, c: i % 3 ? '0,240,255' : '255,43,214' });
  }
  window.addEventListener('resize', size); size();
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function (p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      var mx = mouse.x - p.x, my = mouse.y - p.y, md = Math.hypot(mx, my);
      if (md < 140) { p.x -= mx / md * 0.8; p.y -= my / md * 0.8; }
      ctx.fillStyle = 'rgba(' + p.c + ',.9)'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { ctx.strokeStyle = 'rgba(' + p.c + ',' + (0.22 * (1 - d / 120)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  })();
})();

/* ---------- Recruiter polish: scroll-spy, metric bars, reveal, magnetic buttons ---------- */
(function () {
  'use strict';
  var links = document.querySelectorAll('.nav nav a[href^="#"]:not(.pill)');
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.m b').forEach(function (b) { b.style.width = b.dataset.v * 100 + '%'; }); return; }
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('.m b').forEach(function (b) { b.style.width = b.dataset.v * 100 + '%'; });
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.pillar, .metrics, .steps > div').forEach(function (el, i) {
    if (!reduce) { el.classList.add('rv'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; }
    io.observe(el);
  });

  if (window.matchMedia('(pointer: fine)').matches && !reduce) {
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }
})();
