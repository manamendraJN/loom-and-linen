/**
 * The signature scene. One pinned, scrubbed timeline (about three screens):
 *   0.0–2.0  the thread is pulled: the grey "fast fashion" rail slides away
 *   1.0–3.1  the studio comes forward, warps stretch tight, headline weaves in
 *   3.1–7.6  the shuttle passes with the scroll; 30 rows, stripes grow row by row
 *   7.7–9.8  the finished cloth lifts off, folds, and becomes the shirt on the rail
 * Every tween is fromTo() with explicit values, so scrolling back reverses cleanly.
 */
import gsap from 'gsap';
import type { Page } from './core';

const ROWS = 30;
const T0 = 3.1;
const STEP = 0.15;
const PASS = 0.11;
const rowTop = (i: number) => 594 - i * 6;

export function initHero(page: Page) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  page.mm.add('(prefers-reduced-motion: no-preference)', () => {
    const q = <T extends Element = HTMLElement>(s: string) => hero.querySelector(s) as T;
    const qa = (s: string) => Array.from(hero.querySelectorAll(s));

    const pin = q('[data-hero-pin]');
    const cover = q('[data-cover]');
    const coverRail = q('[data-cover-rail]');
    const coverCopy = q('[data-cover-copy]');
    const loose = q<SVGPathElement>('[data-loose]');
    const hint = q('[data-hint]');
    const pullOuter = q('[data-pull-outer]');
    const pullInner = q('[data-pull-inner]');
    const loom = q('[data-loom]');
    const shelves = q('[data-shelves]');
    const warps = qa('[data-warp]');
    const rowsGroup = q<SVGGElement>('[data-rows]');
    const rows = qa('[data-row]');
    const shuttle = q<SVGGElement>('[data-shuttle]');
    const beater = q<SVGGElement>('[data-beater]');
    const words = qa('[data-word]');
    const turnLine = q('[data-turn-line]');
    const turnLink = q('[data-turn-link]');
    const fold = q('[data-fold]');
    const foldBottom = q('[data-fold-bottom]');
    const clothRef = q('[data-cloth-ref]');
    const rail = q('[data-rail]');
    const anchor = q('[data-shirt-anchor]');
    const shirt = q('[data-shirt]');
    const caption = q('[data-fold-caption]');
    const fg = q('[data-fg]');
    const curl = q('.curl');
    const spoolWraps = q('[data-spool-wraps]');

    // Where the folded cloth must travel to: the shirt on the rail.
    const target = () => {
      const c = clothRef.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const railX = Number(gsap.getProperty(rail, 'x')) || 0;
      const tx = a.left - railX + a.width * 0.5;
      const ty = a.top + a.height * 0.5;
      return { dx: tx - (c.left + c.width / 2), dy: ty - (c.top + c.height * 0.25), s: (a.width * 0.6) / c.width };
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    /* --- Scene 1 → the thread is pulled --- */
    tl.fromTo(hint, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.1);
    tl.fromTo(coverCopy, { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 0.55 }, 0.45);
    tl.fromTo(loose, { y: 0, opacity: 1 }, { y: 46, opacity: 0, duration: 0.6 }, 0.45);
    tl.fromTo(coverRail, { xPercent: 0 }, { xPercent: -24, duration: 1.4, ease: 'power2.in' }, 0.5);
    tl.fromTo(pullOuter, { yPercent: -100 }, { yPercent: 0, duration: 1.4 }, 0.5);
    tl.fromTo(pullInner, { yPercent: 100 }, { yPercent: 0, duration: 1.4 }, 0.5);
    tl.fromTo(cover, { opacity: 1 }, { opacity: 0, duration: 0.9 }, 1.1);

    /* --- The studio comes forward --- */
    tl.fromTo(loom, { scale: 0.86, y: 50, transformOrigin: '50% 100%' }, { scale: 1, y: 0, duration: 1.4 }, 1.0);
    tl.fromTo(shelves, { y: 40 }, { y: 0, duration: 1.8 }, 1.0);
    // The spool rolls down past the viewer, clearing the copy before the link appears.
    tl.fromTo(fg, { y: 0, scale: 1, transformOrigin: '0% 100%' }, { y: () => window.innerHeight * 0.38, scale: 1.12, duration: 2.6, ease: 'power1.in' }, 0.5);
    tl.fromTo(curl, { x: 0, opacity: 1 }, { x: () => -window.innerWidth * 0.35, opacity: 0, duration: 2.2 }, 0.6);
    tl.fromTo(spoolWraps, { x: 0 }, { x: -54, duration: 7, ease: 'none' }, 0.5);

    // Warp threads stretch tight, from the middle out.
    tl.fromTo(warps, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.5, stagger: { amount: 0.9, from: 'center' }, ease: 'power2.out' }, 1.5);

    // Headline weaves in, word by word, then the line and the link.
    tl.fromTo(words, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, 1.75);
    tl.fromTo(turnLine, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 2.35);
    tl.fromTo(turnLink, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 2.55);
    tl.fromTo(pullOuter, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 3.0);

    /* --- Weaving: the shuttle passes, each row slides in behind it, the reed beats --- */
    tl.fromTo(beater, { y: rowTop(0) - 26 }, { y: rowTop(0) - 26, duration: 0.01 }, T0 - 0.02);
    tl.fromTo(shuttle, { x: 96, y: rowTop(0) - 9 }, { x: 96, y: rowTop(0) - 9, duration: 0.01 }, T0 - 0.02);
    rows.forEach((row, i) => {
      const t = T0 + i * STEP;
      const ltr = i % 2 === 0;
      const y = rowTop(i) - 9;
      tl.fromTo(shuttle, { x: ltr ? 70 : 530, y }, { x: ltr ? 530 : 70, y, duration: PASS, ease: 'power1.inOut', immediateRender: false }, t);
      tl.fromTo(row, { x: ltr ? -300 : 300 }, { x: 0, duration: PASS * 0.66, ease: 'power1.inOut' }, t + PASS * 0.17);
      tl.fromTo(beater, { y: rowTop(i) - 26 }, { y: rowTop(i) - 1, duration: 0.025, ease: 'power2.in', immediateRender: false }, t + PASS + 0.005);
      tl.fromTo(beater, { y: rowTop(i) - 1 }, { y: rowTop(i + 1) - 26, duration: 0.012, immediateRender: false }, t + PASS + 0.03);
    });

    /* --- The cloth becomes the shirt --- */
    const tf = T0 + ROWS * STEP + 0.1; // ≈ 7.7
    tl.fromTo(rowsGroup, { opacity: 1 }, { opacity: 0, duration: 0.02 }, tf);
    tl.fromTo(fold, { opacity: 0 }, { opacity: 1, duration: 0.02 }, tf);
    tl.fromTo(loom, { scale: 1, y: 0, opacity: 1 }, { scale: 0.92, y: 16, opacity: 0.55, duration: 1, immediateRender: false }, tf + 0.05);
    tl.fromTo(foldBottom, { rotationX: 0 }, { rotationX: -180, duration: 0.55, ease: 'power2.inOut' }, tf + 0.1);
    tl.fromTo(rail, { x: () => window.innerWidth * 0.75 }, { x: 0, duration: 1, ease: 'power2.out' }, tf);
    tl.fromTo(
      fold,
      { x: 0, y: 0, scale: 1, transformOrigin: '50% 25%' },
      { x: () => target().dx, y: () => target().dy, scale: () => target().s, duration: 0.85, ease: 'power2.inOut', immediateRender: false },
      tf + 0.6,
    );
    tl.fromTo(fold, { opacity: 1 }, { opacity: 0, duration: 0.25, immediateRender: false }, tf + 1.35);
    tl.fromTo(shirt, { opacity: 0, scale: 0.9, rotation: 4, transformOrigin: '50% 0%' }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' }, tf + 1.3);
    tl.fromTo(caption, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, tf + 1.7);
    tl.to({}, { duration: 0.3 }); // short hold before the next scene rises

    /* --- Mouse parallax: each layer moves by its depth --- */
    if (window.matchMedia('(pointer: fine)').matches) {
      const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => {
        const d = Number(el.dataset.depth) || 0;
        return { d, x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }) };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(-nx * 22 * l.d);
          l.y(-ny * 14 * l.d);
        });
      };
      window.addEventListener('pointermove', onMove, { passive: true, signal: page.signal });
    }
  });
}
