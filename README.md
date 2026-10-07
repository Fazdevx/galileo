# Colegio y Academia Galileo · Web

Sitio web institucional del Colegio y Academia Galileo (Huacho, Perú). Incluye la landing institucional, páginas de admisión, galería, nosotros, noticias y panel de administración.

## Stack

- [Astro](https://astro.build) 7 + Tailwind CSS 4
- Despliegue en [Vercel](https://vercel.com) (`@astrojs/vercel`)
- [Firebase / Firestore](https://firebase.google.com) (SDK de cliente) para las noticias y los marcadores en vivo
- Sitemap generado con `@astrojs/sitemap`

## Estructura

```text
/
├── public/              # Assets estáticos (logo, escudo, favicon, JS generado)
├── scripts/
│   └── gen-wa-chat.mjs  # Genera public/js/whatsapp-chat.js (prebuild)
├── src/
│   ├── assets/          # Imágenes optimizables por Astro (src/assets)
│   ├── components/      # Secciones y componentes UI
│   ├── data/            # Estado de olympiadas (marcadores) y semilla de noticias
│   ├── layouts/         # Layout base (SEO, OG, WhatsApp, modales)
│   ├── lib/             # Cliente Firebase y utilidades
│   ├── pages/           # Rutas: index, nosotros, admision, galeria, noticias, admin, 404
│   └── styles/          # global.css (tema Tailwind)
└── astro.config.mjs
```

## Comandos

| Comando           | Acción                                     |
| :---------------- | :----------------------------------------- |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Build de producción en `./dist/`           |
| `npm run preview` | Previsualizar el build                     |
| `npm run check`   | Revisión de tipos (`astro check`)          |

## Noticias

Las noticias viven **en el código**, en `NOTICIAS_SEED` de `src/data/noticias.ts`. No hay panel ni base de datos para ellas: `/noticias` y cada detalle se renderizan en el build, así que el sitio es HTML estático y no hace falta esperar a ninguna petición.

Para publicar una noticia:

1. Copiar la foto a `src/assets/` y registrarla en `scripts/gen-noticias-assets.mjs` → `PROPIAS` si es de un solo artículo, o `IMAGENES` si es la foto de una categoría.
2. Añadir el nombre de esa foto en `FOTO_POR_SLUG`, apuntando al slug de la noticia.
3. Meter el objeto de la noticia al final de `NOTICIAS_SEED`.
4. `npm run build` — los `.webp` de las tarjetas se generan solos y cada detalle se prerenderiza.

El único script del cliente es el filtrado por categoría en `/noticias`; el contenido ya viene en el HTML.

## Marcadores de olimpiadas

- Las olimpiadas se cuentan como noticia (categoría `Olimpiadas`); ya no existe una página `/olimpiadas`.
- Los marcadores en vivo siguen alimentando el popup global (`src/components/LivePopup.astro`) y su pestaña en `/admin` desde Firestore (`olimpiadas/olimpiadas-data`). Esta parte sí es dinámica y sí usa Firebase.

## Configuración

- La URL pública del sitio se resuelve automáticamente desde `VERCEL_PROJECT_PRODUCTION_URL` en el build de Vercel. Para override local o en otros entornos define `PUBLIC_SITE_URL`.

> ⚠️ **Pendiente de seguridad**: las reglas de Firestore (`firestore.rules`) están abiertas (`allow read, write: if true`) y la contraseña de `/admin` se valida en el cliente, no con autenticación real. Ahora solo quedan ahí los marcadores de olimpiadas, pero conviene cerrar las escrituras antes de producción.
