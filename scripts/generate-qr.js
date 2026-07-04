// Menü sayfasına yönlendiren QR kodunu üretir.
//
// Kullanım:
//   node scripts/generate-qr.js https://menu.ornek-restoran.com
//   SITE_URL=https://menu.ornek-restoran.com node scripts/generate-qr.js
//
// URL verilmezse (yerel test amaçlı) http://localhost:5173 kullanılır —
// gerçek yayına almadan önce üretim domaini ile YENİDEN üretilmelidir.

import QRCode from 'qrcode';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/images');
const outFile = resolve(outDir, 'qr-menu.png');

const targetUrl = process.argv[2] || process.env.SITE_URL || 'http://localhost:5173';

mkdirSync(outDir, { recursive: true });

await QRCode.toFile(outFile, targetUrl, {
  width: 600,
  margin: 2,
  errorCorrectionLevel: 'M',
});

console.log(`QR kod oluşturuldu: ${outFile}`);
console.log(`Hedef URL: ${targetUrl}`);
if (targetUrl.includes('localhost')) {
  console.warn('Uyarı: bu bir yerel/test QR kodudur. Yayına almadan önce gerçek domain ile yeniden üretin.');
}
