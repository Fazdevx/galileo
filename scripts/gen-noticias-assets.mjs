/**
 * Genera las imágenes de las tarjetas de noticias a partir de los masters que
 * ya viven en src/assets/.
 *
 * Run with: node scripts/gen-noticias-assets.mjs
 * Wired into predev/prebuild alongside gen-wa-chat.mjs and gen-brand-assets.mjs.
 *
 * Por qué hace falta: los masters son PNG de ~2,5 MB y 1672x941. Servirlos
 * tal cual en una rejilla de noticias son 7 MB de golpe. Aquí se recortan a 16:9
 * y se pasan a WebP, dejando dos tamaños por foto:
 *
 *   src/assets/noticias/<categoria>-card.webp   640x360   (~40 KB)  tarjetas
 *   src/assets/noticias/<categoria>-full.webp  1200x675  (~110 KB) detalle
 *
 * La categoría de cada foto está en IMAGENES más abajo. Si un master no
 * existe se avisa y el sitio sigue funcionando: src/data/noticias.ts cae al
 * degradado de marca cuando no encuentra ninguna foto para la categoría.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS = 'src/assets';
const OUT = path.join(ASSETS, 'noticias');

/**
 * Categoría de noticias -> master del que sale su foto.
 *
 * Los nombres se eligen pensando en qué se parece cada foto al contenido:
 * `campo-grass` es un césped al aire libre, así que va a Eventos (picnic de
 * primavera) y no a Comunicados, que se queda con la fachada del colegio.
 * `deporte-2` no se usa: queda libre por si sale una categoría nueva.
 */
const IMAGENES = {
  Aniversario: 'aniversario.jpg',
  Olimpiadas: 'copas.png',
  Desfile: 'desfile.jpg',
  Admisión: 'ingresantes.png',
  Académico: 'ganadores-desfile.png',
  Deportes: 'deporte-1.png',
  Eventos: 'campo-grass.png',
  Comunicados: 'frontis.png',
};

/**
 * Masters con nombre propio, para una noticia concreta en vez de una categoría.
 * La salida usa el nombre de la izquierda (no el de la categoría), y hay que
 * apuntarla en FOTO_POR_SLUG de src/data/noticias.ts para que se use:
 *
 *   slug de la noticia            ->  nombre de salida  ->  master
 *   primavera-picnic-galileano    ->  primavera         ->  primavera.jpg
 */
const PROPIAS = {
  primavera: 'primavera.jpg',
};

const VARIANTES = [
  { sufijo: 'card', width: 640, quality: 72 },
  { sufijo: 'full', width: 1200, quality: 78 },
];

/** 16:9, el formato de las fotos de las tarjetas y del detalle. */
const ASPECTO = 16 / 9;

/** "Admisión" -> "admision", para que el nombre de archivo sea ASCII. */
const ascii = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const generadas = [];
  const omitidas = [];

  // Categorías y fotos propias de un artículo se procesan igual: lo único que
  // cambia es el nombre con el que se guarda el resultado.
  const trabajos = [
    ...Object.entries(IMAGENES).map(([nombre, master]) => [ascii(nombre), master]),
    ...Object.entries(PROPIAS),
  ];

  for (const [nombre, master] of trabajos) {
    const src = path.join(ASSETS, master);

    if (!fs.existsSync(src)) {
      omitidas.push(`${nombre} (no existe ${master})`);
      continue;
    }

    for (const v of VARIANTES) {
      const destino = path.join(OUT, `${nombre}-${v.sufijo}.webp`);

      // position 'entropy' recorta por la zona con más detalle en vez de por el
      // centro geométrico: en los masters el sujeto no está centrado.
      await sharp(src)
        .resize({ width: v.width, height: Math.round(v.width / ASPECTO), fit: 'cover', position: 'entropy' })
        .webp({ quality: v.quality, effort: 5 })
        .toFile(destino);

      generadas.push(destino);
    }
  }

  for (const f of generadas) {
    console.log(`  ${path.relative('.', f).padEnd(40)} ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
  }
  for (const o of omitidas) console.warn(`  ⚠ omitida: ${o}`);

  console.log(`\n✅ Imágenes de noticias: ${generadas.length} archivos, ${omitidas.length} omitidas`);
}

await main();
