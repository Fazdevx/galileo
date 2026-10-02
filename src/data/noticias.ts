/**
 * Noticias del colegio: aniversario, olimpiadas, desfile, admision, etc.
 *
 * Cada noticia es un documento dentro de la colección "noticias", con el slug
 * como ID. Se editan desde la pestaña "Noticias" del panel /admin.
 *
 * IMPORTANTE (decision conocida, pendiente de corregir):
 * firestore.rules esta en `allow read, write: if true` y el panel se protege
 * con una contrasena que viaja en el bundle de JS, no con autenticacion real.
 * Es decir, cualquiera que conozca la URL de /admin y lea el bundle puede
 * crear, editar o borrar noticias. Cuando se quiera cerrar esto hay que:
 *   1. Crear un usuario en Firebase Console > Authentication.
 *   2. Usar el getAuth() que ya esta importado en src/lib/firebase.ts.
 *   3. Cambiar las reglas a `allow read: if true; allow write: if request.auth != null;`
 */

import { initFirebase } from './api';

export const NOTICIAS_COLLECTION = 'noticias';

/** Tamaño de la foto según dónde se usa. */
export type FormatoFoto = 'card' | 'full';

export interface Noticia {
  /** ID del documento y parte de la URL. Se genera del titulo. */
  slug: string;
  titulo: string;
  /** yyyy-mm-dd */
  fecha: string;
  /** Parrafo corto: es lo que se muestra en el resumen del home. */
  resumen: string;
  /** Aparece en el bloque de noticias de la pagina principal. */
  destacado: boolean;
  /** Si es false la noticia queda oculta pero se conserva. */
  publicado: boolean;
  /** URL de la imagen que se pega desde el panel. Vacio = usar la de la categoría. */
  imagen: string;
  imagenAlt: string;
  /** Etiqueta libre: Aniversario, Olimpiadas, Desfile, Admision... */
  categoria: string;
  /** Parrafos del cuerpo, en orden. */
  cuerpo: string[];
  /* * ISO de la última edición. */
  actualizado: string;
}

/* ------------------------------------------------------------------------ */
/* Fotos                                                                     */
/* ------------------------------------------------------------------------ */

/**
 * Fotos locales, ya recortadas a 16:9 y en WebP por
 * scripts/gen-noticias-assets.mjs (dos tamaños por categoría).
 *
 * Se leen con import.meta.glob para que Vite devuelva la URL con el hash de la
 * compilación. Así la misma foto sirve en el render del servidor y en el script
 * del cliente sin copiar nada a /public ni pasar URLs a mano.
 */
const FOTOS = import.meta.glob<string>('../assets/noticias/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/**
 * Fotos que pertenecen a una noticia concreta y no a su categoría, indexadas
 * por slug. Tienen prioridad sobre la foto de la categoría: sirve para los
 * artículos con imagen propia que no encaja en ninguna etiqueta, como la
 * foto de primavera. El master se procesa en scripts/gen-noticias-assets.mjs
 * con el mismo nombre de archivo que el valor de aquí.
 */
const FOTO_POR_SLUG: Record<string, string> = {
  'primavera-picnic-galileano': 'primavera',
  'manitas-pintadas-galileo': 'manitascreativas',
  'procesion-interna-galileo': 'procesion-interna',
};

/** Categoría cuya foto se muestra cuando nada más coincide. */
const CATEGORIA_FALLBACK = 'Comunicados';

/** "Admisión" -> "admision", igual que en el nombre del archivo generado. */
const aAscii = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

/** URLs ya resueltas: se piden muchas veces al renderizar y filtrar. */
const cacheFotos = new Map<string, string>();

/**
 * Foto local de una categoría, en el tamaño pedido. Si esa categoría no tiene
 * foto generada cae en Comunicados, y si tampoco, devuelve '' (el llamador
 * pinta el degradado de marca).
 */
export function fotoCategoria(categoria: string, formato: FormatoFoto = 'card'): string {
  const clave = `${categoria}|${formato}`;
  const guardada = cacheFotos.get(clave);
  if (guardada !== undefined) return guardada;

  const buscar = (cat: string) => FOTOS[`../assets/noticias/${aAscii(cat)}-${formato}.webp`] ?? '';
  const url = buscar(categoria) || (categoria === CATEGORIA_FALLBACK ? '' : buscar(CATEGORIA_FALLBACK));

  cacheFotos.set(clave, url);
  return url;
}

/**
 * Foto de una noticia, en este orden: la que se pegó desde el panel, la que
 * tenga asignada por slug, y si no la de su categoría. Así ninguna tarjeta
 * sale sin imagen.
 */
export function imagenDe(
  noticia: Pick<Noticia, 'imagen' | 'categoria' | 'slug'>,
  formato: FormatoFoto = 'card',
): string {
  const pegada = noticia.imagen?.trim();
  if (pegada) return pegada;

  const propia = FOTO_POR_SLUG[noticia.slug];
  if (propia) {
    const url = FOTOS[`../assets/noticias/${propia}-${formato}.webp`] ?? '';
    if (url) return url;
  }

  return fotoCategoria(noticia.categoria, formato);
}

/**
 * Contenido inicial. Se usa cuando Firestore todavia no tiene noticias, para
 * que la pagina nunca salga vacia. El orden numerico no importa: se ordena por
 * fecha.
 *
 * Nota: el número de aniversario (39.º, 40.º...) NO se afirma aquí a propósito
 * porque el desfile del 39.º es un evento distinto de la UGEL, no el
 * aniversario del colegio. Se escribe solo la fecha, que si es el 1 de octubre.
 */
export const NOTICIAS_SEED: Noticia[] = [
  {
    slug: 'aniversario-institucional',
    titulo: 'Aniversario institucional del Colegio Galileo',
    fecha: '2026-10-01',
    resumen: 'El 1 de octubre celebramos nuestro aniversario institucional. Te esperamos para festejarlo juntos.',
    destacado: true,
    publicado: true,
    imagen: '',
    imagenAlt: 'Celebración del aniversario del Colegio Galileo',
    categoria: 'Aniversario',
    cuerpo: [
      'Cada 1 de octubre el Colegio Galileo detiene su rutina por un día para mirar atrás y hacia arriba. Es la fecha que elegimos para celebrar nuestro aniversario institucional: el momento en que juntamos a la comunidad entera y le decimos, en voz alta, lo que nos enorgullece. Este año vuelve a ser un encuentro de la familia Galileana.',
      'El Galileo nació hace más de veinte años en Huacho, con una idea sencilla que no ha cambiado: acompañar a cada estudiante en su tramo, desde Inicial hasta el último año de Secundaria, y abrir después las puertas de la Academia Preuniversitaria para quienes quieran seguir ese camino. Hoy somos más de mil quinientos estudiantes y seguimos creyendo que ese acompañamiento se hace persona a persona.',
      'La celebración tiene tres momentos que nos gustan especialmente. El primero es el encuentro con los egresados, muchos de ellos con hijos ya escolarizados, que vuelven al colegio no solo a saludar: vuelven a contar cómo eran y a contar cómo les fue. El segundo es el espectáculo de los más pequeños, que suben al escenario sin ninguna presión y que se llevan el aplauso de todos. El tercero es el mural de las felicitaciones, que se llena cada año de mensajes de las familias.',
      'El acto institucional es el eje de la jornada, y en él se reconoce el trabajo de quienes sostienen el colegio: docentes, personal administrativo, de limpieza, seguridad y transporte. Porque un aniversario no es solo una fecha bonita: es la suma de muchísimas personas que llegan temprano todos los días para que nada falle.',
      'Para los estudiantes preparamos actividades durante toda la jornada. Habrá competencias, juegos de integración, un espacio de recreación para los más pequeños y una zona abierta para las familias, que podrán ver el trabajo de los salones en los stands de cada sección. Ninguna de estas actividades sustituye al acto: lo acompañan.',
      'Si tu hijo estudia con nosotros y quieres estar presente, la mejor forma de confirmar es escribirnos por WhatsApp al 997 394 157. Podemos pasarte el detalle del horario y las indicaciones de acceso al colegio, que está en la Av. Túpac Amaru 123, en Huacho. Si vienes de fuera de Lima, eres igual de bienvenido: mientras nos avises con tiempo coordinamos la visita.',
      'También puedes dejarnos tu saludo por escrito. Durante todo el mes, y hasta el mismo día de la celebración, vamos a publicar en el mural de la escuela y en nuestras redes los mensajes que nos lleguen. Un mensaje de cumpleaños de un exalumno, de un abuelo o de un compañero de trabajo se lee en voz alta, y hay días que eso vale más que cualquier regalo.',
      'Gracias por ser parte de esta historia. Un colegio no se construye con sus instalaciones ni con su planilla, sino con la confianza de las familias y el esfuerzo de la comunidad educativa. Nos vemos el 1 de octubre, en casa.',
    ],
    actualizado: '2026-09-25T00:00:00.000Z',
  },
  {
    slug: 'desfile-39-aniversario-ugel-huaura',
    titulo: 'Galardete por el 2.º lugar en el desfile del 39.º aniversario de la UGEL N.º 09',
    fecha: '2025-09-01',
    resumen:
      'Nuestra delegación de docentes obtuvo el segundo lugar en el desfile conmemorativo por el 39.º aniversario de creación institucional del Programa Sectorial III de la UGEL N.º 09 Huaura.',
    destacado: false,
    publicado: true,
    imagen: '',
    imagenAlt: 'Gallardete de segundo lugar del desfile del 39.º aniversario UGEL N.º 09 Huaura',
    categoria: 'Desfile',
    cuerpo: [
      'El Colegio Galileo recibió con orgullo el gallardete que reconoce el segundo lugar obtenido por nuestra delegación de docentes en el desfile conmemorativo por el 39.º aniversario de creación institucional del Programa Sectorial III, UGEL N.º 09 Huaura.',
      'Es un reconocimiento a la participación de los docentes galileanos y a todo el trabajo que hacen detrás de cada aula.',
      'Los programas y fechas de nuevos desfiles se publican aquí y en redes sociales del colegio.',
    ],
    actualizado: '2026-09-25T00:00:00.000Z',
  },
  {
    slug: 'olimpiadas-deportivas',
    titulo: 'Olimpiadas deportivas Galileo',
    fecha: '2026-01-01',
    resumen:
      'Competencias deportivas internas por disciplines, donde los estudiantes representan al colegio y a la comunidad Galileana.',
    destacado: false,
    publicado: true,
    imagen: '',
    imagenAlt: 'Competencias de las olimpiadas deportivas del Colegio Galileo',
    categoria: 'Olimpiadas',
    cuerpo: [
      'Las olimpiadas deportivas son la principal cita deportiva del año: los estudiantes compiten por secciones y disciplinas, representando al colegio.',
      'Los resultados, las fechas de cada fase y los premios se actualizan en vivo en la página de olimpiadas.',
      'Las fotos de cada edición quedan en la galería del colegio.',
    ],
    actualizado: '2026-09-25T00:00:00.000Z',
  },
  {
    slug: 'primavera-picnic-galileano',
    titulo: 'La primavera se vivió en Inicial, Primaria y Secundaria',
    fecha: '2026-09-26',
    resumen:
      'Los estudiantes de Inicial, Primaria y Secundaria le dieron la bienvenida a la primavera con un picnic Galileano lleno de color, juegos y convivencia.',
    destacado: true,
    publicado: true,
    imagen: '',
    imagenAlt: 'Estudiantes del Colegio Galileo en el picnic de primavera.',
    categoria: 'Eventos',
    cuerpo: [
      'La primavera también se vivió con alegría en inicial, primaria y secundaria. Nuestros estudiantes de esos niveles le dieron la bienvenida a esta colorida estación con un divertido picnic Galileano.',
      'En inicial la primavera se vivió con juegos, música y colores, a su manera. Cada nivel del Galileo celebra la llegada de las estaciones como puede, y en todos los casos lo importante es lo mismo: compartir, disfrutar de la estación y aprender a convivir.',
      'Fue un espacio diferente para compartir entre compañeros, disfrutar de agradables momentos y fortalecer los lazos de amistad y convivencia que forman parte de nuestra familia Galileana.',
      'Entre sonrisas, compañerismo y mucha energía, recibimos juntos una nueva primavera. Porque en Galileo también creamos momentos que nuestros estudiantes recordarán con cariño.',
    ],
    actualizado: '2026-09-26T00:00:00.000Z',
  },
  {
    slug: 'manitas-pintadas-galileo',
    titulo: 'Galileo da inicio a su 4.º aniversario con "Manitas Pintadas"',
    fecha: '2026-10-01',
    resumen:
      'Manzana Express celebró con nosotros el 4.º aniversario del Galileo. La fecha se inició con "Manitas Pintadas", una celebración llena de color, creatividad y alegría.',
    destacado: false,
    publicado: true,
    imagen: '',
    imagenAlt: 'Estudiantes pintando sus manos durante la actividad Manitas Pintadas',
    categoria: 'Aniversario',
    cuerpo: [
      'Manzana Express celebró con nosotros la gran celebración por el 4.º aniversario del Colegio Galileo. Damos inicio a esta fecha tan especial con nuestra primera actividad: "Manitas Pintadas", una celebración llena de color, creatividad y alegría, donde nuestros estudiantes son los protagonistas.',
      'A través de esta actividad, nuestros niños y niñas pudieron expresar su imaginación y dejar su huellita en esta gran celebración, compartiendo momentos especiales junto a sus maestras y toda la comunidad educativa.',
      '¡Cuatro años creando, aprendiendo y creciendo juntos!',
      '¡Me cuida, me guía, me educa!',
    ],
    actualizado: '2026-10-01T00:00:00.000Z',
  },
  {
    slug: 'procesion-interna-galileo',
    titulo: 'Procesión interna y formación general por el Señor de los Milagros',
    fecha: '2026-10-01',
    resumen:
      'En el segundo día de celebración vivimos una jornada de fe, unión y tradición: procesión interna en honor a nuestro santo patrón y la Formación General que dio inicio al Mes de Aniversario.',
    destacado: false,
    publicado: true,
    imagen: '',
    imagenAlt: 'Comunidad educativa del Galileo durante la procesión interna',
    categoria: 'Aniversario',
    cuerpo: [
      'En este segundo día de celebración vivimos una jornada llena de fe, unión y tradición en nuestra Familia Galileana.',
      'Realizamos nuestra procesión interna en homenaje a nuestro santo patrón, el Señor de los Milagros, compartiendo un momento de reflexión y devoción junto a nuestros estudiantes, docentes y toda la comunidad educativa.',
      'Con mucha fe, encomendamos a nuestra institución y a cada integrante de la Familia Galileana, pidiendo bendiciones para continuar creciendo y avanzando juntos.',
      'Además, realizamos la Formación General, dando inicio oficialmente a las actividades programadas por nuestro Mes de Aniversario.',
      '¡Que siga la fiesta, la fe y la alegría Galileana!',
      'GALILEO: ME CUIDA, ME GUÍA, ME EDUCA.',
    ],
    actualizado: '2026-10-01T00:00:00.000Z',
  },
];

/** Convierte un titulo en un slug seguro para URL. */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Completa slugs duplicados con un sufijo numerico. */
export function uniqueSlug(titulo: string, existentes: string[]): string {
  const base = slugify(titulo) || 'noticia';
  if (!existentes.includes(base)) return base;
  let n = 2;
  while (existentes.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Etiquetas que el panel ofrece y que `normalizar` acepta sin inventar una. */
export const CATEGORIAS: readonly string[] = [
  'Aniversario',
  'Olimpiadas',
  'Desfile',
  'Admisión',
  'Académico',
  'Deportes',
  'Eventos',
  'Comunicados',
];

/** Normaliza un documento de Firestore para no romper la vista si falta un campo. */
export function normalizar(doc: Record<string, unknown>): Noticia | null {
  const titulo = typeof doc.titulo === 'string' ? doc.titulo.trim() : '';
  const slug = typeof doc.slug === 'string' && doc.slug ? doc.slug : slugify(titulo);
  if (!titulo || !slug) return null;

  return {
    slug,
    titulo,
    fecha: typeof doc.fecha === 'string' ? doc.fecha : '',
    resumen: typeof doc.resumen === 'string' ? doc.resumen : '',
    destacado: doc.destacado === true,
    publicado: doc.publicado !== false,
    imagen: typeof doc.imagen === 'string' ? doc.imagen : '',
    imagenAlt: typeof doc.imagenAlt === 'string' ? doc.imagenAlt : titulo,
    categoria: CATEGORIAS.includes(String(doc.categoria)) ? String(doc.categoria) : 'Comunicados',
    cuerpo: Array.isArray(doc.cuerpo) ? doc.cuerpo.filter((p): p is string => typeof p === 'string') : [],
    actualizado: typeof doc.actualizado === 'string' ? doc.actualizado : '',
  };
}

/**
 * Convierte la respuesta de la API REST de Firestore (un solo documento) en
 * una Noticia. Ahi los campos vienen tipados: {stringValue}, {booleanValue},
 * {arrayValue}. Se separa de normalizar() para poder probarla sin red.
 */
export function desdeDocFirestore(json: unknown, slug: string): Noticia | null {
  const fields = (json as { fields?: Record<string, unknown> })?.fields;
  if (!fields) return null;

  const txt = (k: string): string => {
    const v = fields[k] as { stringValue?: unknown } | undefined;
    return typeof v?.stringValue === 'string' ? v.stringValue : '';
  };
  const bool = (k: string, def: boolean): boolean => {
    const v = fields[k] as { booleanValue?: unknown } | undefined;
    return typeof v?.booleanValue === 'boolean' ? v.booleanValue : def;
  };
  const lista = (k: string): string[] => {
    const v = fields[k] as { arrayValue?: { values?: { stringValue?: unknown }[] } } | undefined;
    const arr = v?.arrayValue?.values;
    return Array.isArray(arr)
      ? arr.map((x) => (typeof x?.stringValue === 'string' ? x.stringValue : '')).filter(Boolean)
      : [];
  };

  const titulo = txt('titulo').trim();
  if (!titulo) return null;

  const categoria = txt('categoria');
  return {
    slug,
    titulo,
    fecha: txt('fecha'),
    resumen: txt('resumen'),
    destacado: bool('destacado', false),
    publicado: bool('publicado', true),
    imagen: txt('imagen'),
    imagenAlt: txt('imagenAlt') || titulo,
    categoria: CATEGORIAS.includes(categoria) ? categoria : 'Comunicados',
    cuerpo: lista('cuerpo'),
    actualizado: txt('actualizado'),
  };
}

export function ordenar(noticias: Noticia[]): Noticia[] {
  return [...noticias].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
}

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'setiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** yyyy-mm-dd -> "1 de octubre de 2026". Devuelve la fecha vacia si no hay dato. */
export function formatearFecha(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return '';
  const [, y, mes, d] = m;
  return `${Number(d)} de ${MESES[Number(mes) - 1]} de ${y}`;
}

/** ---------------------------------------------------------------------- */
/* Acceso a Firestore (solo en el navegador)                               */
/* ---------------------------------------------------------------------- */

/**
 * Mezcla lo guardado en Firestore con la semilla local.
 *
 * La semilla cubre los eventos permanentes (aniversario, desfile, olimpiadas)
 * para que no falten nunca, en especial mientras la colección esté vacía. Si
 * un evento de la semilla ya esta guardado en Firestore con el mismo slug,
 * manda la version de Firestore, que es la que edita el panel.
 */
export function fusionarSemilla(remotas: Noticia[]): Noticia[] {
  const porSlug = new Map<string, Noticia>();
  for (const n of NOTICIAS_SEED) porSlug.set(n.slug, n);
  for (const n of remotas) porSlug.set(n.slug, n);
  return ordenar([...porSlug.values()]);
}

/**
 * Devuelve las noticias publicadas ordenadas por fecha descendente.
 * Si Firestore falla, devuelve solo la semilla, para que la pagina nunca
 * quede en blanco.
 */
export async function fetchNoticias(): Promise<Noticia[]> {
  if (typeof window === 'undefined') return ordenar(NOTICIAS_SEED);

  try {
    const db = await initFirebase();
    if (!db) return ordenar(NOTICIAS_SEED);

    const { collection, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, NOTICIAS_COLLECTION));

    const lista = snap.docs
      .map((d) => normalizar({ ...d.data(), slug: d.id }))
      .filter((n): n is Noticia => n !== null)
      .filter((n) => n.publicado);

    return fusionarSemilla(lista);
  } catch (error) {
    console.warn('[Noticias] No se pudo leer de Firestore, se usa la semilla:', error);
    return ordenar(NOTICIAS_SEED);
  }
}

/**
 * Variante para el panel: trae TODAS las noticias, incluidas las no publicadas,
 * para que se puedan editar. Devuelve [] si no hay ninguna guardada (a diferencia
 * de fetchNoticias, que cae en la semilla).
 */
export async function fetchNoticiasAdmin(): Promise<Noticia[]> {
  if (typeof window === 'undefined') return ordenar(NOTICIAS_SEED);
  try {
    const db = await initFirebase();
    if (!db) return [];

    const { collection, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, NOTICIAS_COLLECTION));

    return ordenar(
      snap.docs.map((d) => normalizar({ ...d.data(), slug: d.id })).filter((n): n is Noticia => n !== null),
    );
  } catch (error) {
    console.error('[Noticias] Error al leer para el panel:', error);
    return [];
  }
}

/** Crea o actualiza una noticia. El slug es el ID del documento. */
export async function guardarNoticia(noticia: Noticia): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const db = await initFirebase();
    if (!db) return false;

    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(
      doc(db, NOTICIAS_COLLECTION, noticia.slug),
      { ...noticia, actualizado: new Date().toISOString() },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error('[Noticias] Error al guardar:', error);
    return false;
  }
}

export async function borrarNoticia(slug: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const db = await initFirebase();
    if (!db) return false;

    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, NOTICIAS_COLLECTION, slug));
    return true;
  } catch (error) {
    console.error('[Noticias] Error al borrar:', error);
    return false;
  }
}
