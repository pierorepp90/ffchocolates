/* =====================================================================
   Catálogo estático desde Sanity
   ---------------------------------------------------------------------
   Escribe los productos de Sanity directamente en el HTML de cada página
   pública (tarjetas + JSON-LD de Product con precio). Así los buscadores
   y los bots de IA, que no ejecutan JavaScript, ven productos y precios.
   script.js sigue reemplazando las tarjetas por las interactivas.

   Uso:   node scripts/catalogo.mjs
   Corre solo en GitHub Actions (.github/workflows/catalogo.yml).
   Sin dependencias: Node 18+.
   ===================================================================== */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://ffchocolates.com';
const WA_PHONE = '5492215017485';
const SANITY = { projectId: '6xwkvttc', dataset: 'production', apiVersion: '2024-10-01' };

/* Páginas con catálogo. La grilla de cada una declara sus categorías en
   data-categorias="A|B" (vacío = todas). */
const PAGES = [
  { file: 'index.html', path: '/' },
  { file: 'cajas-de-bombones/index.html', path: '/cajas-de-bombones/' },
  { file: 'souvenirs-de-chocolate/index.html', path: '/souvenirs-de-chocolate/' },
];

const AVAIL_SCHEMA = {
  'Disponible': 'https://schema.org/InStock',
  'Por encargo': 'https://schema.org/MadeToOrder',
  'Sin stock': 'https://schema.org/OutOfStock',
};

const esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const formatARS = (v) => '$ ' + new Intl.NumberFormat('es-AR').format(v);
const sanityImg = (url, w, h) => `${url}?w=${w}&h=${h}&fit=crop&auto=format&q=78`;
const effectivePrice = (p) => (p.onSale && p.salePrice ? p.salePrice : p.price);
const clean = (s) => String(s ?? '').trim();

async function fetchProducts() {
  const query = `*[_type=="producto"]|order(order asc, _createdAt desc){
    _id,name,category,description,presentation,price,onSale,salePrice,availability,
    "images": images[]{ "url": asset->url, "alt": coalesce(alt, ^.name) }
  }`;
  const url = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity respondió ${res.status}`);
  const { result } = await res.json();
  return (result || []).map((d) => ({
    id: d._id,
    name: clean(d.name),
    category: clean(d.category) || 'Otros',
    description: clean(d.description),
    presentation: clean(d.presentation),
    price: d.price || 0,
    onSale: !!d.onSale,
    salePrice: d.salePrice || 0,
    availability: clean(d.availability) || 'Disponible',
    images: (d.images || []).filter((im) => im && im.url),
  }));
}

function waLink(p) {
  const pres = p.presentation ? `\n▸ Presentación: ${p.presentation}` : '';
  const msg = `¡Hola F&F! Te escribo desde ffchocolates.com. Quería pedir:\n\n▸ ${p.name} (${p.category})${pres}\n▸ Precio: ${formatARS(effectivePrice(p))}\n\n¿Está disponible? ¡Gracias!`;
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
}

function priceHTML(p) {
  if (p.onSale && p.salePrice) {
    return `<span class="price-old">${formatARS(p.price)}</span><span class="price-now">${formatARS(p.salePrice)}</span>`;
  }
  return `<span class="card-price">${formatARS(p.price)}</span>`;
}

function cardHTML(p) {
  const img = p.images[0];
  const out = p.availability === 'Sin stock';
  const badge = out ? '<span class="badge badge-out">Sin stock</span>'
    : p.availability === 'Por encargo' ? '<span class="badge badge-last">Por encargo</span>' : '';
  const cta = out
    ? '<span class="card-cta is-disabled">Sin stock</span>'
    : `<a class="card-cta" href="${esc(waLink(p))}" target="_blank" rel="noopener">Pedir</a>`;
  return `
        <article class="card">
          <div class="card-media">
            <span class="card-tag">${esc(p.category)}</span>
            ${p.onSale ? '<span class="badge badge-sale">Oferta</span>' : ''}
            <div class="slides">${img ? `<figure class="slide is-active"><img class="piece-photo" src="${esc(sanityImg(img.url, 700, 720))}" alt="${esc(img.alt || p.name)}" loading="lazy" width="700" height="720"></figure>` : ''}</div>
            ${badge}
          </div>
          <div class="card-body">
            <h3 class="card-title">${esc(p.name)}</h3>
            ${p.presentation ? `<span class="card-mat">${esc(p.presentation)}</span>` : ''}
            <div class="card-foot">
              <div class="price-wrap">${priceHTML(p)}</div>
              ${cta}
            </div>
          </div>
        </article>`;
}

function productsLD(products, pageUrl) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        category: p.category,
        ...(p.description && { description: p.description }),
        ...(p.images[0] && { image: `${p.images[0].url}?w=1200&auto=format` }),
        brand: { '@type': 'Brand', name: 'F&F Chocolates' },
        offers: {
          '@type': 'Offer',
          url: `${pageUrl}#productos`,
          price: effectivePrice(p),
          priceCurrency: 'ARS',
          availability: AVAIL_SCHEMA[p.availability] || AVAIL_SCHEMA.Disponible,
          seller: { '@id': `${SITE}/#negocio` },
        },
      },
    })),
  };
  // El replace evita que un "<" del contenido cierre el <script>
  return JSON.stringify(ld, null, 2).replace(/</g, '\\u003c');
}

function replaceBetween(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:inicio -->)[\\s\\S]*?(<!-- ${name}:fin -->)`);
  if (!re.test(html)) throw new Error(`Falta el marcador «${name}»`);
  // Función de reemplazo: un "$&" o "$1" en el contenido de Sanity no se interpreta como patrón
  return html.replace(re, (_, inicio, fin) => inicio + content + fin);
}

function touchSitemap(xml, loc, date) {
  const re = new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`);
  return xml.replace(re, (_, inicio, fin) => inicio + date + fin);
}

async function main() {
  const products = await fetchProducts();
  // Si Sanity viene vacío, no se borra el catálogo publicado.
  if (!products.length) throw new Error('Sanity devolvió 0 productos; no toco nada.');

  const today = new Date().toISOString().slice(0, 10);
  const sitemapFile = join(ROOT, 'sitemap.xml');
  let sitemap = await readFile(sitemapFile, 'utf8');
  let changed = 0;

  for (const page of PAGES) {
    const file = join(ROOT, page.file);
    const html = await readFile(file, 'utf8');
    const m = html.match(/id="productGrid"[^>]*data-categorias="([^"]*)"/);
    const cats = m && m[1] ? m[1].split('|') : null;
    const list = cats ? products.filter((p) => cats.includes(p.category)) : products;
    const url = SITE + page.path;

    let next = replaceBetween(html, 'catalogo', list.map(cardHTML).join('') + '\n      ');
    next = replaceBetween(next, 'ld-productos',
      list.length ? `\n  <script type="application/ld+json">\n${productsLD(list, url)}\n  </script>\n  ` : '\n  ');

    if (next !== html) {
      await writeFile(file, next);
      sitemap = touchSitemap(sitemap, url, today);
      changed++;
      console.log(`✔ ${page.file}: ${list.length} productos`);
    } else {
      console.log(`· ${page.file}: sin cambios`);
    }
  }
  if (changed) await writeFile(sitemapFile, sitemap);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
