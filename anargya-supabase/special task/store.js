const Store = (() => {
  const K = { p: 'anargya_products', c: 'anargya_cart', o: 'anargya_orders', s: 'anargya_seed_v5' };
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  const seed = [
    { id: 'p22', name: '8th GEN Keychain', price: 15000, category: 'Collectibles', stock: 100, sizes: [], desc: 'Keychain celebrating the 8th generation of the Anargya team.', image: 'assets/shop/keychain-8th-gen.jpg' },
    { id: 'p21', name: 'Anargya T-Shirt Black "History"', price: 130000, category: 'Apparel', stock: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Black Anargya tee from the "History" collection. Soft cotton, made to carry the story of the team.', image: 'assets/shop/tee-history-black.jpg' },
    { id: 'p20', name: 'Anargya T-Shirt White "History"', price: 130000, category: 'Apparel', stock: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'White Anargya tee from the "History" collection. Soft cotton, made to carry the story of the team.', image: 'assets/shop/tee-history-white.jpg' },
    { id: 'p19', name: 'Anargya Strap', price: 20000, category: 'Accessories', stock: 100, sizes: [], desc: 'Anargya strap in team colors. A simple way to carry your keys, ID or badge.', image: 'assets/shop/anargya-strap.jpg' },
    { id: 'p18', name: 'Keychain F1 Chill Guys', price: 15000, category: 'Collectibles', stock: 100, sizes: [], desc: 'F1 Chill Guys keychain. Relaxed on the outside, racing on the inside.', image: 'assets/shop/keychain-f1-chillguys.jpg' },
    { id: 'p17', name: 'Gold Thunder Jersey', price: 125000, category: 'Apparel', stock: 40, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'The Anargya team jersey in the Gold Thunder edition. Lightweight, breathable and made to be worn on and off the track.', image: 'assets/shop/jersey-gold-thunder.jpg' },
    { id: 'p16', name: 'ANR 2025 Workshirt', price: 160000, category: 'Apparel', stock: 30, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'The ANR 2025 workshirt, the crew shirt for garage days and race weekends. Built tough, with the Anargya mark.', image: 'assets/shop/workshirt-2025.jpg' },
    { id: 'p15', name: 'Mark 4.0 T-Shirt Black', price: 115000, category: 'Apparel', stock: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Black cotton tee celebrating the Mark 4.0 car. Dark, bold, built for night runs.', image: 'assets/shop/tee-mark4-black.jpg' },
    { id: 'p14', name: 'Keychain ANR Mark 1-4', price: 15000, category: 'Collectibles', stock: 100, sizes: [], desc: 'Keychain from the ANR Mark 1 to Mark 4 series. Collect the cars that started it all.', image: 'assets/shop/keychain-mark1-4.jpg' },
    { id: 'p7', name: 'ANR Tee Black', price: 149000, category: 'Apparel', stock: 60, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Dark, bold, built for night runs. Heavy cotton tee in black with the rising-sun car print on the chest and katakana "Champion" lettering.', image: 'assets/shop/tee-black.jpg' },
    { id: 'p8', name: 'ANR Tee White', price: 149000, category: 'Apparel', stock: 60, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Clean lines, sharp looks, built to stand out. Soft white cotton tee with the Anargya car and red sun on the chest.', image: 'assets/shop/tee-white.jpg' },
    { id: 'p9', name: 'Mark 4.0 Back-Print Tee', price: 179000, category: 'Apparel', stock: 35, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'White tee with a full-size Mark 4.0 race photo print on the back and a small Mark 4.0 tag on the chest. Which crew you ride with?', image: 'assets/shop/tee-mark4.jpg' },
    { id: 'p10', name: 'Pit Lanyard', price: 45000, category: 'Accessories', stock: 80, sizes: [], desc: 'Woven black lanyard with Anargya ITS Formula EV Team lettering, green racing stripes and a metal clip. Garage essentials, pocket-sized.', image: 'assets/shop/lanyard.jpg' },
    { id: 'p11', name: 'Driver Acrylic Keychain', price: 35000, category: 'Collectibles', stock: 90, sizes: [], desc: 'Double-sided acrylic keychain of the Anargya driver in a green-visor helmet. Pairs with the Pit Lanyard.', image: 'assets/shop/keychain.jpg' },
    { id: 'p4', name: 'Sticker Pack', price: 10000, category: 'Accessories', stock: 100, sizes: [], desc: 'Set of weatherproof stickers for laptops and helmets.', image: 'assets/shop/sticker-pack.jpg' }
  ];
  if (localStorage.getItem(K.p) === null) {
    write(K.p, seed);
    write(K.s, true);
  } else if (localStorage.getItem(K.s) === null) {
    const cur = read(K.p, []);
    const ids = new Set(cur.map(p => p.id));
    const REFRESH = ['p4'];
    const REMOVE = ['p1', 'p2', 'p3', 'p5', 'p6', 'p12', 'p13'];
    const merged = cur.filter(p => !REMOVE.includes(p.id)).map(p => {
      const s = REFRESH.includes(p.id) && seed.find(x => x.id === p.id);
      return s ? { ...p, name: s.name, price: s.price, category: s.category, sizes: s.sizes, desc: s.desc, image: s.image } : p;
    });
    write(K.p, seed.filter(p => !ids.has(p.id)).concat(merged));
    write(K.s, true);
  }

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');

  const parseSizes = v => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.trim()) {
      try { const j = JSON.parse(v); if (Array.isArray(j)) return j; } catch (e) { /* bukan JSON */ }
      return v.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };
  const fromRow = r => ({
    id: String(r.id),
    name: r.name || '',
    price: Number(r.price) || 0,
    category: r.category || '',
    stock: Number(r.stock) || 0,
    sizes: parseSizes(r.sizes),
    desc: r.description || r.desc || '',
    image: r.image || '',
    sort: Number(r.sort_order) || 0
  });
  const toRow = p => {
    const row = {
      id: p.id, name: p.name,
      price: Math.max(0, Math.round(Number(p.price) || 0)),
      category: p.category || null,
      stock: Math.max(0, Math.floor(Number(p.stock) || 0)),
      sizes: parseSizes(p.sizes),
      description: p.desc || '',
      image: p.image || ''
    };
    if (p.sort != null) row.sort_order = p.sort;
    return row;
  };

  function client() {
    if (window.sb && window.sb.from) return window.sb;
    if (window.supabaseClient && window.supabaseClient.from) return window.supabaseClient;
    if (window.supabase && window.supabase.from) return window.supabase;
    const url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
    if (url && key && window.supabase && window.supabase.createClient) {
      window.supabaseClient = window.supabase.createClient(url, key);
      return window.supabaseClient;
    }
    throw new Error('Supabase is not configured. Check supabase-config.js.');
  }

  let ready = null;

  const api = {
    esc, fmt,
    products: () => read(K.p, []),
    product: id => api.products().find(p => p.id === id),
    cart: () => read(K.c, []),
    saveCart(c) { write(K.c, c); api.badge(); },
    cartLines() {
      const ps = api.products();
      const clean = api.cart().filter(i => ps.some(p => p.id === i.id));
      write(K.c, clean);
      return clean.map(i => { const p = ps.find(x => x.id === i.id); return { ...i, p, line: p.price * i.qty }; });
    },
    cartCount: () => api.cart().reduce((n, i) => n + i.qty, 0),
    cartTotal: () => api.cartLines().reduce((n, l) => n + l.line, 0),
    addToCart(id, size, qty) {
      const p = api.product(id); if (!p) return false;
      const c = api.cart(); const it = c.find(i => i.id === id && i.size === size);
      if ((it ? it.qty : 0) + qty > p.stock) return false;
      if (it) it.qty += qty; else c.push({ id, size, qty });
      api.saveCart(c); return true;
    },
    setQty(i, qty) {
      const c = api.cart(); const it = c[i]; if (!it) return;
      const p = api.product(it.id);
      if (qty <= 0) c.splice(i, 1); else it.qty = Math.min(qty, p ? p.stock : qty);
      api.saveCart(c);
    },
    clearCart() { api.saveCart([]); },

    localOrders: () => read(K.o, []),

    async orders() {
      const { data, error } = await client().from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map(o => ({
        id: o.id, date: o.created_at, total: o.total, payment: o.payment,
        status: o.status, restocked: !!o.restocked,
        customer: { name: o.customer_name, phone: o.phone, email: o.email, address: o.address, city: o.city, postal: o.postal || '', note: o.note || '' },
        items: (o.order_items || []).map(i => ({ id: i.product_id, name: i.name, size: i.size || '', qty: i.qty, price: i.price }))
      }));
    },
    async updateOrder(id, patch) {
      const { data, error } = await client().from('orders').update(patch).eq('id', id).select('id');
      if (error) throw new Error(error.message);
      if (!data || !data.length) throw new Error('Not allowed. Are you signed in as an admin?');
    },
    async deleteOrder(id) {
      const { data, error } = await client().from('orders').delete().eq('id', id).select('id');
      if (error) throw new Error(error.message);
      if (!data || !data.length) throw new Error('Not allowed. Are you signed in as an admin?');
    },

    async setProducts(list) {
      const sb = client();
      const cur = api.products();
      const byId = new Map(cur.map(p => [p.id, p]));
      const same = (a, b) => ['name', 'price', 'category', 'stock', 'desc', 'image'].every(k => a[k] === b[k]) && JSON.stringify(a.sizes || []) === JSON.stringify(b.sizes || []);
      let top = cur.reduce((m, p) => Math.max(m, p.sort || 0), 0);
      const changed = [];
      [...list].reverse().forEach(p => {
        const old = byId.get(p.id);
        if (!old) { top += 10; changed.push(toRow({ ...p, sort: top })); }
        else if (!same(old, p)) changed.push(toRow({ ...p, sort: old.sort }));
      });
      const removed = cur.filter(p => !list.some(x => x.id === p.id)).map(p => p.id);
      if (changed.length) {
        const { error } = await sb.from('products').upsert(changed);
        if (error) throw new Error(error.message);
      }
      if (removed.length) {
        const { data, error } = await sb.from('products').delete().in('id', removed).select('id');
        if (error) throw new Error(error.message);
        if (!data || data.length < removed.length) throw new Error('Not allowed. Are you signed in as an admin?');
      }
      await api.refreshProducts();
      return true;
    },

    init() {
      if (!ready) ready = api.refreshProducts().then(() => true).catch(e => { ready = null; throw e; });
      return ready;
    },

    async refreshProducts() {
      const { data, error } = await client().from('products').select('*').order('sort_order', { ascending: false });
      if (error) throw new Error(error.message);
      write(K.p, (data || []).map(fromRow));
      api.badge();
      return api.products();
    },

    async placeOrder(draft) {
      const { data, error } = await client().rpc('place_order', {
        p_customer: draft.customer,
        p_items: draft.items,
        p_payment: draft.payment
      });
      if (error) throw new Error(error.message);
      const order = { ...data, customer: draft.customer, created: Date.now() };
      write(K.o, [order, ...api.localOrders()].slice(0, 20));
      try { await api.refreshProducts(); } catch (e) { /* stok akan diperbarui di kunjungan berikutnya */ }
      return order;
    },

    badge() { document.querySelectorAll('#cartCount').forEach(el => { el.textContent = api.cartCount(); }); },
    toast(msg) {
      if (!document.getElementById('toast-style')) {
        const st = document.createElement('style');
        st.id = 'toast-style';
        st.textContent =
          '#toast{position:fixed;left:50%;bottom:28px;z-index:9999;max-width:90vw;padding:12px 22px;background:#0e2b21;color:#ece7da;' +
          'border:.5px solid #2fd36b;font-size:.9rem;letter-spacing:.02em;opacity:0;transform:translate(-50%,12px);pointer-events:none;' +
          'transition:opacity .25s,transform .25s}#toast.show{opacity:1;transform:translate(-50%,0)}';
        document.head.appendChild(st);
      }
      let t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.textContent = msg; t.classList.add('show');
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 6000);
    }
  };
  api.badge();
  return api;
})();