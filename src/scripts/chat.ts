/**
 * Scripted chat helper (no AI, no server). The element is persisted across
 * page changes by the router, so this sets up once; the conversation is also
 * kept in sessionStorage so it survives a full reload.
 */
import type { ChatAnswer } from '../content/site';

interface ChatData {
  answers: ChatAnswer[];
  greeting: string;
  fallback: string;
  handoffWhatsapp: string;
  handoffForm: string;
  whatsapp: string;
}
interface Msg {
  from: 'bot' | 'user';
  text: string;
  links?: { href: string; label: string; external?: boolean }[];
}
const KEY = 'll-chat';
let ready = false;

export function initChat() {
  const root = document.querySelector<HTMLElement>('[data-chat]');
  if (!root || ready || root.dataset.ready) return;
  ready = true;
  root.dataset.ready = '1';

  const data = JSON.parse(root.querySelector('[data-chat-data]')?.textContent ?? '{}') as ChatData;
  const toggle = root.querySelector<HTMLButtonElement>('[data-chat-toggle]')!;
  const panel = root.querySelector<HTMLElement>('[data-chat-panel]')!;
  const log = root.querySelector<HTMLElement>('[data-chat-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-chat-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-chat-input]')!;

  let history: Msg[] = [];
  try {
    history = JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as Msg[];
  } catch {
    history = [];
  }
  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(history.slice(-40)));
    } catch {
      /* ignore */
    }
  };

  const render = (m: Msg) => {
    const el = document.createElement('div');
    el.className = `msg msg-${m.from}`;
    const p = document.createElement('p');
    p.textContent = m.text;
    el.append(p);
    if (m.links?.length) {
      const row = document.createElement('div');
      row.className = 'msg-actions';
      m.links.forEach((l) => {
        const a = document.createElement('a');
        a.href = l.href;
        a.textContent = l.label;
        if (l.external) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
        row.append(a);
      });
      el.append(row);
    }
    log.append(el);
    log.scrollTop = log.scrollHeight;
  };
  const push = (m: Msg) => {
    history.push(m);
    save();
    render(m);
  };
  const handoff = () => [
    { href: data.whatsapp, label: data.handoffWhatsapp, external: true },
    { href: '/contact#message', label: data.handoffForm },
  ];
  const answer = (a: ChatAnswer) => push({ from: 'bot', text: a.answer, links: a.link ? [a.link] : handoff().slice(0, 1) });

  const match = (q: string): ChatAnswer | null => {
    const text = q.toLowerCase();
    let best: ChatAnswer | null = null;
    let score = 0;
    data.answers.forEach((a) => {
      const s = a.keywords.reduce((n, k) => (text.includes(k) ? n + (k.includes(' ') ? 2 : 1) : n), 0);
      if (s > score) {
        score = s;
        best = a;
      }
    });
    return best;
  };

  const greet = () => push({ from: 'bot', text: data.greeting });
  if (history.length) history.forEach(render);

  const open = () => {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (!history.length) greet();
    log.scrollTop = log.scrollHeight;
    input.focus({ preventScroll: true });
  };
  const close = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', open);
  root.querySelector('[data-chat-close]')?.addEventListener('click', close);
  root.querySelector('[data-chat-reset]')?.addEventListener('click', () => {
    history = [];
    save();
    log.replaceChildren();
    greet();
  });
  root.querySelector('[data-chat-quick]')?.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-q]');
    const a = data.answers.find((x) => x.id === b?.dataset.q);
    if (!a) return;
    push({ from: 'user', text: a.label });
    answer(a);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    push({ from: 'user', text: q });
    const a = match(q);
    if (a) answer(a);
    else push({ from: 'bot', text: data.fallback, links: handoff() });
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      e.stopPropagation();
      close();
    }
  });
  // Links inside answers navigate away: keep the panel tidy.
  log.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a');
    if (a && !a.target) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  // The log and quick-answer rows carry data-lenis-prevent, so their wheel
  // and touch scrolling stays inside the panel and never fights Lenis.
}
