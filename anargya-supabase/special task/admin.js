(async () => {
  const $ = s => document.querySelector(s);
  const STATUSES = ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'];
  const loginView = $('#login'), appView = $('#app');
  let tab = 'dash', pendingImage = null, currentUser = null;

  try { await Store.init(); } catch (e) { console.error(e); }

  async function gate() {
    const { data } = await window.supabaseClient.auth.getSession();
    currentUser = data.session?.user || null;
    loginView.hidden = !!currentUser; appView.hidden = !currentUser;
    if (currentUser) show(tab);
  }

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const { error } = await window.supabaseClient.auth.signInWithPassword({ email: f.get('u'), password: f.get('p') });
    if (error) $('#loginErr').textContent = error.message;
    else { $('#loginErr').textContent = ''; gate(); }
  });
  $('#logout').addEventListener('click', async () => { await window.supabaseClient.auth.signOut(); gate(); });

  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
  async function show(t) {
    tab = t;
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    document.querySelectorAll('.tabpane').forEach(p => { p.hidden = p.id !== 'tab-' + t; });
    try {
      if (t === 'dash') await dash();
      if (t === 'products') await products();
      if (t === 'orders') await orders();
    } catch (e) { console.error(e); Store.toast(e.message || 'Could not load data.'); }
  }

  const date = iso => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const bg = (el, src) => { if (src) el.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")'; };

  async function dash() {
    const [os] = await Promise.all([Store.orders(), Store.refreshProducts()]);
    const ps = Store.products();
    const revenue = os.filter(o => o.status !== 'Cancelled').reduce((n, o) => n + o.total, 0);
    const pending = os.filter(o => o.status === 'Pending').length;
    const low = ps.filter(p => p.stock <= 5);
    $('#stats').innerHTML = [['Products', ps.length], ['Orders', os.length], ['Pending orders', pending], ['Revenue', Store.fmt(revenue)]]
      .map(([k, v]) => '<div><span>' + k + '</span><b>' + v + '</b></div>').join('');
    $('#lowStock').innerHTML = low.length ? low.map(p => '<li><span>' + Store.esc(p.name) + '</span><b>' + p.stock + ' left</b></li>').join('') : '<li class="muted">All products are well stocked.</li>';
    $('#recent').innerHTML = os.slice(0, 5).map(o => '<li><span>' + o.id + ' · ' + Store.esc(o.customer.name) + '</span><b>' + Store.fmt(o.total) + '</b></li>').join('') || '<li class="muted">No orders yet.</li>';
  }

  async function products() {
    await Store.refreshProducts();
    const ps = Store.products();
    $('#pBody').innerHTML = ps.map(p =>
      '<tr><td><div class="c-thumb" data-img="' + Store.esc(p.image) + '"></div></td><td>' + Store.esc(p.name) + '</td><td>' + Store.esc(p.category) + '</td><td>' + Store.fmt(p.price) + '</td><td>' + p.stock +
      '</td><td class="act"><button data-a="edit" data-id="' + p.id + '">Edit</button><button data-a="del" data-id="' + p.id + '">Delete</button></td></tr>').join('')
      || '<tr><td colspan="6" class="muted">No products yet.</td></tr>';
    document.querySelectorAll('#pBody .c-thumb').forEach(el => bg(el, el.dataset.img));
  }

  const pDlg = $('#pDlg'), pForm = $('#pForm');
  function openForm(p) {
    pForm.reset(); pendingImage = p ? p.image : '';
    $('#pTitle').textContent = p ? 'Edit product' : 'Add product';
    pForm.pid.value = p ? p.id : '';
    if (p) { pForm.name.value = p.name; pForm.category.value = p.category; pForm.price.value = p.price; pForm.stock.value = p.stock; pForm.sizes.value = (p.sizes || []).join(', '); pForm.desc.value = p.desc || ''; }
    const prev = $('#pPrev'); prev.style.backgroundImage = ''; bg(prev, pendingImage); pDlg.showModal();
  }
  $('#addProduct').addEventListener('click', () => openForm(null));
  $('#pCancel').addEventListener('click', () => pDlg.close());
  pForm.image.addEventListener('change', () => {
    const f = pForm.image.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => {
      const img = new Image(); img.onload = () => {
        const s = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); pendingImage = c.toDataURL('image/jpeg', 0.82); $('#pPrev').style.backgroundImage = 'url("' + pendingImage + '")';
      }; img.src = r.result;
    }; r.readAsDataURL(f);
  });

  pForm.addEventListener('submit', async e => {
    e.preventDefault();
    const ps = Store.products();
    const data = { name:pForm.name.value.trim(), category:pForm.category.value.trim() || 'Other', price:Math.max(0,+pForm.price.value||0), stock:Math.max(0,Math.floor(+pForm.stock.value||0)), sizes:pForm.sizes.value.split(',').map(s=>s.trim()).filter(Boolean), desc:pForm.desc.value.trim(), image:pendingImage||'' };
    if (!data.name) return;
    const id = pForm.pid.value;
    if (id) { const i=ps.findIndex(p=>p.id===id); ps[i]={...ps[i],...data}; }
    else ps.unshift({ id:'p'+Date.now().toString(36), ...data });
    try { await Store.setProducts(ps); pDlg.close(); await products(); Store.toast('Product saved'); }
    catch(e) { console.error(e); Store.toast(e.message || 'Could not save product.'); }
  });

  $('#pBody').addEventListener('click', async e => {
    const b=e.target.closest('button'); if(!b) return;
    const p=Store.product(b.dataset.id); if(!p) return;
    if(b.dataset.a==='edit') openForm(p);
    if(b.dataset.a==='del' && confirm('Delete "'+p.name+'"?')) { try { await Store.setProducts(Store.products().filter(x=>x.id!==p.id)); await products(); Store.toast('Product deleted'); } catch(e) { Store.toast(e.message || 'Could not delete product.'); } }
  });

  async function orders() {
    const os = await Store.orders();
    $('#oBody').innerHTML = os.map(o => '<tr><td>'+o.id+'</td><td>'+date(o.date)+'</td><td>'+Store.esc(o.customer.name)+'</td><td>'+Store.fmt(o.total)+'</td><td>'+Store.esc(o.payment)+'</td><td><select data-id="'+o.id+'">'+STATUSES.map(s=>'<option'+(s===o.status?' selected':'')+'>'+s+'</option>').join('')+'</select></td><td class="act"><button data-a="view" data-id="'+o.id+'">Details</button><button data-a="del" data-id="'+o.id+'">Delete</button></td></tr>').join('') || '<tr><td colspan="7" class="muted">No orders yet.</td></tr>';
  }

  $('#oBody').addEventListener('change', async e => {
    if(e.target.tagName!=='SELECT') return;
    const os=await Store.orders(), o=os.find(x=>x.id===e.target.dataset.id); if(!o) return;
    const next=e.target.value;
    try {
      if(next==='Cancelled' && o.status!=='Cancelled' && !o.restocked) {
        const ps=Store.products(); o.items.forEach(it=>{const p=ps.find(x=>x.id===it.id); if(p)p.stock+=it.qty;});
        await Store.setProducts(ps); await Store.updateOrder(o.id,{status:next,restocked:true});
      } else await Store.updateOrder(o.id,{status:next});
      Store.toast('Order '+o.id+' set to '+next); await orders();
    } catch(e) { console.error(e); Store.toast(e.message || 'Could not update order.'); await orders(); }
  });

  const oDlg=$('#oDlg');
  $('#oBody').addEventListener('click', async e => {
    const b=e.target.closest('button'); if(!b)return;
    const os=await Store.orders(), o=os.find(x=>x.id===b.dataset.id); if(!o)return;
    if(b.dataset.a==='del' && confirm('Delete order '+o.id+'?')) { try { await Store.deleteOrder(o.id); await orders(); } catch(e) { Store.toast(e.message || 'Could not delete order.'); } }
    if(b.dataset.a==='view') {
      const c=o.customer;
      $('#oDetail').innerHTML='<h3>'+o.id+'</h3><p class="muted">'+date(o.date)+' · '+Store.esc(o.status)+'</p><h4>Customer</h4><p>'+Store.esc(c.name)+'<br>'+Store.esc(c.phone)+' · '+Store.esc(c.email)+'<br>'+Store.esc(c.address)+', '+Store.esc(c.city)+' '+Store.esc(c.postal)+'</p>'+(c.note?'<p><i>Note: '+Store.esc(c.note)+'</i></p>':'')+'<h4>Items</h4><ul class="plain">'+o.items.map(i=>'<li><span>'+Store.esc(i.name)+(i.size?' ('+Store.esc(i.size)+')':'')+' × '+i.qty+'</span><b>'+Store.fmt(i.price*i.qty)+'</b></li>').join('')+'</ul><div class="sum-row"><span>Total · '+Store.esc(o.payment)+'</span><b>'+Store.fmt(o.total)+'</b></div>';
      oDlg.showModal();
    }
  });
  $('#oClose').addEventListener('click',()=>oDlg.close());
  gate();
})();
