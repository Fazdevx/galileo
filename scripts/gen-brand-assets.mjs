/**
 * Generates optimised brand assets from the high-res masters in public/.
 *
 * Run with: node scripts/gen-brand-assets.mjs
 * Wired into predev/prebuild alongside gen-wa-chat.mjs.
 *
 * Outputs:
 *   src/assets/logo.webp        logo, max 480w  (displayed at 32-48px)
 *   src/assets/escudo.webp      crest, max 256px (displayed at 28-48px)
 *   public/favicon-16.png       16x16
 *   public/favicon-32.png       32x32
 *   public/favicon-48.png       48x48
 *   public/apple-touch-icon.png 180x180
 *   public/android-chrome-192.png
 *   public/android-chrome-512.png
 *   public/og-image.png         1200x630 social card
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PUB = 'public';
const ASSETS = 'src/assets';

const NAVY = '#1b2a4e';
const NAVY_DEEP = '#0d1525';
const BRAND = '#ff6b1a';
const BRAND_SOFT = '#ffa05c';

const exists = (p) => fs.existsSync(p);

/** Flatten alpha onto a solid background so favicons render on any tab colour. */
const flatten = (p, bg) => sharp(p).flatten({ background: bg });

async function optimiseSources() {
  const logoSrc = path.join(PUB, 'logo.png');
  const escudoSrc = path.join(PUB, 'escudo.png');

  if (exists(logoSrc)) {
    await sharp(logoSrc)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(path.join(ASSETS, 'logo.webp'));
  }

  if (exists(escudoSrc)) {
    await sharp(escudoSrc)
      .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88 })
      .toFile(path.join(ASSETS, 'escudo.webp'));
  }
}

async function favicons() {
  const escudo = path.join(ASSETS, 'escudo.webp');
  if (!exists(escudo)) return;

  for (const size of [16, 32, 48]) {
    await flatten(escudo, NAVY)
      .resize(size, size, { fit: 'contain', background: NAVY })
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(PUB, `favicon-${size}.png`));
  }

  for (const size of [180, 192, 512]) {
    await flatten(escudo, NAVY)
      .resize(size, size, { fit: 'contain', background: NAVY })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUB, size === 180 ? 'apple-touch-icon.png' : `android-chrome-${size}.png`));
  }
}

async function ogImage() {
  const escudo = path.join(ASSETS, 'escudo.webp');
  const W = 1200;
  const H = 630;

  // The wordmark is dark and disappears on navy, so the card leads with the crest.
  const mark = exists(escudo) ? await sharp(escudo).resize(150, 150, { fit: 'contain' }).png().toBuffer() : null;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1080" cy="90" r="240" fill="${BRAND}" opacity="0.10"/>
  <circle cx="80" cy="600" r="200" fill="${BRAND}" opacity="0.08"/>
  <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${BRAND}"/>
  <text x="600" y="330" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle">Colegio y Academia</text>
  <text x="600" y="420" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="92" font-weight="bold" fill="${BRAND_SOFT}" text-anchor="middle">GALILEO</text>
  <text x="600" y="478" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" fill="#d4dbeb" text-anchor="middle">Inicial &#183; Primaria &#183; Secundaria &#183; Preuniversitario</text>
  <text x="600" y="545" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="${BRAND}" text-anchor="middle">Huacho, Lima &#183; +51 997 394 157</text>
</svg>`;

  const base = sharp(Buffer.from(svg));

  if (mark) {
    const left = Math.round((W - 150) / 2);
    await base
      .composite([{ input: mark, left, top: 70 }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUB, 'og-image.png'));
  } else {
    await base.png({ compressionLevel: 9 }).toFile(path.join(PUB, 'og-image.png'));
  }
}

await optimiseSources();
await favicons();
await ogImage();

const report = [
  'public/favicon-16.png',
  'public/favicon-32.png',
  'public/favicon-48.png',
  'public/apple-touch-icon.png',
  'public/android-chrome-192.png',
  'public/android-chrome-512.png',
  'public/og-image.png',
];
for (const f of report) {
  if (exists(f)) console.log(`  ${f.padEnd(34)} ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
}
console.log('✅ Brand assets generated');
