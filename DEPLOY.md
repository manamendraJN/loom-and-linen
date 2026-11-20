# Deploying Loom & Linen to Cloudflare Pages

The site is fully static: `npm run build` produces plain HTML, CSS, JS, fonts and images in `dist/`. No server, adapter or database is needed. Cloudflare Pages hosts it for free.

There are two ways to deploy:

- **A. Connect the GitHub repo** (recommended): every push to `main` deploys automatically.
- **B. Upload from your computer** with Wrangler: no Git connection, you deploy by hand.

---

## Before you deploy (one-time checklist)

1. **Node version.** Astro 7 needs Node 22.23 or newer. The repo has a `.node-version` file (`24`), which Cloudflare reads automatically. Locally, check with `node -v`.

2. **Build and check locally first:**
   ```bash
   npm install
   npm run check     # should say 0 errors
   npm run build     # should end with "Complete!"
   npm run preview   # open http://localhost:4321 and click through the site
   ```

3. **Set your live address** (used for canonical links and the social preview image). Change `https://example.com` in **both** places:
   - `astro.config.mjs` → `site: 'https://your-domain.com'`
   - `src/content/site.ts` → `business.siteUrl`

   If you don't have a domain yet, deploy once (step A or B below), copy the `https://<project>.pages.dev` address Cloudflare gives you, put it in both places, then deploy again.

4. **Contact form (optional).** Create a free form at [formspree.io](https://formspree.io), copy its endpoint (`https://formspree.io/f/xxxxxxx`) and paste it into `contact.formspreeEndpoint` in `src/content/site.ts`. Until then, the form shows a friendly "not connected yet" message and points visitors to WhatsApp and email.

5. **Portfolio link.** The footer's "Depthwyn" link goes to `https://business-site.depthwyn.workers.dev` (`portfolio.studioUrl` in `src/content/site.ts`). Change it there if your main site moves.

6. **Commit and push** your changes to GitHub (needed for option A):
   ```bash
   git add .
   git commit -m "Loom & Linen concept site"
   git push origin main
   ```

> The build downloads the Google fonts (Fraunces, Instrument Sans, IBM Plex Mono) and self-hosts them, so the build machine needs internet access. Cloudflare's build machines have it.

---

## Option A: Deploy from GitHub (automatic)

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) (a free account is enough).
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorise GitHub and choose the repository **`loom-and-linen`**.
4. Fill in the build settings:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave empty)* |

5. *(Only if the build complains about the Node version)* open **Environment variables** and add `NODE_VERSION` = `24`.
6. Click **Save and Deploy**. The first build takes a couple of minutes. You'll then get an address like `https://loom-and-linen.pages.dev`.

**After that:**
- Every push to `main` redeploys the live site automatically.
- Pushes to other branches create **preview deployments** with their own URLs, which are handy for showing changes before they go live.
- To roll back, open **Deployments** in the project, choose an older one and click **Rollback**.

---

## Option B: Upload from your computer (Wrangler)

1. Build the site:
   ```bash
   npm run build
   ```
2. Log in to Cloudflare from the terminal (opens a browser window once):
   ```bash
   npx wrangler login
   ```
3. Deploy the `dist` folder:
   ```bash
   npx wrangler pages deploy dist --project-name loom-and-linen
   ```
   The first time, it asks to create the project. Answer yes and choose `main` as the production branch.
4. Repeat steps 1 and 3 whenever you want to publish changes.

---

## Custom domain (optional)

1. In the Pages project, open **Custom domains** → **Set up a custom domain**.
2. Enter your domain (for example `loomandlinen.example`, or a subdomain such as `loom.depthwyn.com`).
   - If the domain's DNS is already on Cloudflare, it's set up automatically.
   - If not, Cloudflare shows a CNAME record to add at your domain registrar.
3. Wait for the SSL certificate to show **Active** (usually a few minutes).
4. Put the final domain into `astro.config.mjs` (`site`) and `src/content/site.ts` (`business.siteUrl`), then redeploy.

---

## What's already set up for Cloudflare

- **`public/_headers`**: files in `/_astro/` (the hashed CSS, JS and fonts) are cached for a year. HTML is always fresh, so new deploys show up immediately.
- **`404.html`**: Cloudflare Pages serves it automatically for unknown addresses.
- **Clean URLs**: pages build as folders (`/shop/`, `/weavers/` and so on), so links work without `.html`.
- **`robots.txt`**, **favicons**, **`site.webmanifest`** and **`og.png`** (the social preview) are in `public/` and get copied as-is.

---

## Check the live site

After each deploy, open the live URL and check:

- [ ] The home page scrolls through the story: grey rail → loom weaving → shirt → collection → steps → parcel.
- [ ] It works on a phone (open it on your own phone, not just a resized browser).
- [ ] Menu, Shop, product pages, Our Weavers, Size & Care, Order and Contact all open.
- [ ] A colour swatch dyes the garment, and **Order on WhatsApp** opens WhatsApp with the message filled in. It only works once the real WhatsApp number is set.
- [ ] The chat helper (bottom right) answers and keeps the conversation when you change page.
- [ ] The contact form sends a test message (if Formspree is connected).
- [ ] The social preview looks right: paste the URL into [opengraph.xyz](https://www.opengraph.xyz) or a WhatsApp chat.
- [ ] The footer note reads "Concept project designed by Depthwyn. Not a real business." and its link works.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with a Node version error | Make sure `.node-version` is committed, or set the environment variable `NODE_VERSION=24` in the Pages project settings, then retry the deployment. |
| Build fails while downloading fonts | Usually temporary. Retry the deployment from the **Deployments** tab. |
| `npm run check` says it doesn't support TypeScript 7 | Run `npm install` again. The project pins TypeScript 6 for `astro check`. (Cloudflare only runs `npm run build`, so this never blocks a deploy.) |
| Social preview shows the wrong address or no image | Set the real domain in `astro.config.mjs` and `business.siteUrl`, redeploy, then refresh the preview in the platform's debugger (WhatsApp and Facebook cache previews). |
| Old version still showing | Hard refresh (Ctrl + F5). HTML isn't long-cached, so a new deploy appears within seconds. |
| WhatsApp button opens a broken link | The number is still the placeholder. Set `contact.whatsappNumber` to digits only, with the country code (e.g. `94…`). |

---

## Updating content later

1. Edit `src/content/site.ts` (text, products, prices, contact details) or add photos (see the README).
2. Run `npm run build` locally to make sure it still builds.
3. **Option A:** commit and push; it deploys automatically. **Option B:** run `npx wrangler pages deploy dist --project-name loom-and-linen`.
4. If the hero changed, refresh the portfolio images: run `npm run preview` in one terminal and `npm run screenshot` in another.
