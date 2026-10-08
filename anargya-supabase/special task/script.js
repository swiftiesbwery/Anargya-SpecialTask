if (document.getElementById('dots')) {
const slides = [
  { logo: true, tag: 'ITS FORMULA EV TEAM', lead: "<b>#AlwaysEnergized</b> | Engineering Indonesia's future in Formula Student electric vehicle innovation." },
  { heading: 'Slide 2', tag: 'OUR CARS', lead: 'Isi slide 2 di sini.' },
  { heading: 'Slide 3', tag: 'ACHIEVEMENTS', lead: 'Isi slide 3 di sini.' },
  { heading: 'Slide 4', tag: 'OFFICIAL SHOP', lead: 'Isi slide 4 di sini.' },
  { heading: 'Slide 5', tag: '9TH GEN', lead: 'Isi slide 5 di sini.' }
];

const SLIDE_MS = 6000;

const tagEl = document.getElementById('tag');
const leadEl = document.getElementById('lead');
const logoEl = document.querySelector('.logo-title');
const headingEl = document.getElementById('heading');
const counterEl = document.getElementById('counter');
const dotsEl = document.getElementById('dots');

document.documentElement.style.setProperty('--dur', SLIDE_MS + 'ms');

const ringSvg =
  '<svg viewBox="0 0 28 28" aria-hidden="true">' +
  '<circle class="track" cx="14" cy="14" r="11"/>' +
  '<circle class="prog" cx="14" cy="14" r="11" pathLength="100"/>' +
  '</svg><i></i>';

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.innerHTML = ringSvg;
  b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  b.addEventListener('click', () => go(i));
  dotsEl.appendChild(b);
});

const dotBtns = [...dotsEl.children];
let current = 0;

function go(i) {
  current = (i + slides.length) % slides.length;

  tagEl.textContent = slides[current].tag;
  leadEl.innerHTML = slides[current].lead;
  counterEl.textContent =
    String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');

  const sl = slides[current];
  logoEl.hidden = !sl.logo;
  headingEl.hidden = !!sl.logo;
  headingEl.textContent = sl.heading || '';

  [tagEl, leadEl, sl.logo ? logoEl : headingEl].forEach(el => {
    el.classList.remove('swap');
    void el.offsetWidth;
    el.classList.add('swap');
  });

  dotBtns.forEach((b, idx) => {
    b.classList.remove('active');
    if (idx === current) {
      void b.offsetWidth;
      b.classList.add('active');
    }
  });
}

// saat cincin penuh, pindah ke slide berikutnya
dotsEl.addEventListener('animationend', e => {
  if (e.target.classList.contains('prog')) go(current + 1);
});

go(0);
}

// menu
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

function setMenu(open) {
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuBtn.setAttribute('aria-expanded', String(open));
}

menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// header jadi gelap saat scroll
const topBar = document.getElementById('top');
const onScroll = () => topBar.classList.toggle('scrolled', topBar.hasAttribute('data-solid') || window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// fade in berulang: muncul tiap elemen masuk layar, hilang saat keluar
const FX = [
  '.hero .tag', '.hero .logo-title', '.hero .slide-heading', '.hero .lead', '.hero .btn', '.counter', '.dots',
  '.tile', '.tile small', '.tile h3', '.tile .spec', '.tile .disc',
  'main small', 'main h2', 'main p', 'main .ul', '.stats > div', '.ghost', '.avatar',
  '.badge', '.hof-cta', '.filters', '.ach-card', '.news-card', '.car-title', '.carstage', '.comp', '.carinfo h3', '.specs > div', '.wins li',
  '.sponsors > *', '.giant', '.foot nav', '.foot p'
];
const fxEls = [...document.querySelectorAll(FX.join(','))].filter(el => !el.closest('.voices'));
fxEls.forEach(el => el.classList.add('fx'));
fxEls.forEach(el => {
  const sibs = [...el.parentElement.children].filter(c => c.classList.contains('fx'));
  const i = Math.min(sibs.indexOf(el), 6);
  const extra = el.parentElement.classList.contains('tile') ? 0.25 : 0;
  el.style.setProperty('--d', (i * 0.1 + extra) + 's');
});
const fxObserver = new IntersectionObserver(entries => {
  entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
fxEls.forEach(el => fxObserver.observe(el));

// mobil timbul: miring mengikuti kursor, terangkat saat hover
document.querySelectorAll('.carstage').forEach(stage => {
  const img = stage.querySelector('.carimg');
  stage.addEventListener('mousemove', e => {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    img.style.setProperty('--ry', (px * 14).toFixed(2) + 'deg');
    img.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
    img.style.setProperty('--ty', '-14px');
    img.style.setProperty('--s', '1.07');
    stage.classList.add('lift');
  });
  stage.addEventListener('mouseleave', () => {
    ['--ry', '--rx', '--ty', '--s'].forEach(p => img.style.removeProperty(p));
    stage.classList.remove('lift');
  });
});

// filter tahun di halaman achievements
const yearBtns = document.querySelectorAll('.filters button');
yearBtns.forEach(btn => btn.addEventListener('click', () => {
  yearBtns.forEach(b => b.classList.toggle('on', b === btn));
  document.querySelectorAll('.ach-card').forEach(card => {
    card.hidden = !(btn.dataset.year === 'all' || card.dataset.year === btn.dataset.year);
  });
}));

// kutipan: kata menyala satu per satu mengikuti scroll
const voiceEls = [...document.querySelectorAll('.voice')];
if (voiceEls.length) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = voiceEls.map(v => {
    const q = v.querySelector('.v-quote');
    const words = q.textContent.trim().split(/\s+/);
    q.setAttribute('aria-label', words.join(' '));
    q.innerHTML = words.map(w => '<span class="w" aria-hidden="true">' + w + '</span>').join(' ');
    return { v, spans: [...q.querySelectorAll('.w')], idn: v.querySelector('.v-id') };
  });
  let queued = false;
  const update = () => {
    queued = false;
    items.forEach(({ v, spans, idn }) => {
      const r = v.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / Math.max(r.height - innerHeight, 1), 0), 1);
      v.style.setProperty('--p', p.toFixed(4));
      const pos = reduce ? spans.length + 3 : Math.min(p / 0.8, 1) * (spans.length + 2);
      spans.forEach((s, i) => {
        s.style.opacity = (0.18 + 0.82 * Math.min(Math.max((pos - i) / 2, 0), 1)).toFixed(3);
      });
      if (idn) idn.style.opacity = reduce ? 1 : Math.min(Math.max((p - 0.78) / 0.12, 0), 1).toFixed(3);
    });
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  update();
}

// PWA: service worker dan tombol install
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
let installEvent = null;
const installBtns = document.querySelectorAll('.install-btn');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); installEvent = e;
  installBtns.forEach(b => { b.hidden = false; });
});
installBtns.forEach(b => b.addEventListener('click', async () => {
  if (!installEvent) return;
  installEvent.prompt();
  await installEvent.userChoice;
  installEvent = null;
  installBtns.forEach(x => { x.hidden = true; });
}));
window.addEventListener('appinstalled', () => installBtns.forEach(b => { b.hidden = true; }));

// hero: foto hitam putih menjadi berwarna, wordmark memudar, judul dan deskripsi muncul saat scroll
const heroEl = document.querySelector('.hero2');
if (heroEl) {
  const c01 = x => Math.min(Math.max(x, 0), 1);
  const seg = (p, a, b) => c01((p - a) / (b - a));
  let heroQueued = false;
  const heroUpdate = () => {
    heroQueued = false;
    const r = heroEl.getBoundingClientRect();
    const p = c01(-r.top / Math.max(r.height - innerHeight, 1));
    heroEl.style.setProperty('--mark', (1 - seg(p, .18, .45)).toFixed(3));
    heroEl.style.setProperty('--color', seg(p, .3, .7).toFixed(3));
    heroEl.style.setProperty('--story', seg(p, .55, .85).toFixed(3));
  };
  const heroRequest = () => { if (!heroQueued) { heroQueued = true; requestAnimationFrame(heroUpdate); } };
  addEventListener('scroll', heroRequest, { passive: true });
  addEventListener('resize', heroRequest);
  heroUpdate();
}
document.querySelectorAll('.giant').forEach(function (el) {
  var t = el.textContent.trim();
  var low = t.toLowerCase();
  var first = low.indexOf('a');
  var last = low.lastIndexOf('a');
  if (first < 0) return;
  el.textContent = '';
  for (var i = 0; i < t.length; i++) {
    if (i === first || i === last) {
      var s = document.createElement('span');
      s.className = 'a';
      s.textContent = t[i];
      el.appendChild(s);
    } else {
      el.appendChild(document.createTextNode(t[i]));
    }
  }
});