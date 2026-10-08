(() => {

  const EDITIONS = [];

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const recap = document.getElementById('recap');
  const list = document.getElementById('recapList');
  if (recap && list && EDITIONS.length) {
    list.replaceChildren(...EDITIONS.map(e => {
      const li = el('li');
      li.appendChild(el('div', 'ac-yr', e.year));
      const body = el('div');
      body.appendChild(el('h3', '', e.title || ''));
      if (e.desc) body.appendChild(el('p', '', e.desc));
      if (e.stats && e.stats.length) {
        const st = el('div', 'ac-stats');
        e.stats.forEach(s => {
          const sp = el('span');
          sp.append(el('b', '', s.v), document.createTextNode(s.k));
          st.appendChild(sp);
        });
        body.appendChild(st);
      }
      li.appendChild(body);
      return li;
    }));
    recap.hidden = false;
  }

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    items.forEach(n => io.observe(n));
  } else {
    items.forEach(n => n.classList.add('in'));
  }
})();