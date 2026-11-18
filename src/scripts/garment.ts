/**
 * Pieces: colour swatches dye the garment sketch from the hem up, size chips
 * select a size, and every Order / WhatsApp link updates with the choice.
 * The latest choice is remembered for this visit (sessionStorage) so the
 * invitation scene and the order page can pre-fill it.
 */
import gsap from 'gsap';
import { colours, orderMessage, whatsappLink, type ColourId } from '../content/site';
import type { Page } from './core';

export interface Choice {
  slug: string;
  name: string;
  colour?: ColourId;
  size?: string;
}
const KEY = 'll-choice';

export function readChoice(): Choice | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Choice) : null;
  } catch {
    return null;
  }
}
function saveChoice(c: Choice) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* storage unavailable: the page still works */
  }
}

export function dye(garment: Element, colour: string, animate: boolean) {
  if (garment.getAttribute('data-active') === colour) return;
  const layer = garment.querySelector(`.dye[data-dye="${colour}"]`);
  if (!layer || !layer.parentNode) return;
  const all = garment.querySelectorAll('.dye');
  const last = all[all.length - 1];
  if (last !== layer) layer.parentNode.insertBefore(layer, last.nextSibling);
  const rise = layer.querySelector('.dye-rise');
  gsap.killTweensOf(rise);
  if (animate) gsap.fromTo(rise, { y: 410 }, { y: 0, duration: 0.95, ease: 'power2.out' });
  else gsap.set(rise, { y: 0 });
  garment.setAttribute('data-active', colour);
}

function pieceState(piece: HTMLElement): Choice {
  const colour = piece.querySelector<HTMLElement>('[data-swatch][aria-pressed="true"]')?.dataset.swatch as ColourId | undefined;
  const size = piece.querySelector<HTMLElement>('[data-size][aria-pressed="true"]')?.dataset.size;
  return { slug: piece.dataset.slug ?? '', name: piece.dataset.name ?? '', colour, size };
}

function sync(piece: HTMLElement, remember: boolean) {
  const c = pieceState(piece);
  const colourName = c.colour ? colours[c.colour].name : undefined;
  piece.querySelectorAll<HTMLElement>('[data-colour-name]').forEach((el) => (el.textContent = colourName ?? ''));
  piece.querySelectorAll<HTMLElement>('[data-size-name]').forEach((el) => (el.textContent = c.size ?? 'not chosen yet'));
  piece.querySelectorAll<HTMLAnchorElement>('[data-order-link]').forEach((a) => {
    const params = new URLSearchParams();
    if (c.colour) params.set('colour', c.colour);
    if (c.size) params.set('size', c.size);
    a.href = `${a.dataset.orderLink}?${params.toString()}#order`;
  });
  piece.querySelectorAll<HTMLAnchorElement>('[data-wa-order]').forEach((a) => {
    a.href = whatsappLink(orderMessage({ name: c.name, colour: colourName, size: c.size }));
  });
  if (remember) {
    saveChoice(c);
    showChoice();
  }
}

export function setColour(piece: HTMLElement, colour: string, animate: boolean) {
  piece.querySelectorAll<HTMLElement>('[data-swatch]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.swatch === colour)));
  piece.querySelectorAll('[data-garment]').forEach((g) => dye(g, colour, animate));
}
export function setSize(piece: HTMLElement, size: string) {
  piece.querySelectorAll<HTMLElement>('[data-size]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.size === size)));
}

export function initPieces(page: Page) {
  const params = new URLSearchParams(location.search);
  document.querySelectorAll<HTMLElement>('[data-piece]').forEach((piece) => {
    // A product page can arrive with ?colour=…&size=…
    if (piece.hasAttribute('data-from-url')) {
      const c = params.get('colour');
      const s = params.get('size');
      if (c && piece.querySelector(`[data-swatch="${CSS.escape(c)}"]`)) setColour(piece, c, false);
      if (s && piece.querySelector(`[data-size="${CSS.escape(s)}"]`)) setSize(piece, s);
    }
    sync(piece, false);
    piece.addEventListener(
      'click',
      (e) => {
        const t = e.target as Element;
        const sw = t.closest<HTMLElement>('[data-swatch]');
        const sz = t.closest<HTMLElement>('[data-size]');
        if (sw?.dataset.swatch) {
          setColour(piece, sw.dataset.swatch, page.motion);
          sync(piece, true);
        } else if (sz?.dataset.size) {
          setSize(piece, sz.dataset.size);
          sync(piece, true);
        } else if (t.closest('[data-order-link], [data-wa-order]')) {
          sync(piece, true);
        }
      },
      { signal: page.signal },
    );
  });
  showChoice();
}

/** Invitation scene: show the chosen piece and pre-fill the WhatsApp message. */
export function showChoice() {
  const box = document.querySelector<HTMLElement>('[data-choice]');
  const wa = document.querySelector<HTMLAnchorElement>('[data-wa-choice]');
  const c = readChoice();
  if (!box || !wa || !c?.name) return;
  const colourName = c.colour ? colours[c.colour]?.name : undefined;
  const text = box.querySelector('[data-choice-text]');
  if (text) text.textContent = [c.name, colourName, c.size].filter(Boolean).join(' · ');
  wa.href = whatsappLink(orderMessage({ name: c.name, colour: colourName, size: c.size }));
}
