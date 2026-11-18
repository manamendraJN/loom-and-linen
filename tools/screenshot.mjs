// Portfolio screenshot (1600×1000 → /screenshot.png) and social preview (1200×630 → public/og.png).
// Run against a running preview: npm run build && npm run preview, then: node tools/screenshot.mjs
import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const base = process.env.SITE ?? 'http://127.0.0.1:4321/';
const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
// The most beautiful moment: the striped cloth almost finished, the shuttle mid-pass.
const PROGRESS = 0.74; // of the pinned hero (pin length = 2 screens)

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' });
for (const [w, h, file] of [[1600, 1000, 'screenshot.png'], [1200, 630, 'public/og.png']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.chat{display:none!important}' });
  await page.waitForTimeout(600);
  await page.evaluate(([p]) => window.scrollTo(0, Math.round(p * 2 * window.innerHeight)), [PROGRESS]);
  await page.waitForTimeout(1800);
  const raw = await page.screenshot();
  // Palette PNG with dithering keeps the soft gradients and stays small.
  await sharp(raw).png({ palette: true, quality: 92, effort: 10, dither: 0.6 }).toFile(root(file));
  console.log('saved', file);
  await page.close();
}
await browser.close();
