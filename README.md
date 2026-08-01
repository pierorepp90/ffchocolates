# F&F Chocolates — sitio web

Sitio estático (HTML/CSS/JS, sin build) + panel **Sanity** para que el dueño actualice
precios y fotos sin tocar código. Dominio previsto: **ffchocolates.com**.

## Estructura

```
index.html        Página única (nav, hero, nosotros, productos, servicios, contacto, footer)
styles.css        Estilos (paleta vino #8F444B + chocolate + crema)
script.js         Catálogo desde Sanity (con respaldo demo), WhatsApp, formulario, menú mobile
favicon.svg       Ícono
assets/           Logo + fotos de productos (demo / hero)
fyf-studio/       Panel Sanity (catálogo editable por el dueño)
```

## Probar localmente

Servir la carpeta raíz con cualquier servidor estático y abrir `http://localhost:3000`:

```bash
npx serve .
# o
python -m http.server 3000
```

Sin Sanity conectado, la web muestra productos de ejemplo (datos demo en `script.js`).

## Publicar el sitio (gratis)

1. Crear cuenta en [Netlify](https://www.netlify.com/) (gratis).
2. **Deploy manual:** arrastrar la carpeta del proyecto (sin `fyf-studio/`) a Netlify Drop.
   Queda en `https://<algo>.netlify.app`. Para el dominio propio: *Domain settings →
   Add custom domain → `ffchocolates.com`* (apuntar el DNS según indique Netlify).
3. El formulario de contacto usa [FormSubmit](https://formsubmit.co): el **primer envío**
   pide confirmar el email una sola vez (llega un correo de activación).
   El email destino está en `index.html` (`action="https://formsubmit.co/...">`).

## Panel de administración (Sanity)

Crear el proyecto una sola vez:

```bash
cd fyf-studio
npm install
npx sanity login
npx sanity init        # crea el proyecto → copiar el projectId que devuelve
npx sanity deploy      # publica el panel en https://ffchocolates.sanity.studio
```

Luego **pegar el `projectId`** en tres lugares:
- `fyf-studio/sanity.config.js` (`projectId`)
- `fyf-studio/sanity.cli.js` (`api.projectId`)
- `script.js` (constante `SANITY.projectId`) y volver a publicar el sitio.

### Cómo actualiza el dueño (precios y fotos)

1. Entrar a `https://ffchocolates.sanity.studio` e iniciar sesión.
2. **Producto → crear/editar**: nombre, categoría, fotos, presentación, precio,
   disponibilidad (Disponible / Por encargo / Sin stock), oferta opcional.
3. Guardar (*Publish*). El sitio muestra el cambio al recargar.

## Datos de la marca

- WhatsApp: **221 501 7485** → `wa.me/5492215017485`
- Instagram: **@ffchocolates**
- Color de marca: **#8F444B** (vino/rosa del logo)
