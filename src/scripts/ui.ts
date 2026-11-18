/** Shop filters, the size-guide dialog, the order builder and the contact form. */
import { colours, orderMessage, whatsappLink, type ColourId } from '../content/site';
import { readChoice } from './garment';
import { stopScroll, type Page } from './core';

export function initUi(page: Page) {
  const { signal } = page;

  /* Shop: filter by category */
  const filters = document.querySelector<HTMLElement>('[data-filters]');
  if (filters) {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-cat]'));
    const status = document.querySelector<HTMLElement>('[data-filter-status]');
    filters.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
      if (!b) return;
      const cat = b.dataset.filter;
      filters.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let shown = 0;
      cards.forEach((c) => {
        const on = cat === 'all' || c.dataset.cat === cat;
        c.hidden = !on;
        if (on) shown++;
      });
      if (status) status.textContent = `${shown} piece${shown === 1 ? '' : 's'} shown`;
    }, { signal });
  }

  /* Dialogs (size guide): Escape closes natively; backdrop click closes too */
  document.querySelectorAll<HTMLButtonElement>('[data-dialog-open]').forEach((btn) => {
    const dlg = document.getElementById(btn.dataset.dialogOpen ?? '') as HTMLDialogElement | null;
    if (!dlg) return;
    btn.addEventListener('click', () => {
      dlg.showModal();
      stopScroll(true);
    }, { signal });
    dlg.addEventListener('close', () => stopScroll(false), { signal });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || (e.target as Element).closest('[data-dialog-close]')) dlg.close();
    }, { signal });
  });

  /* Order builder: pick piece, colour, size → a WhatsApp message */
  const ob = document.querySelector<HTMLFormElement>('[data-order-builder]');
  if (ob) {
    type Item = { slug: string; name: string; colours: ColourId[]; sizes: string[] };
    const items = JSON.parse(ob.querySelector('[data-ob-data]')?.textContent ?? '[]') as Item[];
    const piece = ob.querySelector<HTMLSelectElement>('[name="piece"]')!;
    const colour = ob.querySelector<HTMLSelectElement>('[name="colour"]')!;
    const size = ob.querySelector<HTMLSelectElement>('[name="size"]')!;
    const note = ob.querySelector<HTMLTextAreaElement>('[name="note"]')!;
    const preview = document.querySelector<HTMLElement>('[data-ob-preview]')!;
    const send = document.querySelector<HTMLAnchorElement>('[data-ob-send]')!;

    const fill = (sel: HTMLSelectElement, opts: { value: string; label: string }[], keep?: string) => {
      sel.replaceChildren(...opts.map((o) => new Option(o.label, o.value)));
      if (keep && opts.some((o) => o.value === keep)) sel.value = keep;
    };
    const message = () => {
      const it = items.find((i) => i.slug === piece.value);
      if (!it) return '';
      const c = colour.value as ColourId;
      let msg = orderMessage({ name: it.name, colour: colours[c]?.name, size: size.value || undefined });
      if (note.value.trim()) msg += `\nNote: ${note.value.trim()}`;
      return msg;
    };
    const update = () => {
      const msg = message();
      preview.textContent = msg;
      send.href = whatsappLink(msg);
    };
    const onPiece = (keepColour?: string, keepSize?: string) => {
      const it = items.find((i) => i.slug === piece.value) ?? items[0];
      fill(colour, it.colours.map((c) => ({ value: c, label: colours[c].name })), keepColour);
      fill(size, [{ value: '', label: 'Not sure yet, help me choose' }, ...it.sizes.map((s) => ({ value: s, label: s }))], keepSize);
      update();
    };

    const params = new URLSearchParams(location.search);
    const prev = readChoice();
    const start = params.get('piece') ?? prev?.slug;
    if (start && items.some((i) => i.slug === start)) piece.value = start;
    onPiece(params.get('colour') ?? prev?.colour, params.get('size') ?? prev?.size);

    piece.addEventListener('change', () => onPiece(), { signal });
    [colour, size, note].forEach((el) => el.addEventListener('input', update, { signal }));
    ob.addEventListener('submit', (e) => {
      e.preventDefault();
      window.open(send.href, '_blank', 'noopener');
    }, { signal });
  }

  /* Contact form → Formspree (falls back to a normal POST without JS) */
  document.querySelectorAll<HTMLFormElement>('form[data-formspree]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!status || !button) return;
      if (form.action.includes('%5B') || form.action.includes('[')) {
        status.textContent = form.dataset.notConnected ?? '';
        return;
      }
      const label = button.textContent;
      button.disabled = true;
      button.textContent = form.dataset.sending ?? 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.textContent = form.dataset.success ?? '';
      } catch {
        status.textContent = form.dataset.error ?? '';
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    }, { signal });
  });
}
