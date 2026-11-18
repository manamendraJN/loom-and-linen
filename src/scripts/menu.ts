/** Full-screen menu: opens from the header, Escape or Close shuts it, focus is kept inside. */
import { stopScroll, type Page } from './core';

export function initMenu(page: Page) {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!menu || !toggle) return;
  const close = menu.querySelector<HTMLButtonElement>('[data-menu-close]');
  const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
  let hideTimer = 0;

  const open = () => {
    window.clearTimeout(hideTimer);
    menu.hidden = false;
    void menu.offsetWidth; // let the closed state paint before animating
    menu.setAttribute('data-open', '');
    toggle.setAttribute('aria-expanded', 'true');
    stopScroll(true);
    window.setTimeout(() => close?.focus(), 50);
  };
  const shut = (restoreFocus = true) => {
    if (!menu.hasAttribute('data-open')) return;
    menu.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    stopScroll(false);
    hideTimer = window.setTimeout(() => (menu.hidden = true), 650);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', open, { signal: page.signal });
  close?.addEventListener('click', () => shut(), { signal: page.signal });
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a[href]')) shut(false);
  }, { signal: page.signal });
  document.addEventListener('keydown', (e) => {
    if (!menu.hasAttribute('data-open')) return;
    if (e.key === 'Escape') shut();
    if (e.key === 'Tab') {
      const f = focusables();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, { signal: page.signal });
}
