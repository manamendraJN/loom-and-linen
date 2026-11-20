# Loom & Linen

Concept website for a fictional handloom clothing brand in Sri Lanka, designed by Depthwyn. **Not a real business.**

**The big idea:** one thread becomes the shirt you'll wear. One madder-red thread runs through the whole site. It is the scroll progress line, it gets woven into the cloth, it stitches each section to the next, and it ties up the parcel at the end.

Built with Astro 7 (static output), Tailwind CSS 4, GSAP + ScrollTrigger and Lenis.

## Start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run check      # type check (needs TypeScript 6; installed as a dev dependency)
```

**Deploy to Cloudflare Pages:** build command `npm run build`, output directory `dist`. No server or adapter is needed. For the step-by-step guide, see **[DEPLOY.md](DEPLOY.md)**.

**Helper scripts** (they use Playwright with Microsoft Edge; set `PW_CHANNEL=chrome` to use Chrome instead):

- `npm run screenshot`: run it while `npm run preview` is running. It writes `/screenshot.png` (1600×1000, for the portfolio) and `public/og.png` (1200×630, the social preview).
- `npm run icons`: rebuilds the PNG icons from `public/favicon.svg`.

## Where things live

| What | Where |
|---|---|
| All words, products, prices, contact details, chat answers | `src/content/site.ts` |
| Colours, fonts, type scale, spacing (design tokens) | `src/styles/global.css` (`@theme`) |
| Fonts (self-hosted by Astro's font API) | `astro.config.mjs` |
| Home scenes (one component per scene) | `src/components/home/` |
| Illustrations (loom, rail, shelves, spool) | `src/components/art/` |
| Motion: Lenis, ScrollTrigger, page lifecycle | `src/scripts/core.ts`, `hero.ts`, `scenes.ts` |
| Swatches, sizes, order links | `src/scripts/garment.ts` |
| Chat helper (scripted, no AI, no server) | `src/components/ChatHelper.astro`, `src/scripts/chat.ts` |

**Adding real photos.** Every photo is a labelled placeholder at the right shape. To swap one in:

1. Put the file in `src/assets/photos/`. Keep it under about 2000 px wide and 500 KB.
2. Import it in `src/content/site.ts` and set `src` on that product's photo. Astro's `<Image>` then optimises it automatically.

Placeholders on the inner pages (weavers, studio and so on) are `<Photo>` components in the page files. Pass the same `src` prop there.

## Placeholders to replace

Every `[square-bracket]` value on the site is a placeholder. Search the project for `[` to find them all.

**Business and contact** (`src/content/site.ts` → `business`, `contact`)
- `[Colombo]`: the city
- `[the weaving village]`
- `[fair-pay details]` and the full fair-pay text on the Weavers page. Only publish it once it's confirmed.
- `[Phone number]`, plus `[PHONE-DIGITS]` for `tel:` links
- `[WhatsApp number]`, plus `[WHATSAPP-DIGITS]` (country code + number, digits only) for wa.me links
- `[hello@your-domain]`
- `[Studio street address]`, `[Directions or landmark near the studio]`
- Opening hours: `[Days]`, `[Opening hours]`
- Formspree endpoint: `https://formspree.io/f/[your-form-id]`
- `[reply time]` in the contact form's thank-you message
- Live domain: `siteUrl` in `site.ts` **and** `site` in `astro.config.mjs` (both are currently `https://example.com`)


**Products** (`products` in `site.ts`)
- Prices: `[Price]`, `[Price from]` (made-to-measure), `[Amount]` and `[Amount 1–3]` (gift cards)
- SKUs: `[SKU-001]` to `[SKU-009]`
- `[Button material]`, `[lead time]` (made-to-measure), `[validity period]` (gift cards)
- Photos per product: worn on a model (4:5), flat lay (1:1), fabric close-up (1:1). Made-to-measure has its own three; the gift card has one.

**Policies**
- `[delivery areas and times]` (home page, product pages, chat) and delivery costs on the Order page
- `[exchange policy]` and the full text under Size & Care → Exchanges & returns
- `[Payment methods you accept…]` on the Order page

**Weavers page**
- Village description, fair-pay details, `[yarn source]`, `[dye details]`, `[time]`
- Three weavers: `[Weaver name]`, `[A line about them…]`, portrait photos. Publish only with their permission.

**Size guide**
- Every `[cm]` value in the size table

**Sample content.** Both customer notes on the home page are labelled "Sample", with `[Customer name]`, `[City]` and `[Country]`. Replace them with real reviews (with permission) or remove them.

**Photo placeholders**
- Home: weaver at the loom (4:5), hands passing the shuttle (1:1), fabric close-ups (new / after a year)
- Weavers: hero (4:5), village (3:2), seven process steps (3:2), three portraits (4:5)
- Contact: map embed or studio entrance (3:2)

## Accessibility and motion

- **Reduced motion.** With `prefers-reduced-motion` on, there is no smooth scrolling, pinning or scrubbing. The hero shows as two still panels (the labelled example, then the studio), so the story still reads in order.
- **Keyboard and screen readers.** Focus is visible everywhere. Escape closes the menu, the size guide and the chat. Every form field has a label, and form fields use 16px text. Buttons and links are at least 44px tall.
- **Anchors.** In-page links (`#section`) land just below the fixed header, on the same page and when arriving from another page.
