/**
 * Markup de las tarjetas de noticia.
 *
 * Vive en un .ts y no en un .astro a propósito: la misma tarjeta se pinta en
 * tres sitios y por dos caminos distintos.
 *
 *   - El servidor la renderiza en NoticiaCard.astro (con set:html).
 *   - El cliente la vuelve a pintar con innerHTML cuando llegan datos de
 *     Firestore, tanto en /noticias como en el resumen del home.
 *
 * Si el markup viviera duplicado, un retoque de estilo dejaría medio sitio con
 * la tarjeta vieja. Aquí solo hay una versión que mantener.
 *
 * Todo lo que sale de la base de datos pasa por esc() de src/lib/text.ts,
 * porque lo escribe una persona desde el panel /admin.
 */
import { esc } from './text';
import { formatearFecha, imagenDe, type FormatoFoto, type Noticia } from '../data/noticias';

export type VarianteTarjeta = 'grid' | 'hero';

/**
 * Un color por categoría, para que el índice no sea un muro de naranjas.
 * Se usa en el icono de la etiqueta, la flecha "Ver detalle" y el degradado
 * de la tarjeta destacada.
 */
const ACENTOS: Record<string, { icono: string; texto: string; degradado: string }> = {
  Aniversario: {
    icono: 'text-brand-500',
    texto: 'text-brand-600',
    degradado: 'from-brand-600 to-navy-700',
  },
  Olimpiadas: {
    icono: 'text-amber-500',
    texto: 'text-amber-600',
    degradado: 'from-amber-500 to-brand-600',
  },
  Desfile: {
    icono: 'text-navy-500',
    texto: 'text-navy-700',
    degradado: 'from-navy-700 to-navy-900',
  },
  Admisión: {
    icono: 'text-emerald-500',
    texto: 'text-emerald-600',
    degradado: 'from-emerald-600 to-navy-700',
  },
  Académico: {
    icono: 'text-sky-500',
    texto: 'text-sky-700',
    degradado: 'from-sky-600 to-navy-700',
  },
  Deportes: {
    icono: 'text-lime-500',
    texto: 'text-lime-700',
    degradado: 'from-lime-600 to-emerald-700',
  },
  Comunicados: {
    icono: 'text-slate-400',
    texto: 'text-slate-600',
    degradado: 'from-navy-600 to-navy-800',
  },
};

const acento = (categoria: string) => ACENTOS[categoria] ?? ACENTOS.Comunicados;

/** Icono de 16px por categoría, para la etiqueta sobre la foto. */
const ICONOS: Record<string, string> = {
  Aniversario:
    'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
  Olimpiadas: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 01-10 0V4z M17 5h3v2a3 3 0 01-3 3 M7 5H4v2a3 3 0 003 3',
  Desfile: 'M5 21V4 M5 5h11l-2 4 2 4H5',
  Admisión: 'M9 12l2 2 4-4 M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z',
  Académico: 'M12 6.5C10 4.8 7 4.5 4 5v12c3-.5 6-.2 8 1.5 2-1.7 5-2 8-1.5V5c-3-.5-6-.2-8 1.5z M12 6.5V19',
  Deportes:
    'M12 12a5 5 0 100-10 5 5 0 000 10z M2 12h4 M18 12h4 M12 18v4 M7.5 7.5l-3-3 M16.5 7.5l3-3 M7.5 16.5l-3 3 M16.5 16.5l3 3',
  Comunicados: 'M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z M16 9a4 4 0 010 6 M19 6.5a8 8 0 010 11',
};

const icono = (categoria: string) => ICONOS[categoria] ?? ICONOS.Comunicados;

const FLECHA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
  <path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

const CALENDARIO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true">
  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

/**
 * La foto. Si no hay ninguna (ni panel ni categoría) cae en un degradado de
 * marca, para que la rejilla nunca quede con huecos raro.
 */
function fotoHTML(noticia: Noticia, formato: FormatoFoto, clases: string): string {
  const alt = esc(noticia.imagenAlt || noticia.titulo);
  const src = imagenDe(noticia, formato);

  if (!src) {
    const { degradado } = acento(noticia.categoria);
    return `<div class="${clases} flex items-center justify-center bg-gradient-to-br ${degradado}" aria-hidden="true">
      <span class="text-4xl font-black text-white/25">${esc(noticia.categoria.slice(0, 2).toUpperCase())}</span>
    </div>`;
  }

  return `<img src="${esc(src)}" alt="${alt}" width="640" height="360" loading="lazy" decoding="async"
    class="${clases}">`;
}

/** Etiqueta de categoría: vidrio claro sobre la foto, con su icono de color. */
function etiquetaHTML(categoria: string): string {
  const { icono: colorIcono } = acento(categoria);
  return `<span class="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold
    uppercase tracking-wider text-navy-800 shadow-sm backdrop-blur">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 ${colorIcono}" aria-hidden="true">
      <path d="${icono(categoria)}"/></svg>
    ${esc(categoria)}</span>`;
}

/** Fecha en vidrio sobre la foto, o solo el texto si no hay fecha. */
function fechaHTML(fechaISO: string, sobreFoto: boolean): string {
  const fecha = formatearFecha(fechaISO);
  if (!fecha) return '';
  const clases = sobreFoto
    ? 'inline-flex items-center gap-1.5 rounded-full bg-navy-900/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur'
    : 'inline-flex items-center gap-1.5 text-xs font-medium text-slate-500';
  return `<time datetime="${esc(fechaISO)}" class="${clases}">${CALENDARIO}${esc(fecha)}</time>`;
}

/** Tarjeta de la rejilla: foto arriba, texto abajo. */
function gridHTML(noticia: Noticia): string {
  const { texto } = acento(noticia.categoria);
  const fecha = fechaHTML(noticia.fecha, true);

  return `<article class="noticia-lazy group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1
    ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-brand-300">
    <div class="relative aspect-[16/9] overflow-hidden bg-navy-800">
      ${fotoHTML(noticia, 'card', 'h-full w-full object-cover transition duration-500 group-hover:scale-105')}
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent"></div>
      <div class="absolute left-3 top-3">${etiquetaHTML(noticia.categoria)}</div>
      ${fecha ? `<div class="absolute bottom-3 left-3">${fecha}</div>` : ''}
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-lg font-extrabold leading-snug text-navy-800">
        <a href="/noticias/${esc(noticia.slug)}" class="after:absolute after:inset-0 after:content-['']">${esc(noticia.titulo)}</a>
      </h3>
      ${noticia.resumen ? `<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">${esc(noticia.resumen)}</p>` : ''}
      <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${texto} transition group-hover:gap-2.5" aria-hidden="true">
        Ver detalle ${FLECHA}</span>
    </div>
  </article>`;
}

/**
 * Tarjeta destacada: panel de texto en degradado de marca con la foto al lado.
 * Se usa una sola vez por página, para abrir la sección.
 */
function heroHTML(noticia: Noticia): string {
  const { degradado } = acento(noticia.categoria);
  const fecha = fechaHTML(noticia.fecha, false);

  return `<article class="group relative grid overflow-hidden rounded-3xl bg-gradient-to-br ${degradado} shadow-xl ring-1 ring-white/10 lg:grid-cols-2">
    <div class="flex flex-col justify-center p-6 text-white sm:p-8 lg:p-10">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold
          uppercase tracking-widest text-white backdrop-blur">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-400"></span>Destacada</span>
        ${fecha}
      </div>
      <h3 class="mt-4 text-2xl font-black leading-tight sm:text-3xl">
        <a href="/noticias/${esc(noticia.slug)}" class="after:absolute after:inset-0 after:content-['']">${esc(noticia.titulo)}</a>
      </h3>
      ${noticia.resumen ? `<p class="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">${esc(noticia.resumen)}</p>` : ''}
      <span class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white" aria-hidden="true">
        Leer la noticia completa ${FLECHA}</span>
    </div>
    <div class="relative min-h-56 overflow-hidden lg:min-h-full">
      ${fotoHTML(noticia, 'card', 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105')}
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900/25 to-transparent lg:from-navy-900/45"></div>
      <div class="absolute right-3 top-3">${etiquetaHTML(noticia.categoria)}</div>
    </div>
  </article>`;
}

/** HTML de una tarjeta de noticia, en la variante pedida. */
export function tarjetaHTML(noticia: Noticia, variante: VarianteTarjeta = 'grid'): string {
  return variante === 'hero' ? heroHTML(noticia) : gridHTML(noticia);
}

/** Varias tarjetas seguidas. */
export function tarjetasHTML(noticias: Noticia[], variante: VarianteTarjeta = 'grid'): string {
  return noticias.map((n) => tarjetaHTML(n, variante)).join('');
}

/**
 * Bloque de la página principal: la más reciente o destacada abre la sección
 * a todo el ancho y el resto va en una rejilla de tres columnas debajo.
 *
 * Antes el resto se apilaba en una columna estrecha al lado de la grande. Eso
 * se veía bien con tres noticias, pero en cuanto hay más la columna alta
 * queda descompensada al lado de una sola tarjeta, así que las que sobran
 * bajan a su propia rejilla y el bloque crece sin romperse.
 *
 * Se exporta entero (envoltorios incluidos) porque el cliente lo sustituye por
 * innerHTML completo al leer de Firestore.
 */
export function resumenHTML(noticias: Noticia[]): string {
  if (!noticias.length) return vacioHTML('No hay noticias publicadas por ahora.');

  const [destacada, ...resto] = noticias;

  const principal = `<div class="grid gap-6">
    <div>${heroHTML(destacada)}</div>
    ${
      resto.length
        ? `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${resto.map((n) => gridHTML(n)).join('')}</div>`
        : ''
    }
  </div>`;

  return principal;
}

/** Aviso para cuando un filtro no deja nada que mostrar. */
export function vacioHTML(mensaje: string): string {
  return `<p class="col-span-full rounded-2xl bg-slate-50 p-10 text-center text-slate-500 ring-1 ring-slate-200">${esc(mensaje)}</p>`;
}
