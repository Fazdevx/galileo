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

## Noticias y marcadores

- Las noticias viven en Firestore (`noticias/<slug>`) con respaldo en `src/data/noticias.ts`; el panel `/admin` las crea y edita.
- Las olimpiadas se cuentan como noticia (categoría `Olimpiadas`); ya no existe una página `/olimpiadas`.
- Los marcadores en vivo siguen alimentando el popup global (`src/components/LivePopup.astro`) y su pestaña en `/admin` desde Firestore (`olimpiadas/olimpiadas-data`).
- Todo el acceso a Firebase del cliente vive en un solo módulo: `src/lib/firebase.ts` + `src/data/api.ts` + `src/lib/olimpiadasClient.ts`.

## Configuración

- La URL pública del sitio se resuelve automáticamente desde `VERCEL_PROJECT_PRODUCTION_URL` en el build de Vercel. Para override local o en otros entornos define `PUBLIC_SITE_URL`.

> ⚠️ **Pendientes de seguridad** (no implementados): las reglas de Firestore (`firestore.rules`) están abiertas (`allow read, write: if true`) y la contraseña del admin se valida en el cliente. Antes de producción conviene restringir escrituras y mover la autenticación al servidor.
