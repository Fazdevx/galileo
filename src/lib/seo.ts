/**
 * Helpers de SEO: datos estructurados (schema.org) y migas de pan.
 *
 * Todo lo que se le pasa a Google para entender la pagina sale de aqui, para
 * que las etiquetas vivan en un solo sitio y no repetidas en cada .astro.
 */
import { SITE, SITE_URL } from '../data/site';

/* -------------------------------------------------------------------------- */
/* Migas de pan                                                               */
/* -------------------------------------------------------------------------- */

/** Un nivel de la miga: el texto que ve la persona y la ruta que sigue. */
export interface Miga {
  name: string;
  href: string;
}

/**
 * Nombre legible de cada seccion del sitio. Las claves son los slugs de
 * src/pages. Lo que no este aqui se humaniza a mayusculas ("galeria" ->
 * "Galeria"), que es mejor que mostrar el slug crudo.
 */
const SECCIONES: Record<string, string> = {
  admision: 'Admision',
  academia: 'Academia Preuniversitaria',
  galeria: 'Galeria',
  index: 'Inicio',
  noticias: 'Noticias',
  nosotros: 'Nosotros',
};

/** "campus-bienestar" -> "Campus Bienestar" */
function humanizar(segmento: string): string {
  return segmento
    .split('-')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

/**
 * Migas de una URL interna: Home > Noticias > Titulo.
 *
 * La home no lleva miga. `ultimo` sobreescribe el texto del último nivel, que
 * es lo que necesita el detalle de noticia, donde el final es un titular y no
 * un slug legible.
 */
export function breadcrumbs(pathname: string, ultimo?: string): Miga[] {
  const segmentos = pathname.split('/').filter(Boolean);
  if (segmentos.length === 0) return [];

  const migas: Miga[] = segmentos.map((segmento, i) => {
    const esUltimo = i === segmentos.length - 1;
    return {
      name: esUltimo && ultimo ? ultimo : (SECCIONES[segmento] ?? humanizar(segmento)),
      href: '/' + segmentos.slice(0, i + 1).join('/'),
    };
  });

  return migas;
}

/** JSON-LD BreadcrumbList. Google lo usa para mostrar la ruta en el resultado. */
export function breadcrumbJsonLd(migas: Miga[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
      ...migas.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: m.name,
        item: new URL(m.href, SITE_URL).toString(),
      })),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* WebPage                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * JSON-LD WebPage para las paginas interiores. El Layout ya aporta el
 * EducationalOrganization; esto le dice a Google que clase de pagina es y en
 * que idioma esta, que es lo que aparece en "esta pagina esta en espanol".
 */
export function webPageJsonLd(nombre: string, descripcion: string, tipo: string = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': tipo,
    name: nombre,
    description: descripcion,
    url: SITE_URL,
    inLanguage: 'es-PE',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  };
}

/* -------------------------------------------------------------------------- */
/* Article                                                                    */
/* -------------------------------------------------------------------------- */

interface Article {
  titulo: string;
  resumen: string;
  imagen: string;
  fecha: string;
  actualizado?: string;
  categoria?: string;
}

/**
 * JSON-LD NewsArticle para el detalle de noticias. `datePublished` es lo que
 * permite que la nota aparezca con la fecha y la foto en Google Noticias.
 */
export function articleJsonLd(noticia: Article, pathname: string) {
  const imagen = new URL(noticia.imagen || '/og-image.png', SITE_URL).toString();

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': new URL(pathname, SITE_URL).toString() },
    headline: noticia.titulo,
    description: noticia.resumen,
    image: [imagen],
    datePublished: noticia.fecha,
    dateModified: noticia.actualizado || noticia.fecha,
    inLanguage: 'es-PE',
    articleSection: noticia.categoria,
    author: { '@type': 'Organization', name: SITE.name, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/* -------------------------------------------------------------------------- */
/* FAQPage                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * JSON-LD FAQPage. Google muestra estas preguntas con su respuesta debajo del
 * resultado, asi que el texto de `a` tiene que ser el mismo que se lee en la
 * pagina, no una version resumida.
 */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Course / Service                                                           */
/* -------------------------------------------------------------------------- */

/**
 * JSON-LD Course para cada nivel del colegio. Es lo que hace que el sitio
 * pueda aparecer por "colegio inicial huacho" en lugar de solo por su nombre.
 */
export function courseJsonLd(nombre: string, descripcion: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: nombre,
    description: descripcion,
    url,
    inLanguage: 'es-PE',
    provider: { '@id': `${SITE_URL}/#organization` },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      courseWorkload: 'P4Y',
      location: {
        '@type': 'Place',
        name: SITE.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
      },
    },
  };
}

/** JSON-LD ContactPage / WebSite para la home. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: 'es-PE',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
