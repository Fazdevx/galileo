# Colegio y Academia Galileo · Web

Sitio web institucional del Colegio y Academia Galileo (Huacho, Perú). Incluye la landing institucional, páginas de admisión, galería, nosotros y la sección de **Olimpiadas Internas 2026** con marcadores en vivo y panel de administración.

## Stack

- [Astro](https://astro.build) 7 + Tailwind CSS 4
- Despliegue en [Vercel](https://vercel.com) (`@astrojs/vercel`)
- [Firebase / Firestore](https://firebase.google.com) (SDK de cliente) para los datos de las olimpiadas
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
│   ├── data/            # Estado y acceso a datos de olimpiadas
│   ├── layouts/         # Layout base (SEO, OG, WhatsApp, modales)
│   ├── lib/             # Cliente Firebase y utilidades
│   ├── pages/           # Rutas: index, nosotros, admision, galeria, olimpiadas, admin, 404
│   └── styles/          # global.css (tema Tailwind)
└── astro.config.mjs
```

## Comandos

| Comando            | Acción                                   |
| :----------------- | :--------------------------------------- |
| `npm run dev`      | Servidor de desarrollo en `localhost:4321` |
| `npm run build`    | Build de producción en `./dist/`          |
| `npm run preview`  | Previsualizar el build                    |
| `npm run check`    | Revisión de tipos (`astro check`)        |

## Olimpiadas

- La página `/olimpiadas` muestra calendario, marcadores y tabla de posiciones en vivo.
- Los datos se leen de Firestore (`olimpiadas/olimpiadas-data`) y se sincronizan con `onSnapshot`; además hay respaldo en `localStorage` y data por defecto.
- El panel `/admin` permite gestionar secciones, disciplinas, partidos y premios. El acceso usa una contraseña definida en `src/data/olimpiadasStore.ts`.
- Todo el acceso a Firebase del cliente vive en un solo módulo: `src/lib/firebase.ts` + `src/data/api.ts` + `src/lib/olimpiadasClient.ts`.

## Configuración

- La URL pública del sitio se resuelve automáticamente desde `VERCEL_PROJECT_PRODUCTION_URL` en el build de Vercel. Para override local o en otros entornos define `PUBLIC_SITE_URL`.

> ⚠️ **Pendientes de seguridad** (no implementados): las reglas de Firestore (`firestore.rules`) están abiertas (`allow read, write: if true`) y la contraseña del admin se valida en el cliente. Antes de producción conviene restringir escrituras y mover la autenticación al servidor.