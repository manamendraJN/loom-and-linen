/**
 * Client entry. Runs on every page: start on astro:page-load,
 * clean up on astro:before-swap (Astro ClientRouter).
 */
import { initCore, destroyCore, pageReady } from './core';
import { initHero } from './hero';
import { initScenes } from './scenes';
import { initPieces } from './garment';
import { initMenu } from './menu';
import { initChat } from './chat';
import { initUi } from './ui';

document.addEventListener('astro:page-load', () => {
  const page = initCore();
  initMenu(page);
  initPieces(page);
  initUi(page);
  initHero(page);
  initScenes(page);
  initChat();
  pageReady();
});

document.addEventListener('astro:before-swap', () => destroyCore());
