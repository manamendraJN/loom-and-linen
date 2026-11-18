// Rasterise the SVG favicon into PNG icons (run: node tools/generate-icons.mjs)
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (n) => new URL(`../public/${n}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
await sharp(svg, { density: 600 }).resize(32, 32).png().toFile(out('favicon-32.png'));
// apple-touch-icon: full-bleed square (iOS rounds the corners itself)
const square = Buffer.from(svg.toString().replace('rx="7"', 'rx="0"'));
await sharp(square, { density: 1200 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
await sharp(square, { density: 1200 }).resize(512, 512).png().toFile(out('icon-512.png'));
console.log('icons written');
