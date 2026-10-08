(() => {
  const $ = s => document.querySelector(s);
  const form = $('#coForm'), wrap = $('#coWrap'), done = $('#done'), empty = $('#coEmpty');
  const bg = (el, src) => { if (src) el.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")'; };

  function renderSummary() {
    const lines = Store.cartLines();
    $('#sumLines').innerHTML = lines.map(l =>
      '<div class="sum-line"><div class="c-thumb" data-img="' + Store.esc(l.p.image) + '"></div><div><b>' + Store.esc(l.p.name) + '</b><span>' +
      (l.size ? 'Size ' + Store.esc(l.size) + ' · ' : '') + 'Qty ' + l.qty + '</span></div><em>' + Store.fmt(l.line) + '</em></div>').join('');
    document.querySelectorAll('#sumLines .c-thumb').forEach(el => bg(el, el.dataset.img));
    $('#sumTotal').textContent = Store.fmt(Store.cartTotal());
    return lines;
  }

  function showDone(order) {
    wrap.hidden = true; empty.hidden = true; done.hidden = false;
    $('#doneId').textContent = order.id;
    $('#doneTotal').textContent = Store.fmt(order.total);
    $('#donePay').textContent = order.payment === 'COD'
      ? 'You chose cash on delivery. The team will contact you to confirm the delivery.'
      : 'You chose bank transfer. The team will send the payment details to your phone or email shortly.';
    $('#doneItems').innerHTML = order.items.map(i => '<li>' + Store.esc(i.name) + (i.size ? ' (' + Store.esc(i.size) + ')' : '') + ' × ' + i.qty + '</li>').join('');
  }

  const err = (name, msg) => { const el = form.querySelector('[data-err="' + name + '"]'); if (el) el.textContent = msg || ''; return !msg; };

  function validate(d) {
    let ok = true;
    ok = err('name', d.name.trim().length < 2 ? 'Please enter your name.' : '') && ok;
    ok = err('phone', d.phone.replace(/\D/g, '').length < 9 ? 'Enter a valid phone number.' : '') && ok;
    ok = err('email', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) ? 'Enter a valid email.' : '') && ok;
    ok = err('address', d.address.trim().length < 8 ? 'Please enter the full address.' : '') && ok;
    ok = err('city', d.city.trim().length < 2 ? 'Please enter your city.' : '') && ok;
    return ok;
  }

  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;
    const d = Object.fromEntries(new FormData(form));
    if (!validate(d)) return;

    const btn = form.querySelector('button[type="submit"]');
    busy = true; if (btn) btn.disabled = true;
    try {
      // pastikan stok terbaru dari database sebelum kirim order
      try { await Store.init(); } catch (e) {
        console.error(e);
        Store.toast('Shop database is not connected yet.');
        return;
      }
      const lines = Store.cartLines();
      if (!lines.length) { renderSummary(); return; }
      for (const l of lines) {
        const p = Store.product(l.id);
        if (!p || p.stock < l.qty) {
          Store.toast('Sorry, ' + (p ? p.name : 'an item') + ' no longer has enough stock.');
          renderSummary();
          return;
        }
      }
      const orderDraft = {
        customer: { name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim(), address: d.address.trim(), city: d.city.trim(), postal: (d.postal || '').trim(), note: (d.note || '').trim() },
        items: lines.map(l => ({ id: l.id, size: l.size, qty: l.qty })),
        payment: d.payment || 'Bank transfer'
      };
      try {
        const order = await Store.placeOrder(orderDraft);
        Store.clearCart();
        sessionStorage.setItem('anargya_last_order', order.id);
        showDone(order);
      } catch (e) {
        console.error(e);
        Store.toast(e.message || 'Could not save the order.');
        try { await Store.refreshProducts(); } catch (_) { /* abaikan */ }
        renderSummary();
      }
    } finally {
      busy = false; if (btn) btn.disabled = false;
    }
  });

  const last = Store.localOrders().find(o => o.id === sessionStorage.getItem('anargya_last_order'));
  if (!Store.cart().length) {
    wrap.hidden = true;
    if (last) showDone(last); else empty.hidden = false;
  } else {
    renderSummary();
    Store.init().then(renderSummary).catch(e => console.error(e));
  }
})();