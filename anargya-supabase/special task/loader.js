(function () {
  var html = '<div id="anl-loader" role="status" aria-live="polite" aria-label="Memuat halaman">\n  <div class="anl-track">\n    <div class="anl-content">\n      <!-- Ganti SVG ini dengan logo asli tim: <img class="anl-logo" src="logo.svg" alt=""> -->\n      <svg class="anl-logo" viewBox="0 0 200 60" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" aria-hidden="true">\n        <path d="M6 54 C46 54 58 6 100 6 C142 6 154 54 194 54"/>\n        <path d="M6 6 C46 6 58 54 100 54 C142 54 154 6 194 6"/>\n      </svg>\n      <p class="anl-name">ITS Formula EV Team</p>\n      <div class="anl-bar"><span id="anl-fill"></span></div>\n      <div class="anl-percent" id="anl-percent">0%</div>\n    </div>\n  </div>\n</div>';
  document.body.insertAdjacentHTML('afterbegin', html);
})();

(function () {
  var loader  = document.getElementById('anl-loader');
  var fill    = document.getElementById('anl-fill');
  var percent = document.getElementById('anl-percent');
  var MIN_MS  = 900;          // durasi minimum tampil
  var progress = 0, timer = null, startedAt = Date.now();

  function render(p) {
    progress = Math.min(100, Math.round(p));
    fill.style.width = progress + '%';
    percent.textContent = progress + '%';
  }

  function start() {
    startedAt = Date.now();
    render(0);
    loader.classList.remove('hide');
    clearInterval(timer);
    timer = setInterval(function () {
      if (progress < 90) render(progress + (90 - progress) * 0.08 + 0.5);
    }, 80);
  }

  function finish() {
    var wait = Math.max(0, MIN_MS - (Date.now() - startedAt));
    setTimeout(function () {
      clearInterval(timer);
      render(100);
      setTimeout(function () { loader.classList.add('hide'); }, 350);
    }, wait);
  }

  start();
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.hash && url.pathname === location.pathname) return;
    start();
  });

  window.addEventListener('pageshow', function (e) { if (e.persisted) finish(); });

  window.PageLoader = { show: start, hide: finish };
})();