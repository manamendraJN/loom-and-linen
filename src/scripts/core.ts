/**
 * Motion core: Lenis smooth scrolling + GSAP ScrollTrigger, set up on every
 * astro:page-load and torn down on astro:before-swap. Also owns in-page
 * anchor scrolling (lands just below the fixed header) and the progress thread.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export interface Page {
  signal: AbortSignal;
  mm: gsap.MatchMedia;
  motion: boolean;
}

let lenis: Lenis | null = null;
let abort: AbortController | null = null;
let mm: gsap.MatchMedia | null = null;
let tick: ((time: number) => void) | null = null;

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const getLenis = () => lenis;

export function headerOffset(): number {
  const h = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 72;
  return h + 12;
}

/** Scroll so that the target sits just below the fixed header. */
export function scrollToTarget(target: Element | number, immediate = false) {
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - headerOffset();
  const top = Math.max(0, y);
  if (lenis && !immediate) {
    lenis.scrollTo(top, { duration: 1.1, force: true });
  } else {
    lenis?.scrollTo(top, { immediate: true, force: true });
    window.scrollTo({ top, behavior: immediate || prefersReduced() ? 'auto' : 'smooth' });
  }
}

export function stopScroll(stop: boolean) {
  if (!lenis) return;
  if (stop) lenis.stop();
  else lenis.start();
}

function onAnchorClick(ev: MouseEvent) {
  if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
  const a = (ev.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a || (a.target && a.target !== '_self')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || !url.hash) return;
  const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!el) return;
  ev.preventDefault();
  history.replaceState(history.state, '', url.hash);
  scrollToTarget(el);
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function setupProgress(signal: AbortSignal) {
  const line = document.querySelector<HTMLElement>('[data-progress-line]');
  const needle = document.querySelector<HTMLElement>('[data-progress-needle]');
  if (!line || !needle) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    line.style.transform = `scaleY(${p})`;
    needle.style.transform = `translateY(${p * (window.innerHeight - 22)}px)`;
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', queue, { passive: true, signal });
  window.addEventListener('resize', queue, { signal });
  ScrollTrigger.addEventListener('refresh', queue);
  signal.addEventListener('abort', () => ScrollTrigger.removeEventListener('refresh', queue));
  update();
}

export function initCore(): Page {
  abort = new AbortController();
  const motion = !prefersReduced();
  document.documentElement.classList.toggle('motion-ok', motion);

  if (motion) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: false, stopInertiaOnNavigate: true });
    lenis.on('scroll', ScrollTrigger.update);
    tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }
  mm = gsap.matchMedia();
  document.addEventListener('click', onAnchorClick, { capture: true, signal: abort.signal });
  setupProgress(abort.signal);
  return { signal: abort.signal, mm, motion };
}

/** After all scenes are built: measure, then honour any #hash in the URL. */
export function pageReady() {
  ScrollTrigger.refresh();
  const land = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (el) scrollToTarget(el, true);
  };
  requestAnimationFrame(land);
  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
    if (location.hash) land();
  });
}

export function destroyCore() {
  abort?.abort();
  abort = null;
  mm?.revert();
  mm = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
}
