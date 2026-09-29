#!/usr/bin/env node
/**
 * Descarga las imágenes del sitio a partir de las URLs de origen y las deja
 * optimizadas en src/assets.
 *
 * Por qué existe esto, y por qué no se enlazan en caliente:
 *
 * Las fotos salieron de la página de Facebook del colegio. Lo natural sería
 * ponerles la URL de Facebook en el HTML y no guardarlas. No se hace, y el
 * motivo es concreto: las URLs de su CDN (scontent.xx.fbcdn.net) van firmadas
 * con un token de caducidad. Cargan hoy, y en unas semanas devuelven 403. Como
 * son justamente las fotos de portada, la web se quedaría con imágenes rotas
 * sin que nadie haya tocado nada. Facebook además bloquea el enlazado desde
 * otros dominios de forma intermitente.
 *
 * Así que la URL se guarda en un archivo de texto (scripts/fuentes-imagenes.json)
 * y la imagen se descarga una sola vez, se convierte a WebP y se queda en el
 * repo. Si la URL caduca, el aviso sale aquí al ejecutar el script, no en la web.
 *
 * Uso:
 *   npm run imagenes                     solo descarga lo que falte
 *   npm run imagenes -- --force          vuelve a bajarlo todo
 *   npm run imagenes -- --force frontis  vuelve a bajar solo esa
 *
 * Opciones:
 *   --force        re-descarga aunque el archivo ya exista
 *   --dry-run      solo dice qué haría, no descarga nada
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const MANIFIESTO = 'scripts/fuentes-imagenes.json';
const ASSETS = 'src/assets';

/** Calidad del WebP que se guarda. 88 va sobrada: Astro vuelve a codificar al servir. */
const CALIDAD = 88;

/** Si un masters pasa de esto, es que la URL no es una imagen. */
const MAX_BYTES = 40 * 1024 * 1024;

const argumentos = process.argv.slice(2);
const force = argumentos.includes('--force');
const dryRun = argumentos.includes('--dry-run');
const solo = argumentos.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase());

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** Una entrada es válida si tiene una URL http/https de verdad. */
function urlUtil(url) {
  if (typeof url !== 'string' || url.trim() === '') return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Baja la imagen y la devuelve como WebP.
 *
 * Se conserva el canal alfa: la foto de ingresantes lo tiene y si se aplanara
 * sobre blanco, aparecería un rectángulo blanco donde debería verse el fondo.
 * No se redimensiona nada; de eso se encarga Astro al servir.
 */
async function descargarYConvertir(url, destino) {
  const respuesta = await fetch(url, {
    redirect: 'follow',
    headers: {
      // Facebook devuelve 403 si no parece una petición de su propia web.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(45_000),
  });

  if (!respuesta.ok) {
    throw new Error(`el servidor respondió ${respuesta.status} ${respuesta.statusText}`);
  }

  const tipo = respuesta.headers.get('content-type') ?? '';
  if (!tipo.startsWith('image/')) {
    throw new Error(
      `no es una imagen, devolvió "${tipo || 'sin tipo'}". Suele pasar cuando la URL caducó y Facebook devuelve su página de login.`,
    );
  }

  const bruto = Buffer.from(await respuesta.arrayBuffer());
  if (bruto.length === 0) throw new Error('la respuesta vino vacía');
  if (bruto.length > MAX_BYTES) {
    throw new Error(`son ${kb(bruto.length)}, más del límite de ${kb(MAX_BYTES)}`);
  }

  // Si sharp no puede leerla, no es una imagen válida aunque diga content-type.
  const metadata = await sharp(bruto)
    .metadata()
    .catch(() => {
      throw new Error('el archivo no se pudo leer como imagen (puede estar corrupto)');
    });

  // El formato de salida lo manda la extensión que declara el manifiesto, no
  // este script. Se hizo siempre en WebP y el manifiesto tiene entradas .jpg:
  // eso escribía bytes de WebP dentro de un archivo .jpg, que el servidor
  // entrega como image/jpeg y que no todos los navegadores pintan.
  const formato = path.extname(destino).toLowerCase();
  const pipeline = sharp(bruto);

  if (formato === '.jpg' || formato === '.jpeg') {
    if (metadata.hasAlpha) {
      // JPEG no tiene canal alfa. Aplanar sobre blanco es lo unico que se
      // puede hacer, pero tapa lo que fuera transparente.
      throw new Error(
        'la imagen tiene transparencia y el manifiesto la declara .jpg, que no la admite. Ponle .webp en "archivo".',
      );
    }
    return {
      salida: await pipeline.jpeg({ quality: CALIDAD, mozjpeg: true }).toBuffer(),
      original: metadata,
      origenBytes: bruto.length,
      formato: 'jpeg',
    };
  }

  if (formato === '.png') {
    return {
      salida: await pipeline.png({ compressionLevel: 9 }).toBuffer(),
      original: metadata,
      origenBytes: bruto.length,
      formato: 'png',
    };
  }

  if (formato === '.avif') {
    return {
      salida: await pipeline.avif({ quality: CALIDAD, effort: 4 }).toBuffer(),
      original: metadata,
      origenBytes: bruto.length,
      formato: 'avif',
    };
  }

  if (formato !== '.webp') {
    throw new Error(`"${formato}" no es una extensión que sepa convertir. Usa .webp, .jpg, .png o .avif.`);
  }

  return {
    salida: await pipeline.webp({ quality: CALIDAD, alphaQuality: 100, effort: 6 }).toBuffer(),
    original: metadata,
    origenBytes: bruto.length,
    formato: 'webp',
  };
}

async function main() {
  let manifiesto;
  try {
    // Sin el replace, editar el manifiesto en el Bloc de notas de Windows lo
    // guarda con BOM y JSON.parse revienta con un error que no dice nada de
    // BOM. Es justo el editor que se usa en este proyecto.
    const crudo = await fs.readFile(MANIFIESTO, 'utf8');
    manifiesto = JSON.parse(crudo.replace(/^\uFEFF/, ''));
  } catch (error) {
    console.error(`❌ No se pudo leer ${MANIFIESTO}: ${error.message}`);
    console.error('   Revisa que el JSON tenga las comas y las llaves bien.');
    process.exit(1);
  }

  const entradas = Object.entries(manifiesto.imagenes ?? {}).filter(
    ([clave]) => solo.length === 0 || solo.includes(clave),
  );

  if (entradas.length === 0) {
    console.error(`❌ Ninguna entrada coincide con: ${solo.join(', ')}`);
    console.error(`   Las claves existentes son: ${Object.keys(manifiesto.imagenes ?? {}).join(', ')}`);
    process.exit(1);
  }

  console.log(`\nSincronizando ${entradas.length} imagen(es) desde ${MANIFIESTO}`);
  if (force) console.log('  Modo --force: se re-descarga todo lo indicado.');
  if (dryRun) console.log('  Modo --dry-run: no se descarga nada.\n');

  const descargadas = [];
  const saltadas = [];
  const pendientes = [];
  const fallos = [];
  const avisos = [];

  for (const [clave, datos] of entradas) {
    const destino = path.join(ASSETS, datos.carpeta ?? '', datos.archivo);

    if (!urlUtil(datos.url)) {
      const existe = await fs
        .access(destino)
        .then(() => true)
        .catch(() => false);
      if (existe) {
        saltadas.push([clave, 'sin URL, ya está el archivo']);
      } else {
        pendientes.push([clave, 'sin URL y además falta el archivo']);
      }
      continue;
    }

    const yaEsta = await fs
      .access(destino)
      .then(() => true)
      .catch(() => false);

    if (yaEsta && !force) {
      const { size } = await fs.stat(destino);
      saltadas.push([clave, `ya existe (${kb(size)})`]);
      continue;
    }

    if (dryRun) {
      descargadas.push([clave, `se descargaría -> ${destino}`]);
      continue;
    }

    try {
      const { salida, original, origenBytes, formato } = await descargarYConvertir(datos.url, destino);
      await fs.mkdir(path.dirname(destino), { recursive: true });
      await fs.writeFile(destino, salida);

      const dims = original.width ? `${original.width}x${original.height}` : 'dims desconocidas';
      const alfa = original.hasAlpha ? ', con alfa' : '';
      const linea = `${destino}  ${dims}${alfa}  ${formato}  ${kb(origenBytes)} -> ${kb(salida.length)}`;
      descargadas.push([clave, linea]);

      // Si el original ya venía muy comprimido, convertirlo puede pesar más que
      // el original. No es un error, pero conviene verlo: si es una de estas,
      // mejor bajar la calidad de la foto en el origen que subirla aquí.
      if (salida.length >= origenBytes * 0.95) {
        avisos.push([
          clave,
          `el ${formato} pesa ${kb(salida.length)} y el original ${kb(origenBytes)}: convertir no ahorra nada aquí. La foto de origen ya venía muy comprimida.`,
        ]);
      }
    } catch (error) {
      fallos.push([clave, error.message]);
    }
  }

  for (const [clave, info] of descargadas) console.log(`  ✅ ${clave}: ${info}`);
  for (const [clave, info] of saltadas) console.log(`  ⏭️  ${clave}: ${info}`);
  for (const [clave, info] of avisos) console.warn(`  ⚠️  ${clave}: ${info}`);
  for (const [clave, info] of fallos) console.error(`  ❌ ${clave}: ${info}`);

  console.log('');
  console.log(`  ${descargadas.length} descargadas, ${saltadas.length} sin cambios, ${fallos.length} fallidas.`);

  if (pendientes.length > 0) {
    console.log('');
    console.log(`  ${pendientes.length} imagen(es) sin URL en el manifiesto:`);
    for (const [clave, info] of pendientes) console.log(`    - ${clave}: ${info}`);
    console.log('  Pega la URL en ' + MANIFIESTO + ' y vuelve a ejecutar esto.');
  }

  if (fallos.length > 0) {
    console.error('');
    console.error('  Si son URLs de Facebook, lo más probable es que hayan caducado.');
    console.error('  Pide la foto de nuevo en la página y actualiza la URL.');
    process.exit(1);
  }

  console.log('');
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
