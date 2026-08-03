/* =====================================================================
   F&F CHOCOLATES — Interacción
   Catálogo (Sanity + respaldo demo), galería, detalle, WhatsApp, formulario.
   ===================================================================== */

const WA_PHONE = '5492215017485';
const SITE_URL = 'ffchocolates.com';
const IG_USER  = 'ffchocolates';

/* Sanity: completar projectId cuando el Studio esté creado.
   Mientras esté vacío, el sitio usa los datos demo de abajo. */
const SANITY = { projectId: '6xwkvttc', dataset: 'production', apiVersion: '2024-10-01' };

/* ============== HELPERS ============== */
function waLink(message) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
function openWhatsApp(message) {
  window.open(waLink(message), '_blank', 'noopener,noreferrer');
}
function esc(s) {
  return String(s == null ? '' : s)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function formatARS(value) {
  return '$ ' + new Intl.NumberFormat('es-AR').format(value);
}

const AVAIL = {
  disponible: 'Disponible',
  encargo:    'Por encargo',
  sin_stock:  'Sin stock',
};

/* ============== DATOS DEMO (mientras no haya Sanity) ============== */
const DEMO_PRODUCTS = [
  { id: 'd1', name: 'Caja surtida grande', category: 'Cajas y estuches', price: 12000, presentation: 'Caja x 12 bombones', availability: AVAIL.disponible,
    description: 'Selección de nuestros bombones surtidos de chocolate real templado, en una caja lista para regalar. Combinación de rellenos y formas.',
    media: [{ src: 'assets/prod-1.jpeg', alt: 'Caja de bombones surtidos' }] },
  { id: 'd2', name: 'Caja surtida mediana', category: 'Cajas y estuches', price: 7000, presentation: 'Caja x 6 bombones', availability: AVAIL.disponible,
    description: 'La versión más chica de nuestra caja surtida: ideal para un detalle o regalo personal.',
    media: [{ src: 'assets/prod-1.jpeg', alt: 'Caja mediana de bombones' }] },
  { id: 'd3', name: 'Bombones surtidos', category: 'Bombones', price: 8500, presentation: 'x 250 g', availability: AVAIL.disponible,
    description: 'Variedad de bombones de chocolate con leche, blanco y semiamargo, con y sin frutos secos. Por peso, para armar tu propia selección.',
    media: [{ src: 'assets/prod-4.jpeg', alt: 'Bombones surtidos en detalle' }, { src: 'assets/prod-1.jpeg', alt: 'Caja de bombones' }] },
  { id: 'd4', name: 'Rocas de chocolate', category: 'Bombones', price: 6500, presentation: 'x 200 g', availability: AVAIL.disponible,
    description: 'Clásicas rocas de chocolate con frutos secos. Crocantes por fuera, intensas por dentro.',
    media: [{ src: 'assets/prod-2.jpeg', alt: 'Rocas de chocolate con frutos secos' }] },
  { id: 'd5', name: 'Paletas decoradas', category: 'Paletas', price: 2500, presentation: 'Unidad', availability: AVAIL.disponible,
    description: 'Paletas de chocolate con leche o blanco, decoradas con grageas de colores. Un clásico para los más chicos (¡y los grandes!).',
    media: [{ src: 'assets/prod-3.jpeg', alt: 'Paletas de chocolate decoradas' }] },
  { id: 'd6', name: 'Almendras bañadas', category: 'Bombones', price: 5500, presentation: 'x 150 g', availability: AVAIL.encargo,
    description: 'Almendras enteras bañadas en chocolate real. Se preparan por encargo.',
    media: [{ src: 'assets/prod-2.jpeg', alt: 'Almendras bañadas en chocolate' }] },
];

/* ============== FUENTE DE DATOS (Sanity o demo) ============== */
let allProducts = [];
let activeCat = 'Todos';

function sanityImg(url, w, h) {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}w=${w}&h=${h}&fit=crop&auto=format&q=78`;
}
function normalizeAvail(s) {
  if (s === AVAIL.sin_stock) return AVAIL.sin_stock;
  if (s === AVAIL.encargo) return AVAIL.encargo;
  return AVAIL.disponible;
}

async function loadProducts() {
  if (SANITY.projectId) {
    const query = `*[_type=="producto"]|order(order asc, _createdAt desc){
      _id,name,category,description,presentation,price,onSale,salePrice,availability,
      "images": images[]{ "url": asset->url, "alt": coalesce(alt, ^.name) }
    }`;
    const url = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const docs = (json && json.result) || [];
      if (docs.length) {
        return docs.map((d) => ({
          id: d._id,
          name: d.name,
          category: d.category || 'Otros',
          description: d.description || '',
          presentation: d.presentation || '',
          price: d.price || 0,
          onSale: !!d.onSale,
          salePrice: d.salePrice || 0,
          availability: normalizeAvail(d.availability),
          media: (d.images || []).map((im) => ({ src: im.url, alt: im.alt, remote: true })),
        }));
      }
    } catch (err) {
      console.warn('No se pudo leer Sanity, uso datos demo:', err);
    }
  }
  return DEMO_PRODUCTS;
}

/* ============== PRECIO & MEDIA ============== */
function effectivePrice(p) {
  return p.onSale && p.salePrice ? p.salePrice : p.price;
}
function priceHTML(p) {
  if (p.onSale && p.salePrice) {
    return `<span class="price-old">${formatARS(p.price)}</span><span class="price-now">${formatARS(p.salePrice)}</span>`;
  }
  return `<span class="card-price">${formatARS(p.price)}</span>`;
}
function imgURL(m, w, h) {
  return m.remote ? sanityImg(m.src, w, h) : m.src;
}
function slideHTML(slide, idx, big) {
  const w = big ? 1100 : 700;
  const h = big ? 1100 : 720;
  const active = idx === 0 ? ' is-active' : '';
  return `<figure class="slide${active}"><img class="piece-photo" src="${esc(imgURL(slide, w, h))}" alt="${esc(slide.alt)}" loading="lazy"></figure>`;
}
function availBadgeHTML(p) {
  if (p.availability === AVAIL.sin_stock) return `<span class="badge badge-out">Sin stock</span>`;
  if (p.availability === AVAIL.encargo) return `<span class="badge badge-last">Por encargo</span>`;
  return '';
}
function galleryNavHTML(count) {
  if (count <= 1) return '';
  return `<div class="gallery-nav">
    <button type="button" class="gnav gprev" aria-label="Foto anterior"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" class="gnav gnext" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>`;
}

/* galería cíclica dentro de un contenedor con .slide */
function bindGallery(root) {
  const slides = [...root.querySelectorAll('.slide')];
  if (slides.length <= 1) return;
  let idx = 0;
  const show = (n) => {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    root.querySelectorAll('.gdot').forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  root.querySelector('.gprev')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  root.querySelector('.gnext')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  root.querySelectorAll('.gdot').forEach((d, i) =>
    d.addEventListener('click', (e) => { e.stopPropagation(); show(i); }));
}

/* ============== PEDIDO POR WHATSAPP ============== */
function buildOrderMessage(p) {
  const price = formatARS(effectivePrice(p));
  const sale = p.onSale && p.salePrice ? ` (en oferta, antes ${formatARS(p.price)})` : '';
  const pres = p.presentation ? `\n▸ Presentación: ${p.presentation}` : '';
  return `¡Hola F&F! Te escribo desde ${SITE_URL}. Quería pedir:

▸ ${p.name} (${p.category})${pres}
▸ Precio: ${price}${sale}

¿Está disponible? ¡Gracias!`;
}
function order(p) {
  if (p.availability === AVAIL.sin_stock) return;
  openWhatsApp(buildOrderMessage(p));
  showToast(`Abriendo WhatsApp para pedir «${p.name}»…`);
}

/* ============== TARJETA ============== */
const grid = document.getElementById('productGrid');

function tplProduct(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ver detalle de ${p.name}`);

  const slides = p.media.map((m, i) => slideHTML(m, i, false)).join('');
  const dots = p.media.length > 1
    ? `<div class="gdots">${p.media.map((_, i) => `<span class="gdot${i === 0 ? ' is-active' : ''}"></span>`).join('')}</div>`
    : '';
  const out = p.availability === AVAIL.sin_stock;

  card.innerHTML = `
    <div class="card-media">
      <span class="card-tag">${esc(p.category)}</span>
      ${p.onSale ? '<span class="badge badge-sale">Oferta</span>' : ''}
      ${galleryNavHTML(p.media.length)}
      <div class="slides">${slides}</div>
      ${availBadgeHTML(p)}
      ${dots}
    </div>
    <div class="card-body">
      <h3 class="card-title">${esc(p.name)}</h3>
      ${p.presentation ? `<span class="card-mat">${esc(p.presentation)}</span>` : ''}
      <div class="card-foot">
        <div class="price-wrap">${priceHTML(p)}</div>
        <button type="button" class="card-cta${out ? ' is-disabled' : ''}" ${out ? 'disabled aria-disabled="true"' : ''}>
          ${out ? 'Sin stock' : 'Pedir'}
          ${out ? '' : `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
        </button>
      </div>
    </div>`;

  bindGallery(card.querySelector('.card-media'));

  card.querySelector('.card-cta').addEventListener('click', (e) => { e.stopPropagation(); order(p); });

  const open = (e) => {
    if (e.target.closest('.gnav') || e.target.closest('.card-cta') || e.target.closest('.gdot')) return;
    openDetail(p);
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(p); }
  });
  return card;
}

function visibleProducts() {
  return activeCat === 'Todos' ? allProducts : allProducts.filter((p) => p.category === activeCat);
}

function renderProducts() {
  grid.innerHTML = '';
  const list = visibleProducts();
  if (!list.length) {
    grid.innerHTML = `<p class="grid-empty">Pronto, nuevos productos. Mientras tanto, escribinos por <a href="${esc(waLink('¡Hola F&F! Quería consultar por productos.'))}" target="_blank" rel="noopener">WhatsApp</a>.</p>`;
    return;
  }
  list.forEach((p) => grid.appendChild(tplProduct(p)));
}

function renderSkeleton(n = 6) {
  grid.innerHTML = Array.from({ length: n }).map(() =>
    `<div class="card card-skeleton"><div class="card-media"></div><div class="card-body"><div class="sk-line"></div><div class="sk-line sk-short"></div></div></div>`
  ).join('');
}

/* ============== FILTROS DE CATEGORÍA ============== */
const catFilters = document.getElementById('catFilters');

function renderFilters() {
  if (!catFilters) return;
  const cats = ['Todos', ...new Set(allProducts.map((p) => p.category))];
  if (cats.length <= 2) { catFilters.innerHTML = ''; return; } // 'Todos' + 1 categoría: no hace falta
  catFilters.innerHTML = cats.map((c) =>
    `<button type="button" class="cat-chip${c === activeCat ? ' is-active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join('');
  catFilters.querySelectorAll('.cat-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCat = chip.dataset.cat;
      catFilters.querySelectorAll('.cat-chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      renderProducts();
    });
  });
}

/* ============== MODAL DE DETALLE ============== */
const detailDialog = document.getElementById('detailDialog');
const detailInner = document.getElementById('detailInner');

function openDetail(p) {
  const out = p.availability === AVAIL.sin_stock;
  const slides = p.media.map((m, i) => slideHTML(m, i, true)).join('');
  const thumbs = p.media.length > 1
    ? `<div class="d-thumbs">${p.media.map((m, i) =>
        `<button type="button" class="d-thumb${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(imgURL(m, 160, 160))}" alt=""></button>`
      ).join('')}</div>`
    : '';
  const meta = [p.presentation, p.availability].filter(Boolean).join(' · ');

  detailInner.innerHTML = `
    <button type="button" class="detail-close" id="detailClose" aria-label="Cerrar"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6l-12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    <div class="detail-gallery">
      <div class="card-media d-media">
        ${p.onSale ? '<span class="badge badge-sale">Oferta</span>' : ''}
        ${galleryNavHTML(p.media.length)}
        <div class="slides">${slides}</div>
        ${availBadgeHTML(p)}
      </div>
      ${thumbs}
    </div>
    <div class="detail-info">
      <span class="eyebrow">${esc(p.category)}</span>
      <h3 class="detail-name">${esc(p.name)}</h3>
      ${meta ? `<p class="detail-edition">${esc(meta)}</p>` : ''}
      ${p.description ? `<p class="detail-desc">${esc(p.description)}</p>` : ''}
      <div class="detail-price">${priceHTML(p)}</div>
      <button type="button" class="btn btn-solid btn-block detail-reserve${out ? ' is-disabled' : ''}" ${out ? 'disabled aria-disabled="true"' : ''}>
        <span>${out ? 'Sin stock' : 'Pedir por WhatsApp'}</span>
        ${out ? '' : `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
      </button>
      <p class="detail-note">Productos artesanales: pueden variar levemente en forma y color.</p>
    </div>`;

  const media = detailInner.querySelector('.d-media');
  bindGallery(media);
  const slideEls = [...media.querySelectorAll('.slide')];
  detailInner.querySelectorAll('.d-thumb').forEach((th) => {
    th.addEventListener('click', () => {
      const i = +th.dataset.i;
      slideEls.forEach((s, k) => s.classList.toggle('is-active', k === i));
      media.querySelectorAll('.gdot').forEach((d, k) => d.classList.toggle('is-active', k === i));
      detailInner.querySelectorAll('.d-thumb').forEach((t2, k) => t2.classList.toggle('is-active', k === i));
    });
  });

  detailInner.querySelector('#detailClose').addEventListener('click', closeDetail);
  detailInner.querySelector('.detail-reserve').addEventListener('click', () => order(p));

  if (typeof detailDialog.showModal === 'function') detailDialog.showModal();
  else detailDialog.setAttribute('open', '');
}

function closeDetail() {
  if (typeof detailDialog.close === 'function') detailDialog.close();
  else detailDialog.removeAttribute('open');
}

detailDialog?.addEventListener('click', (e) => {
  const r = detailInner.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDetail();
});

/* ============== TOAST ============== */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ============== FORMULARIO (email vía FormSubmit) ============== */
const citaForm = document.getElementById('citaForm');
const citaBtn = document.getElementById('citaSubmit');

if (citaForm && citaBtn) {
  citaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!citaForm.checkValidity()) { citaForm.reportValidity(); return; }

    const label = citaBtn.querySelector('span');
    const original = label.textContent;
    citaBtn.disabled = true;
    label.textContent = 'Enviando…';

    try {
      const res = await fetch(citaForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(citaForm),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || data.success === 'true')) {
        citaForm.reset();
        showToast('¡Gracias! Recibimos tu mensaje, te respondemos pronto.');
      } else {
        throw new Error('FormSubmit no confirmó el envío');
      }
    } catch (err) {
      showToast('No pudimos enviar el formulario. Escribinos por WhatsApp al 221 501 7485.');
    } finally {
      citaBtn.disabled = false;
      label.textContent = original;
    }
  });
}

/* Confirmación si se volvió de un envío sin JS (?enviado=1) */
if (new URLSearchParams(location.search).get('enviado') === '1') {
  showToast('¡Gracias! Recibimos tu mensaje, te respondemos pronto.');
}

/* ============== INIT ============== */
if (grid) {
  (async function init() {
    renderSkeleton();
    allProducts = await loadProducts();
    renderFilters();
    renderProducts();
  })();
}

/* ============== MENÚ MOBILE ============== */
const navEl = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navEl && navToggle && navLinks) {
  const closeNav = () => {
    navEl.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };
  navToggle.addEventListener('click', () => {
    const open = navEl.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', (e) => {
    if (navEl.classList.contains('is-open') && !navEl.contains(e.target)) closeNav();
  });
}
