/**
 * Scroll scenes after the hero. Each effect carries a story beat:
 * - the thread stitches each new section on (edge stitch),
 * - the next section rises while the previous sinks back and darkens,
 * - headlines weave in word by word, in reading order,
 * - the offer rail slides past like garments on a rail,
 * - the ordering labels are sewn on, the parcel is tied.
 * All scrubbed with fromTo(), so they reverse cleanly.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget, type Page } from './core';

export function initScenes(page: Page) {
  page.mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* Stitch: the thread runs along each section's top edge as it arrives */
    document.querySelectorAll<HTMLElement>('[data-stitch]').forEach((outer) => {
      const inner = outer.querySelector('[data-stitch-inner]');
      const section = outer.closest('section, footer') ?? outer;
      const st = { trigger: section, start: 'top bottom', end: 'top 55%', scrub: 0.4 };
      gsap.fromTo(outer, { xPercent: -100 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo(inner, { xPercent: 100 }, { xPercent: 0, ease: 'none', scrollTrigger: { ...st } });
    });

    /* Rise over / sink back: the covered section drifts down and darkens */
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    scenes.forEach((scene, i) => {
      const next = scenes[i + 1] ?? (scene.nextElementSibling as HTMLElement | null) ?? document.querySelector('footer');
      if (!next) return;
      const inners = scene.querySelectorAll('[data-sink-inner]');
      const dim = scene.querySelector('[data-sink-dim]');
      const st = { trigger: next, start: 'top bottom', end: 'top top', scrub: true };
      if (inners.length) gsap.fromTo(inners, { y: 0 }, { y: () => window.innerHeight * 0.22, ease: 'none', scrollTrigger: st });
      if (dim) gsap.fromTo(dim, { opacity: 0 }, { opacity: 0.55, ease: 'none', scrollTrigger: { ...st } });
    });

    /* Headlines weave in word by word */
    document.querySelectorAll<HTMLElement>('h2:has([data-rword]), h1:has([data-rword])').forEach((h) => {
      gsap.fromTo(
        h.querySelectorAll('[data-rword]'),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 90%', end: 'top 62%', scrub: 0.4 } },
      );
    });

    /* Supporting text follows, in order */
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { y: 22, opacity: 0 }, { y: 0, opacity: 1, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 74%', scrub: 0.4 } });
    });

    /* Proof: photos at different depths drift past each other */
    document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
      const d = Number(el.dataset.drift) || 0;
      gsap.fromTo(el, { y: () => -d * window.innerHeight * 0.5 }, { y: () => d * window.innerHeight * 0.5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });

    /* Proof: the weave softens, wash by wash */
    const wash = document.querySelector<HTMLElement>('[data-wash]');
    if (wash) {
      const [n, w, s] = ['new', 'washed', 'soft'].map((k) => wash.querySelector(`[data-wash-state="${k}"]`));
      const labels = wash.querySelectorAll('[data-wash-label]');
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: wash, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
      tl.fromTo(n, { opacity: 1 }, { opacity: 1, duration: 0.01 }, 0)
        .fromTo(w, { opacity: 0 }, { opacity: 1, duration: 1 }, 0.5)
        .fromTo(s, { opacity: 0 }, { opacity: 1, duration: 1 }, 2)
        .fromTo(labels[0], { opacity: 1 }, { opacity: 0.45, duration: 0.5 }, 0.8)
        .fromTo(labels[1], { opacity: 0.45 }, { opacity: 1, duration: 0.5 }, 0.8)
        .fromTo(labels[1], { opacity: 1 }, { opacity: 0.45, duration: 0.5, immediateRender: false }, 2.3)
        .fromTo(labels[2], { opacity: 0.45 }, { opacity: 1, duration: 0.5 }, 2.3)
        .to({}, { duration: 0.5 });
    }

    /* Proof: the sample notes are hung up */
    document.querySelectorAll<HTMLElement>('[data-note]').forEach((el, i) => {
      gsap.fromTo(el, { y: 50, opacity: 0, rotation: i % 2 ? 4 : -4 }, { y: 0, opacity: 1, rotation: 0, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 70%', scrub: 0.4 } });
    });

    /* Ease: each label is laid on the strip, then stitched on */
    document.querySelectorAll<HTMLElement>('[data-steps]').forEach((steps) => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: steps, start: 'top 85%', end: 'center 50%', scrub: 0.5 } });
      steps.querySelectorAll<HTMLElement>('[data-label]').forEach((label, i) => {
        tl.fromTo(label, { y: -60, opacity: 0, rotation: -7 }, { y: 0, opacity: 1, rotation: 0, duration: 0.6 }, i * 0.55);
        tl.fromTo(label.querySelectorAll('[data-label-stitch]'), { scaleY: 0 }, { scaleY: 1, duration: 0.35, stagger: 0.1, ease: 'none' }, i * 0.55 + 0.45);
      });
    });

    /* Invitation: the thread wraps the parcel and ties a knot */
    const parcel = document.querySelector<HTMLElement>('[data-parcel]');
    if (parcel) {
      const t = (k: string) => parcel.querySelector(`[data-tie="${k}"]`);
      const knot = { svgOrigin: '278 216' };
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' }, scrollTrigger: { trigger: parcel, start: 'top 85%', end: 'center 50%', scrub: 0.5 } });
      tl.fromTo(parcel, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)
        .fromTo(t('v'), { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.5 }, 0.35)
        .fromTo(t('h'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5 }, 0.75)
        .fromTo(t('knot'), { scale: 0, ...knot }, { scale: 1, duration: 0.15, ...knot }, 1.2)
        .fromTo(t('loop-l'), { scale: 0, rotation: 30, ...knot }, { scale: 1, rotation: 0, duration: 0.35, ...knot, ease: 'back.out(1.6)' }, 1.3)
        .fromTo(t('loop-r'), { scale: 0, rotation: -30, ...knot }, { scale: 1, rotation: 0, duration: 0.35, ...knot, ease: 'back.out(1.6)' }, 1.4)
        .fromTo([t('tail-l'), t('tail-r')], { scale: 0, ...knot }, { scale: 1, duration: 0.3, ...knot }, 1.55);
    }
  });

  /* Horizontal rails (the offer rail, the weaving process): slide sideways while pinned */
  page.mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-hpin]').forEach((pin) => {
      const track = pin.querySelector<HTMLElement>('[data-htrack]');
      const viewport = pin.querySelector<HTMLElement>('[data-hviewport]');
      if (!track || !viewport) return;
      const distance = () => Math.max(0, track.scrollWidth - viewport.getBoundingClientRect().width + 48);
      const tween = gsap.fromTo(track, { x: 0 }, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // Keyboard users: bring a focused item into view by scrolling the page.
      track.addEventListener('focusin', (e) => {
        // Only for keyboard focus; a mouse click must not move the rail under the pointer.
        if (!(e.target as HTMLElement).matches(':focus-visible')) return;
        const item = (e.target as HTMLElement).closest<HTMLElement>('[data-hitem]');
        const st = tween.scrollTrigger;
        if (!item || !st) return;
        const p = Math.min(1, Math.max(0, (item.offsetLeft - 32) / (distance() || 1)));
        scrollToTarget(st.start + p * (st.end - st.start), true);
      }, { signal: page.signal });
    });
  });

  ScrollTrigger.sort();
}
