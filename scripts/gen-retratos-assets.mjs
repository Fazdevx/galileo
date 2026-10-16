/**
 * Genera los retratos del personal (About.astro) a partir de los masters que
 * viven en src/assets/.
 *
 * Run with: node scripts/gen-retratos-assets.mjs
 * Wired into predev/prebuild alongside gen-wa-chat.mjs, gen-brand-assets.mjs
 * y gen-noticias-assets.mjs.
 *
 * Por qué hace falta: los masters son PNG exportados de Facebook de 4000x6000
 * que pesan entre 13 y 27 MB cada uno. Servirlos tal cual hace que la página
 * /nosotros tarde una eternidad. Aquí se recortan y se pasan a WebP dejando dos
 * salidas por persona:
 *
 *   src/assets/retratos/<nombre>-card.webp     512x512   (~25 KB)  fotos
 *                                                        circulares del
 *                                                        organigrama y el
 *                                                        hero de dirección
 *   src/assets/retratos/<nombre>-retrato.webp  640x854   (~45 KB)  tarjetas
 *                                                        verticales de
 *                                                        fundadores (3:4)
 *
 * `position: 'attention'` recorta por la zona con más contraste (ahí suele
 * quedar la cara) en vez del centro geométrico.
 *
 * Para agregar a una persona nueva: copiar su master a src/assets/ y agregar
 * una linea aqui y en el frontmatter de src/components/About.astro.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS = 'src/assets';
const OUT = path.join(ASSETS, 'retratos');

/** nombre de salida (ASCII) -> master en src/assets/
 *
 * Un master puede ser `{ master, centro }` cuando el recorte automático
 * (`attention`) queda descentrado: `centro` es la posición horizontal del
 * sujeto como fracción de 0 a 1, y el recorte se calcula alrededor de ella.
 * Hilda, por ejemplo, está en el 0.46 de una foto apaisada con el monitor a
 * la derecha: sin esto, attention recorta hacia el monitor y queda chueca.
 */
const FOTOS = {
  'victor-loyola': 'promotor.png',
  'hilda-olivares': { master: 'hildaolivares.png', centro: 0.46 },
  'giovani-estupinan': 'Directorgalileo.png',
  'humberto-jara': 'humbertojara.png',
  'nicol-isidro': 'nickole.png',
  'juliana-chunga': 'juli.png',
  'rosa-lalupu': 'rosa.png',
  'gustavo-melgarejo': 'gustavo.png',
  'ray-argomedo': 'rai.png',
  'rafael-castillo': 'rai 2.png',
  'karla-vasquez': 'Karla.png',
};

const VARIANTES = [
  { sufijo: 'card', width: 512, height: 512, quality: 80 },
  { sufijo: 'retrato', width: 640, height: 854, quality: 82 },
];

/** Recorte centrado horizontalmente en `centro` (0..1), anclado arriba. */
async function recortarCentrado(src, centro, meta, ancho, alto) {
  const arObjetivo = ancho / alto;
  const arFuente = meta.width / meta.height;

  if (arFuente > arObjetivo) {
    const height = meta.height;
    const width = Math.round(height * arObjetivo);
    const left = Math.max(0, Math.min(Math.round(centro * meta.width - width / 2), meta.width - width));
    return { left, top: 0, width, height };
  }

  const width = meta.width;
  const height = Math.round(width / arObjetivo);
  return { left: 0, top: 0, width, height: Math.min(height, meta.height) };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const generadas = [];
  const omitidas = [];

  for (const [nombre, entrada] of Object.entries(FOTOS)) {
    const cfg = typeof entrada === 'string' ? { master: entrada } : entrada;
    const src = path.join(ASSETS, cfg.master);

    if (!fs.existsSync(src)) {
      omitidas.push(`${nombre} (no existe ${cfg.master})`);
      continue;
    }

    const meta = await sharp(src).metadata();

    for (const v of VARIANTES) {
      const destino = path.join(OUT, `${nombre}-${v.sufijo}.webp`);
      const pipeline = sharp(src);

      if (cfg.centro !== undefined) {
        pipeline.extract(await recortarCentrado(src, cfg.centro, meta, v.width, v.height));
      }

      await pipeline
        .resize({
          width: v.width,
          height: v.height,
          fit: 'cover',
          position: cfg.centro !== undefined ? 'top' : 'attention',
        })
        .webp({ quality: v.quality, effort: 5 })
        .toFile(destino);

      generadas.push(destino);
    }
  }

  for (const f of generadas) {
    console.log(`  ${path.relative('.', f).padEnd(50)} ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
  }
  for (const o of omitidas) console.warn(`  ⚠ omitida: ${o}`);

  console.log(`\n✅ Retratos: ${generadas.length} archivos, ${omitidas.length} omitidas`);
}

await main();
