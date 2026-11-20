# Plan de tráfico orgánico local: F&F Chocolates (La Plata)

Fecha: 2026-11-20. Datos de Search Console, OpenSEO (DataForSEO) y el autocompletado de Google Argentina.

## Resumen

- **Lo que más mueve la aguja es una ficha de Google Maps (Perfil de Empresa).** En las 5 búsquedas locales que revisamos, el bloque de Maps sale arriba de todo y F&F no tiene ficha. Sin ficha, F&F no puede aparecer en ese bloque.
- **La competencia orgánica es floja.** La primera página la ocupan directorios (Guía Urbana, Páginas Amarillas, infoisinfo, argentino.com.ar, índice La Plata), posteos de Instagram y Facebook, y solo 3 o 4 sitios propios. Con páginas claras y datos estructurados se puede entrar.
- **Hay un problema de nombre.** Existe "FyF chocolates", una golosinería de Villa Urquiza (CABA) con ficha verificada y 34 reseñas. Google la muestra como panel de empresa cuando se busca "f&f chocolates". Hay que decir siempre "F&F Chocolates, chocolatería artesanal de La Plata".

## Posicionamiento (la misma frase en todos lados)

> **F&F Chocolates es una chocolatería artesanal y familiar de La Plata. Hace bombones, cajas para regalar, paletas y souvenirs de chocolate real templado, con envíos a La Plata, Gonnet, City Bell y Villa Elisa.**

Va igual en el sitio, en el JSON-LD, en la ficha de Google, en la bio de Instagram y en cada directorio.

## Diagnóstico (2026-11-20)

| Punto | Estado antes | Ahora |
|---|---|---|
| Indexación | Portada indexada, sitemap leído | Igual, más 2 páginas nuevas en el sitemap |
| Impresiones (3 meses) | ~20, 0 clics | — |
| Consultas que aparecían | "gf chocolates", "golosineria villa urquiza" (la del otro negocio) | — |
| Búsqueda de marca "f&f chocolates" | El sitio no sale en la primera página | Hace falta la ficha de Google y menciones con "La Plata" |
| Google Maps | Sin ficha | **Pendiente: crearla** |
| Datos estructurados | Error en Search Console: 4 "Product" sin `offers` | Corregido: el negocio solo lista servicios y los productos llevan precio en ARS |
| Productos y precios en el HTML | Los cargaba JavaScript: los bots de IA veían la grilla vacía | Quedan escritos en el HTML (`scripts/catalogo.mjs`) |
| H1 | "Chocolate real, hecho con amor" (no dice qué ni dónde) | "Chocolatería artesanal en La Plata", con el eslogan debajo |
| Title y description | Sin las palabras que busca la gente | Con "chocolatería", "La Plata", "bombones", "cajas", "souvenirs" |
| `lang` y Open Graph | `es`, foto de 900×685 con bordes | `es-AR`, `og:locale es_AR`, imagen de 1200×630 para WhatsApp |
| Páginas indexables | 1 | 3 |
| http→https, www→apex, robots, favicon | OK | OK |

## Qué se busca en La Plata

Volumen mensual en Argentina (DataForSEO, nov. 2026). Las búsquedas con "la plata" son locales por definición.

| Búsqueda | Volumen/mes | Página que la ataca |
|---|---|---|
| chocolateria la plata | 320 | Portada |
| chocolates la plata | 320 | Portada |
| bombones la plata | 170 | Portada y cajas |
| souvenirs la plata | 90 | Souvenirs |
| regalos la plata | 50 | Cajas |
| regalos empresariales la plata | 30 (CPC alto: intención de compra) | Cajas (futura página propia) |
| chocolates artesanales la plata | 20 | Portada |
| caja de bombones (nacional) | 4.400 | Cajas |
| caja de bombones para regalar (nacional) | 260 | Cajas |
| paletas de chocolate (nacional) | 590 | Souvenirs |
| paletas de chocolate para cumpleaños | 40 | Souvenirs |
| souvenirs de chocolate (nacional) | 70 | Souvenirs |
| chocolates personalizados (nacional) | 320 | Futura página de pedidos personalizados |

El autocompletado `gl=ar` también sugiere "caja de bombones la plata", "huevos de pascua artesanales la plata", "souvenirs personalizados la plata", "regalos empresariales la plata" y "bombones sin tacc la plata".

**Competidores que aparecen:** Chocolates del Bosque (4,7★, 224 reseñas, con web), Todo Chocolate / Del Corro (4,6★, 309 reseñas, ficha sin reclamar), La Pinocha, Desayunos y Chocolates La Plata.com, Bombonería San Francisco, Dulcinée, Silvia Díaz Chocolatier. Casi todos tienen local a la calle; F&F compite como negocio con envío a domicilio.

## Fases

### Base técnica y contenido inicial (hecho el 2026-11-20)

- Portada: title, description, H1, `lang="es-AR"`, Open Graph con imagen de 1200×630 y zona de envío explícita.
- JSON-LD del negocio corregido (`ConfectioneryStore`, `alternateName`, servicios con URL).
- **Catálogo estático:** `scripts/catalogo.mjs` copia los productos de Sanity al HTML, con tarjetas y JSON-LD `Product` + `Offer` en ARS. Lo corre `.github/workflows/catalogo.yml` a las 8 y a las 20 (hora argentina), en cada push que toque las páginas y a mano desde GitHub → Actions → "Catálogo estático" → Run workflow. Si algo cambió, hace commit y pide el build de Pages.
- Páginas nuevas:
  - `/cajas-de-bombones/`: "cajas de bombones La Plata", "caja de bombones para regalar".
  - `/souvenirs-de-chocolate/`: "souvenirs La Plata", "souvenirs de chocolate", "paletas de chocolate para cumpleaños".
- Enlaces internos entre las tres páginas.

### Ficha de Google y presencia local (sin código, esta semana)

Es lo más importante del plan. Lo tiene que hacer la dueña, con su cuenta de Google.

1. **Crear el Perfil de Empresa en Google** (business.google.com):
   - Nombre: **F&F Chocolates**, exacto, sin agregar palabras clave (Google suspende fichas por eso).
   - Categoría principal: **Chocolatería**. Secundarias: **Artesano de chocolate** y **Tienda de regalos**.
   - Sin local a la calle: elegir "Entrego productos a domicilio", **ocultar la dirección** y cargar como zona de servicio La Plata, Gonnet, City Bell y Villa Elisa.
   - Web: `https://ffchocolates.com`. Teléfono: el WhatsApp. Horario de atención por WhatsApp.
   - Descripción: la frase de posicionamiento.
   - 10 o más fotos reales (productos, cajas armadas, el proceso) y una por semana después.
   - Productos: cargar las cajas y las paletas con precio.
2. **Reseñas:** pedírselas a cada cliente después de la entrega, con el link corto de la ficha por WhatsApp. Objetivo: 20 en 3 meses. Responder todas.
3. **Bing Places** (bingplaces.com): se importa desde Google en un clic. Alimenta a Copilot y a ChatGPT.
4. **Directorios que hoy salen en la primera página** (gratis):
   - Guía Urbana (guiaurbana.com.ar)
   - Páginas Amarillas (paginasamarillas.com.ar)
   - Índice La Plata (comercios.indicelaplata.com.ar)
   - argentino.com.ar
   - infoisinfo (la-plata.infoisinfo-ar.com)

   En todos: mismo nombre, mismo teléfono, misma web y la frase de posicionamiento.
5. **Instagram @ffchocolates:**
   - Nombre visible: "F&F Chocolates | La Plata". El campo nombre es buscable dentro de Instagram.
   - En la bio: "Chocolatería artesanal en La Plata 🍫 Envíos a La Plata, Gonnet, City Bell y Villa Elisa", más el link a ffchocolates.com.
   - Activar la ubicación La Plata en los posteos.

### Contenido por temporada (una página por fecha, publicada 4 a 6 semanas antes)

Solo si F&F efectivamente vende esos productos:

- **Huevos de Pascua artesanales La Plata** (Pascua 2027: 28 de marzo; publicar a mediados de febrero). "huevos de pascua la plata" aparece en el autocompletado.
- **Regalos empresariales con chocolate** (publicar en octubre, para fin de año). Volumen chico pero de alto valor.
- **Día de la Madre** (octubre) y **San Valentín** (febrero): pueden ser una sección en la página de cajas.
- **Chocolates personalizados** (320/mes nacional): si hacen logo, nombre o colores a pedido.

Cada página necesita fotos reales del producto, precio y anticipación de pedido. Sin eso queda una página flaca y no conviene publicarla.

### Distribución de costo cero (en paralelo)

- **Prensa local:** 0221.com.ar y El Día cubrieron aperturas de chocolaterías (La Pinocha, Silvia Díaz). Una historia con un ángulo propio (la familia, el templado, la temporada de Pascua) tiene chances, y esos enlaces pesan para Google y para las IA.
- **Instagram con ubicación y reels cortos** del templado y del armado de cajas.
- **Organizadoras de eventos y salones de La Plata:** ofrecer muestras para que recomienden los souvenirs.

## Medición

- **Search Console** (conectado a OpenSEO, proyecto "F&F Chocolates"): impresiones de "chocolateria la plata", "bombones la plata" y "caja de bombones la plata", y las páginas nuevas indexadas.
- **Ficha de Google:** llamadas, clics a la web y pedidos de cómo llegar (el panel de la ficha los muestra).
- **Panel mensual de IA:** en ChatGPT, Gemini y Google AI Mode, en chat nuevo y temporal cada vez:
  - "¿Dónde compro bombones artesanales en La Plata?"
  - "Souvenirs de chocolate para un cumpleaños en La Plata"
  - "Cajas de bombones para regalar con envío en La Plata"

  Anotá si aparece F&F y quién aparece en su lugar.
- **Horizonte:** 90 días antes de juzgar. La ficha de Maps suele mostrar resultados antes que el orgánico.

## Decisiones que le tocan a la dueña

- **Confirmado el 2026-11-20:** hacen souvenirs para comuniones y fiestas de 15, y envían a City Bell. City Bell se sumó a la zona de envío en todo el sitio.
- **Datos que faltan para mejorar las páginas:** anticipación mínima para souvenirs, cantidad mínima, si personalizan con nombre o logo, formas de pago, costo de envío y si hay opción sin TACC (aparece en el autocompletado).
- **Crear la ficha de Google** (solo ella puede verificarla).
- **Webhook de Sanity (opcional):** para que el catálogo estático se actualice apenas publica, sin esperar a las 8 o a las 20. Requiere un token de GitHub cargado en Sanity → API → Webhooks, que llame a `repository_dispatch` con `event_type: sanity-publish`.
