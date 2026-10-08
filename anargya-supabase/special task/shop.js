(() => {
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const setImg = (node, src) => {
    node.style.backgroundImage = src ? 'url("' + String(src).replace(/"/g, '%22') + '")' : '';
  };

  if (!document.getElementById('toast-style')) {
    const st = document.createElement('style');
    st.id = 'toast-style';
    st.textContent =
      '#toast{position:fixed;left:50%;bottom:28px;z-index:30;max-width:90vw;padding:12px 22px;background:#0e2b21;color:#ece7da;' +
      'border:.5px solid #2fd36b;font-size:.9rem;letter-spacing:.02em;opacity:0;transform:translate(-50%,12px);pointer-events:none;' +
      'transition:opacity .25s,transform .25s}#toast.show{opacity:1;transform:translate(-50%,0)}';
    document.head.appendChild(st);
  }

  const grid = $('grid'), cats = $('cats'), q = $('q'), sort = $('sort'), count = $('count');
  const dlg = $('dlg'), scrim = $('scrim'), drawer = $('drawer');

  const state = { cat: 'All', q: '', sort: 'new' };
  const dState = { p: null, size: '', qty: 1 };

  function visibleProducts() {
    const all = Store.products().map((p, i) => ({ p, i }));
    const term = state.q.trim().toLowerCase();
    let list = all.filter(({ p }) => {
      if (state.cat !== 'All' && p.category !== state.cat) return false;
      if (!term) return true;
      return (p.name + ' ' + (p.desc || '') + ' ' + (p.category || '')).toLowerCase().includes(term);
    });
    const by = {
      new: (a, b) => a.i - b.i,
      low: (a, b) => a.p.price - b.p.price,
      high: (a, b) => b.p.price - a.p.price,
      name: (a, b) => a.p.name.localeCompare(b.p.name)
    }[state.sort] || ((a, b) => a.i - b.i);
    return list.sort(by).map(x => x.p);
  }

  function renderCats() {
    const names = ['All', ...new Set(Store.products().map(p => p.category).filter(Boolean))];
    if (!names.includes(state.cat)) state.cat = 'All';
    cats.replaceChildren(...names.map(n => {
      const b = el('button', n === state.cat ? 'on' : '', n);
      b.type = 'button';
      b.addEventListener('click', () => { state.cat = n; renderCats(); renderGrid(); });
      return b;
    }));
  }

  function renderGrid() {
    const list = visibleProducts();
    count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    if (!list.length) {
      grid.replaceChildren(el('p', 'empty', 'No products match your search.'));
      return;
    }
    const newIds = new Set(Store.products().slice(0, 3).map(p => p.id));

    grid.replaceChildren(...list.map((p, i) => {
      const soldOut = p.stock <= 0;
      const card = el('article', 'p-card' + (soldOut ? ' soldout' : ''));
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', p.name + ', ' + Store.fmt(p.price));
      card.style.animationDelay = Math.min(i, 12) * 55 + 'ms';

      const img = el('div', 'p-img cham');
      const bg = el('div', 'p-bg');
      setImg(bg, p.image);
      img.append(bg, el('div', 'p-glow'));
      img.appendChild(el('span', 'p-cat', p.category || ''));
      if (soldOut) img.appendChild(el('span', 'p-tag p-out', 'Sold out'));
      else if (newIds.has(p.id)) img.appendChild(el('span', 'p-tag p-new', 'New'));
      else if (p.stock <= 5) img.appendChild(el('span', 'p-tag p-low', 'Low stock'));

      const hv = el('div', 'p-hover');
      const sizes = el('div', 'p-sizes');
      const sz = Array.isArray(p.sizes) ? p.sizes : [];
      if (sz.length) sz.forEach(s => sizes.appendChild(el('span', '', s)));
      else sizes.appendChild(el('span', '', 'One size'));
      const cta = el('span', 'p-cta');
      cta.append(el('span', '', 'Quick view'), el('i', '', '\u2192'));
      hv.append(sizes, cta);
      img.appendChild(hv);

      const info = el('div', 'p-info');
      const meta = el('div', 'p-meta');
      meta.append(el('b', '', Store.fmt(p.price)), el('span', 'p-no', String(i + 1).padStart(2, '0')));
      info.append(el('h3', '', p.name), meta);

      card.append(img, info);

      card.addEventListener('pointermove', e => {
        const r = img.getBoundingClientRect();
        img.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        img.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });

      const open = () => openProduct(p.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      return card;
    }));
  }

  q.addEventListener('input', () => { state.q = q.value; renderGrid(); });
  sort.addEventListener('change', () => { state.sort = sort.value; renderGrid(); });

  function renderDialog() {
    const p = dState.p;
    const max = Math.max(p.stock, 0);
    dState.qty = Math.min(Math.max(dState.qty, 1), Math.max(max, 1));
    $('dQty').textContent = dState.qty;
    $('dStock').textContent = max > 0 ? (max <= 5 ? 'Only ' + max + ' left' : max + ' in stock') : 'Out of stock';
    const add = $('dAdd');
    add.disabled = max <= 0;
    add.textContent = max > 0 ? 'Add to cart' : 'Sold out';
    $('dMinus').disabled = dState.qty <= 1;
    $('dPlus').disabled = dState.qty >= max;
  }

  function openProduct(id) {
    const p = Store.product(id);
    if (!p) return;
    dState.p = p; dState.size = ''; dState.qty = 1;
    setImg($('dImg'), p.image);
    $('dCat').textContent = p.category || '';
    $('dName').textContent = p.name;
    $('dPrice').textContent = Store.fmt(p.price);
    $('dDesc').textContent = p.desc || '';

    const sizes = Array.isArray(p.sizes) ? p.sizes : [];
    $('dSizesWrap').hidden = !sizes.length;
    $('dSizes').replaceChildren(...sizes.map(s => {
      const b = el('button', '', s);
      b.type = 'button';
      b.addEventListener('click', () => {
        dState.size = s;
        $('dSizes').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      });
      return b;
    }));
    renderDialog();
    if (!dlg.open) dlg.showModal();
  }

  $('dClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  $('dMinus').addEventListener('click', () => { dState.qty--; renderDialog(); });
  $('dPlus').addEventListener('click', () => { dState.qty++; renderDialog(); });
  $('dAdd').addEventListener('click', () => {
    const p = dState.p;
    if (!p) return;
    if (p.sizes && p.sizes.length && !dState.size) { Store.toast('Please choose a size'); return; }
    if (!Store.addToCart(p.id, dState.size || '', dState.qty)) { Store.toast('Not enough stock for that quantity'); return; }
    Store.toast('Added to cart');
    dlg.close();
    renderCart();
    openDrawer();
  });

  function openDrawer() { renderCart(); drawer.classList.add('open'); scrim.classList.add('open'); }
  function closeDrawer() { drawer.classList.remove('open'); scrim.classList.remove('open'); }

  function renderCart() {
    const lines = Store.cartLines();
    const list = $('cartList');
    const go = $('goCheckout');
    $('cartTotal').textContent = Store.fmt(Store.cartTotal());
    Store.badge();
    go.classList.toggle('disabled', !lines.length);

    if (!lines.length) {
      list.replaceChildren(el('p', 'empty', 'Your cart is empty.'));
      return;
    }
    list.replaceChildren(...lines.map((l, i) => {
      const row = el('div', 'c-line');
      const thumb = el('div', 'c-thumb');
      setImg(thumb, l.p.image);

      const main = el('div', 'c-main');
      main.appendChild(el('b', '', l.p.name));
      main.appendChild(el('span', '', (l.size ? 'Size ' + l.size + ' · ' : '') + Store.fmt(l.p.price)));
      const qty = el('div', 'qty');
      const minus = el('button', '', '−'); minus.type = 'button'; minus.setAttribute('aria-label', 'Decrease');
      const plus = el('button', '', '+'); plus.type = 'button'; plus.setAttribute('aria-label', 'Increase');
      plus.disabled = l.qty >= l.p.stock;
      minus.addEventListener('click', () => { Store.setQty(i, l.qty - 1); renderCart(); });
      plus.addEventListener('click', () => { Store.setQty(i, l.qty + 1); renderCart(); });
      qty.append(minus, el('span', '', String(l.qty)), plus);
      main.appendChild(qty);

      const end = el('div', 'c-end');
      end.appendChild(el('b', '', Store.fmt(l.line)));
      const rm = el('button', '', 'Remove'); rm.type = 'button';
      rm.addEventListener('click', () => { Store.setQty(i, 0); renderCart(); });
      end.appendChild(rm);

      row.append(thumb, main, end);
      return row;
    }));
  }

  $('cartBtn').addEventListener('click', e => { e.preventDefault(); openDrawer(); });
  $('cClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  $('goCheckout').addEventListener('click', e => { if (!Store.cartCount()) e.preventDefault(); });

  renderCats();
  renderGrid();
  renderCart();
  if (new URLSearchParams(location.search).get('cart') === '1') openDrawer();

  Store.init()
  .then(() => { renderCats(); renderGrid(); renderCart(); })
  .catch(e => console.error('Could not refresh products', e));
  
})();

