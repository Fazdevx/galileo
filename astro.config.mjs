// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// URL pública del sitio. Se resuelve automáticamente en el build de Vercel.
const site =
  process.env.PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,
  adapter: vercel({
    imageService: true,
  }),
  integrations: [
    sitemap({
      // The admin panel must never be advertised to crawlers.
      filter: (page) => !page.includes('/admin'),
      // Pages that change often vs. pages that are essentially static. Google
      // uses these as a hint, never as a ranking factor.
      serialize(item) {
        const path = new URL(item.url).pathname;
        // Astro genera las paginas con barra final: '/admision/', no '/admision'.
        const section = path.replace(/\/$/, '') || '/';
        const cambiosFrecuentes = ['/noticias', '/admision'];

        if (cambiosFrecuentes.includes(section)) {
          return { ...item, changefreq: ChangeFreqEnum.WEEKLY, priority: 0.8 };
        }
        if (path === '/') {
          return { ...item, changefreq: ChangeFreqEnum.WEEKLY, priority: 1.0 };
        }
        return { ...item, changefreq: ChangeFreqEnum.MONTHLY, priority: 0.7 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
