/**
 * Loom & Linen: all business text and product data lives in this file.
 *
 * Edit words, prices, contact details and products here; the design reads
 * everything from this file. Anything in [square brackets] is a placeholder
 * you still need to replace. Testimonials are marked as samples.
 *
 * Product data is shaped like a typical shop catalogue (id, sku, price
 * object, variants by colour and size, media list) so it can move to a real
 * shop system later.
 */
import type { ImageMetadata } from 'astro';

/* ------------------------------------------------------------------ */
/* Business                                                            */
/* ------------------------------------------------------------------ */

export const business = {
  name: 'Loom & Linen',
  shortName: 'Loom & Linen',
  tagline: 'Everyday clothes in handloom cotton and linen',
  bigIdea: 'One thread becomes the shirt you’ll wear.',
  city: '[Colombo]',
  country: 'Sri Lanka',
  village: '[the weaving village]',
  /** [Your live domain] Used for canonical links and the social preview. Replace before launch. */
  siteUrl: 'https://example.com',
  fairPay: '[placeholder: the real details of how weavers are paid]',
};

export const contact = {
  phoneDisplay: '[Phone number]',
  /** Digits only, with country code, e.g. 94XXXXXXXXX. Used for tel: links. */
  phoneHref: '[PHONE-DIGITS]',
  whatsappDisplay: '[WhatsApp number]',
  /** Digits only, with country code. Used to build wa.me links. */
  whatsappNumber: '[WHATSAPP-DIGITS]',
  email: '[hello@your-domain]',
  address: ['[Studio street address]', '[Colombo], Sri Lanka'],
  hours: [
    { days: '[Days]', time: '[Opening hours]' },
    { days: '[Days]', time: '[Opening hours]' },
  ],
  mapNote: '[Directions or landmark near the studio]',
  /** Create a form at formspree.io and paste its endpoint here. */
  formspreeEndpoint: 'https://formspree.io/f/[your-form-id]',
  whatsappGreeting:
    'Hello Loom & Linen! I found you on your website and I have a question.',
};

export const portfolio = {
  studio: 'Depthwyn',
  studioUrl: 'https://[your-depthwyn-website]',
  note: 'Concept project designed by',
  noteEnd: 'Not a real business.',
};

/** Build a WhatsApp link with a message already filled in. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${encodeURIComponent(contact.whatsappNumber)}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(p: { name: string; colour?: string; size?: string }): string {
  const lines = [`Hello Loom & Linen! I’d like to order:`, `• ${p.name}`];
  if (p.colour) lines.push(`• Colour: ${p.colour}`);
  lines.push(p.size ? `• Size: ${p.size}` : '• Size: not sure yet, please help me choose');
  lines.push('Could you tell me about price and delivery? Thank you!');
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { href: '/', label: 'Home', note: 'The story in a minute' },
  { href: '/shop', label: 'Shop', note: 'The collection' },
  { href: '/weavers', label: 'Our Weavers', note: 'The hands behind the cloth' },
  { href: '/size-and-care', label: 'Size & Care', note: 'Fit, washing, exchanges' },
  { href: '/order', label: 'Order', note: 'Three easy steps' },
  { href: '/contact', label: 'Contact', note: 'WhatsApp, phone, email' },
];

/* ------------------------------------------------------------------ */
/* Colours (named after the dyes)                                      */
/* ------------------------------------------------------------------ */

export type ColourId = 'indigo' | 'madder' | 'turmeric' | 'natural' | 'charcoal';

export const colours: Record<ColourId, { name: string; note: string }> = {
  indigo: { name: 'Indigo', note: 'Deep blue that fades softly over time.' },
  madder: { name: 'Madder', note: 'A warm, earthy red.' },
  turmeric: { name: 'Turmeric', note: 'Sunlit yellow, bright but never loud.' },
  natural: { name: 'Natural', note: 'Undyed, the colour of the thread itself.' },
  charcoal: { name: 'Charcoal', note: 'A soft, deep grey for work days.' },
};

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type Sketch = 'shirt' | 'dress' | 'overshirt' | 'trousers' | 'sarong' | 'wrap' | 'measure' | 'giftcard';
export type PhotoKind = 'model' | 'flat' | 'closeup' | 'weaver' | 'detail';

export interface Photo {
  kind: PhotoKind;
  /** What the photo should show, printed on the placeholder. */
  label: string;
  alt: string;
  /** width / height */
  ratio: number;
  /** Drop a real photo in later: import it and set src. */
  src?: ImageMetadata;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: 'cotton' | 'linen' | 'sarongs' | 'made-to-measure' | 'gift-cards';
  sketch: Sketch;
  cloth: string;
  summary: string;
  description: string[];
  details: string[];
  colours: ColourId[];
  sizes: string[];
  /** amount stays null until you set real prices; display is what we show. */
  price: { amount: number | null; currency: 'LKR'; display: string };
  photos: Photo[];
  care: string[];
  featured: boolean;
}

export const categories: { id: Product['category']; label: string; line: string }[] = [
  { id: 'cotton', label: 'Handloom cotton', line: 'Everyday shirts and dresses.' },
  { id: 'linen', label: 'Linen workwear', line: 'Shirts, trousers and overshirts for the office.' },
  { id: 'sarongs', label: 'Sarongs & wraps', line: 'Easy lengths of cloth, worn your way.' },
  { id: 'made-to-measure', label: 'Made-to-measure', line: 'Your size, your choice of cloth.' },
  { id: 'gift-cards', label: 'Gift cards', line: 'Let them choose their own piece.' },
];

const standardCare = [
  'Wash cool, by hand or on a gentle cycle.',
  'Dry in the shade, on a line or a hanger.',
  'Iron while still a little damp.',
];

const photos = (name: string): Photo[] => [
  { kind: 'model', label: `${name}, worn on a model`, alt: `${name} worn on a model`, ratio: 4 / 5 },
  { kind: 'flat', label: `${name}, flat lay`, alt: `${name} laid flat`, ratio: 1 },
  { kind: 'closeup', label: `${name}, fabric close-up`, alt: `Close-up of the handloom weave of the ${name}`, ratio: 1 },
];

export const products: Product[] = [
  {
    id: 'p-everyday-shirt',
    sku: '[SKU-001]',
    slug: 'everyday-shirt',
    name: 'The Everyday Shirt',
    category: 'cotton',
    sketch: 'shirt',
    cloth: 'Handloom cotton',
    summary: 'A light, easy shirt for hot days that still looks sharp.',
    description: [
      'Our everyday shirt is cut from handloom cotton that lets the air through. It feels cool on a hot afternoon and still looks neat when you walk into a meeting.',
      'The cloth starts a little crisp and gets softer every time you wash it.',
    ],
    details: ['Relaxed, straight cut', '[Button material] buttons', 'Woven in [the weaving village]', 'Cut and sewn in [Colombo]'],
    colours: ['indigo', 'madder', 'turmeric', 'natural'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Everyday Shirt'),
    care: [...standardCare, 'Indigo may share a little colour at first. Wash it on its own for the first few washes.'],
    featured: true,
  },
  {
    id: 'p-market-dress',
    sku: '[SKU-002]',
    slug: 'market-dress',
    name: 'The Market Dress',
    category: 'cotton',
    sketch: 'dress',
    cloth: 'Handloom cotton',
    summary: 'A loose, cool dress for long days in the heat.',
    description: [
      'An easy shift dress with room to move. The handloom cotton breathes, so it stays comfortable from the morning market to dinner.',
      'It has pockets, because everything should.',
    ],
    details: ['Loose shift shape', 'Two side pockets', 'Woven in [the weaving village]', 'Cut and sewn in [Colombo]'],
    colours: ['indigo', 'madder', 'turmeric', 'natural'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Market Dress'),
    care: standardCare,
    featured: true,
  },
  {
    id: 'p-studio-shirt',
    sku: '[SKU-003]',
    slug: 'studio-shirt',
    name: 'The Studio Shirt',
    category: 'linen',
    sketch: 'shirt',
    cloth: 'Handloom linen',
    summary: 'A sharp linen shirt for work, made for warm offices and long commutes.',
    description: [
      'A cleaner, more tailored shirt in handloom linen. It keeps its shape at your desk and lets the heat out on the way home.',
      'Linen creases a little. That is part of its charm, and it softens beautifully.',
    ],
    details: ['Tailored, straight cut', 'Classic collar', 'Woven in [the weaving village]', 'Cut and sewn in [Colombo]'],
    colours: ['natural', 'indigo', 'charcoal', 'madder'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Studio Shirt'),
    care: standardCare,
    featured: true,
  },
  {
    id: 'p-office-trouser',
    sku: '[SKU-004]',
    slug: 'office-trouser',
    name: 'The Office Trouser',
    category: 'linen',
    sketch: 'trousers',
    cloth: 'Handloom linen',
    summary: 'Straight linen trousers that stay cool from desk to dinner.',
    description: [
      'Straight-leg linen trousers with a soft waist at the back and a neat front. Smart enough for work, easy enough for a long flight home.',
    ],
    details: ['Straight leg', 'Half-elastic waist', 'Side pockets', 'Woven in [the weaving village]'],
    colours: ['natural', 'charcoal', 'indigo'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Office Trouser'),
    care: standardCare,
    featured: true,
  },
  {
    id: 'p-overshirt',
    sku: '[SKU-005]',
    slug: 'linen-overshirt',
    name: 'The Linen Overshirt',
    category: 'linen',
    sketch: 'overshirt',
    cloth: 'Heavier handloom linen',
    summary: 'A light layer for cool offices and evening rain.',
    description: [
      'A boxy overshirt in a heavier handloom linen. Wear it open over a tee, or buttoned up when the air conditioning wins.',
    ],
    details: ['Boxy fit', 'Two chest pockets', 'Woven in [the weaving village]', 'Cut and sewn in [Colombo]'],
    colours: ['indigo', 'charcoal', 'turmeric', 'natural'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Linen Overshirt'),
    care: standardCare,
    featured: true,
  },
  {
    id: 'p-sarong',
    sku: '[SKU-006]',
    slug: 'handloom-sarong',
    name: 'The Handloom Sarong',
    category: 'sarongs',
    sketch: 'sarong',
    cloth: 'Handloom cotton, striped',
    summary: 'A striped length of cloth to wear, wrap or carry home.',
    description: [
      'A classic sarong woven with a stripe of colour along its length. Wear it at home, on the beach or out to dinner.',
      'Travellers often take one home. It folds small and lasts for years.',
    ],
    details: ['One size, ties to fit', 'Striped in the weave, not printed', 'Woven in [the weaving village]'],
    colours: ['indigo', 'madder', 'turmeric', 'natural'],
    sizes: ['One size'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Handloom Sarong'),
    care: standardCare,
    featured: true,
  },
  {
    id: 'p-wrap',
    sku: '[SKU-007]',
    slug: 'travel-wrap',
    name: 'The Travel Wrap',
    category: 'sarongs',
    sketch: 'wrap',
    cloth: 'Fine handloom cotton',
    summary: 'A light wrap for cold planes, bright sun and temple visits.',
    description: [
      'A fine, airy wrap you can wear as a scarf, a shawl or a cover-up. It rolls up small in a bag.',
    ],
    details: ['Fringed ends', 'One size', 'Woven in [the weaving village]'],
    colours: ['natural', 'indigo', 'madder', 'turmeric'],
    sizes: ['One size'],
    price: { amount: null, currency: 'LKR', display: '[Price]' },
    photos: photos('The Travel Wrap'),
    care: standardCare,
    featured: false,
  },
  {
    id: 'p-made-to-measure',
    sku: '[SKU-008]',
    slug: 'made-to-measure',
    name: 'Made-to-Measure',
    category: 'made-to-measure',
    sketch: 'measure',
    cloth: 'Your choice of cotton or linen',
    summary: 'Any piece, cut to your size, in the cloth you choose.',
    description: [
      'Choose a piece, choose your cloth and colour, and send us your measurements. We cut and sew it just for you.',
      'Not sure how to measure? Come to the studio, or we’ll walk you through it on WhatsApp.',
    ],
    details: ['Any shirt, dress or trouser from the collection', 'Measured in the studio or at home', 'Ready in [lead time]'],
    colours: ['indigo', 'madder', 'turmeric', 'natural', 'charcoal'],
    sizes: ['Your measurements'],
    price: { amount: null, currency: 'LKR', display: '[Price from]' },
    photos: [
      { kind: 'detail', label: 'Measuring a customer in the studio', alt: 'A tailor measuring a customer in the studio', ratio: 4 / 5 },
      { kind: 'closeup', label: 'Cloth swatches to choose from', alt: 'Handloom cloth swatches in indigo, madder, turmeric and natural', ratio: 1 },
      { kind: 'flat', label: 'Paper pattern and cut cloth', alt: 'A paper pattern on handloom cloth', ratio: 1 },
    ],
    care: standardCare,
    featured: false,
  },
  {
    id: 'p-gift-card',
    sku: '[SKU-009]',
    slug: 'gift-card',
    name: 'Gift Card',
    category: 'gift-cards',
    sketch: 'giftcard',
    cloth: 'Tied with thread',
    summary: 'Let someone choose their own piece.',
    description: [
      'A gift card, tied with the same thread we weave with. They can use it for any piece, or for made-to-measure.',
    ],
    details: ['Sent by WhatsApp or email, or wrapped in the studio', 'Valid for [validity period]'],
    colours: ['natural'],
    sizes: ['[Amount 1]', '[Amount 2]', '[Amount 3]'],
    price: { amount: null, currency: 'LKR', display: '[Amount]' },
    photos: [
      { kind: 'detail', label: 'Gift card tied with thread', alt: 'A Loom & Linen gift card tied with red thread', ratio: 4 / 5 },
    ],
    care: [],
    featured: false,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */
/* Home: the story, one short scene each                               */
/* ------------------------------------------------------------------ */

export const home = {
  meta: {
    title: 'Loom & Linen | Handloom cotton and linen, made by hand in Sri Lanka',
    description:
      'Everyday shirts, dresses, linen workwear and sarongs woven on wooden handlooms in Sri Lanka. Cool in the heat, softer every wash. Order on WhatsApp.',
  },
  hook: {
    tag: 'Example: fast fashion',
    tagNote: 'Not our clothes',
    headline: 'Most clothes are made fast.',
    line: 'Same cut, same grey, made by the thousand. Too hot to wear, and tired after a few washes.',
    hint: 'Scroll to pull the thread',
  },
  turn: {
    headline: 'Woven slowly. Worn every day.',
    line: 'Every piece starts as thread on a wooden handloom. Row by row, it becomes cloth that breathes.',
    link: { href: '/weavers#process', label: 'How it’s woven' },
    fold: 'One thread becomes the shirt you’ll wear.',
  },
  proof: {
    eyebrow: 'The hands behind it',
    headline: 'Real hands. Real cloth.',
    line: 'Woven by weavers in [the weaving village] who are paid fairly ([fair-pay details]). You can feel the hand in every row.',
    washTitle: 'Softer every wash',
    washStages: ['New', 'Washed', 'Worn for a year'],
    washLine: 'Handloom cloth starts a little crisp. Each wash opens the threads and makes it softer.',
    notes: [
      {
        quote: 'The only shirt I can wear on a hot afternoon commute and still look put together in a meeting.',
        name: '[Customer name]',
        place: '[City]',
      },
      {
        quote: 'I took a sarong home as a gift. You can feel it was made by someone, not something.',
        name: '[Customer name]',
        place: '[Country]',
      },
    ],
    cta: { href: '#collection', label: 'Choose your piece' },
    link: { href: '/weavers', label: 'Meet the weavers' },
  },
  offer: {
    eyebrow: 'The collection',
    headline: 'Choose your piece.',
    line: 'Tap a colour to see it dyed. Every piece shows its sizes and price, with an Order button.',
    link: { href: '/shop', label: 'See the whole collection' },
    moreTitle: 'Made-to-measure & gift cards',
    moreLine: 'Your size, your cloth. Or let someone choose their own.',
  },
  ease: {
    eyebrow: 'Ordering',
    headline: 'Three steps, then it’s yours.',
    steps: [
      { title: 'Choose your piece', line: 'Pick the cut and the colour you love.' },
      { title: 'Check your size', line: 'Use our simple guide, or ask us on WhatsApp.' },
      { title: 'It arrives folded and tied with thread', line: 'Delivery: [delivery areas and times].' },
    ],
    exchanges: 'Exchanges: [exchange policy, e.g. how many days and how].',
    links: [
      { href: '/size-and-care', label: 'Size & care guide' },
      { href: '/order', label: 'How ordering works' },
    ],
  },
  invite: {
    headline: 'Wear something made by hand.',
    line: 'Tell us your piece, colour and size. We’ll fold it, tie it with thread and send it your way.',
    choiceLabel: 'Your choice',
    noChoice: 'No piece chosen yet. We’ll help you choose.',
    shop: { href: '/shop', label: 'Shop the collection' },
    whatsapp: 'Order on WhatsApp',
  },
};

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const shopPage = {
  meta: {
    title: 'Shop the collection | Loom & Linen',
    description:
      'Handloom cotton shirts and dresses, linen workwear, sarongs, made-to-measure and gift cards. Choose a colour and size, then order on WhatsApp.',
  },
  eyebrow: 'The collection',
  headline: 'Clothes that breathe.',
  line: 'Every piece is woven on a wooden handloom and sewn in [Colombo]. Choose a colour and a size, then order on WhatsApp. No checkout, no fuss.',
};

export const productPage = {
  orderTitle: 'Order this piece',
  orderLine: 'Choose a colour and size. We’ll reply on WhatsApp with price, delivery and anything else you need.',
  colourLabel: 'Colour',
  sizeLabel: 'Size',
  sizeGuide: 'Size guide',
  orderButton: 'Order on WhatsApp',
  askButton: 'Not sure? Ask us first',
  delivery: 'Arrives folded and tied with thread. Delivery: [delivery areas and times].',
  exchanges: 'Exchanges: [exchange policy].',
  related: 'You might also like',
  sketchNote: 'Flat sketch: tap a colour to see it dyed',
};

export const weaversPage = {
  meta: {
    title: 'Our Weavers | Loom & Linen',
    description:
      'Meet the handloom weavers of [the weaving village] and see how a thread becomes the shirt you’ll wear: dyeing, warping, weaving, washing and sewing.',
  },
  eyebrow: 'Our weavers',
  headline: 'The hands behind the cloth.',
  intro:
    'Every Loom & Linen piece starts in [the weaving village], where weavers work on wooden handlooms. It is slow work. You can feel it in the cloth.',
  village: {
    title: 'The village',
    body: '[A few lines about the weaving village: where it is, how long weaving has been part of life there, and how you met the weavers.]',
  },
  fairPay: {
    title: 'Paid fairly, every row',
    body: '[The real details of how weavers are paid: rates, how they are set, and any partnership or certification. Do not publish this until it is confirmed.]',
  },
  process: {
    title: 'From thread to shirt',
    line: 'Scroll along the cloth.',
    steps: [
      { title: 'Thread', body: 'Cotton and linen yarn from [yarn source]. Strong enough for the loom, soft enough to wear.' },
      { title: 'Dye', body: 'Yarn is dyed in indigo, madder and turmeric shades [dye details], or left natural.' },
      { title: 'Warp', body: 'Each long warp thread is measured to length and wound by hand, one by one.' },
      { title: 'Loom', body: 'The warp is threaded through the loom and pulled tight. This alone takes [time].' },
      { title: 'Weave', body: 'The shuttle passes back and forth. Each pass is one row. Stripes grow row by row.' },
      { title: 'Wash', body: 'The finished cloth is washed so it is soft from the first wear.' },
      { title: 'Sew', body: 'Cut and sewn into your piece in our studio in [Colombo].' },
    ],
  },
  weavers: [
    { name: '[Weaver name]', line: '[A line about them, in their own words]', photo: 'Portrait of a weaver at the loom' },
    { name: '[Weaver name]', line: '[A line about them, in their own words]', photo: 'Weaver’s hands passing the shuttle' },
    { name: '[Weaver name]', line: '[A line about them, in their own words]', photo: 'Weaver winding thread onto a bobbin' },
  ],
  cta: { href: '/shop', label: 'Shop the collection' },
};

export const sizeCare = {
  meta: {
    title: 'Size & Care guide | Loom & Linen',
    description:
      'Find your size with our simple guide, learn how to measure, and how to wash handloom cotton and linen so it gets softer every time. Exchanges explained.',
  },
  eyebrow: 'Size & care',
  headline: 'The right fit, for years.',
  intro: 'Find your size in a minute, and keep your piece soft for years. Still not sure? Send us a WhatsApp and we’ll help.',
  table: {
    title: 'Size guide',
    note: 'Body measurements in centimetres. [Replace every value with your real measurements.]',
    columns: ['Size', 'Chest', 'Waist', 'Hip', 'Shirt length'],
    rows: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => [s, '[cm]', '[cm]', '[cm]', '[cm]']),
  },
  measure: {
    title: 'How to measure',
    steps: [
      { key: 'chest', title: 'Chest', body: 'Around the fullest part of your chest, under your arms.' },
      { key: 'waist', title: 'Waist', body: 'Around your natural waist, where you bend.' },
      { key: 'hip', title: 'Hip', body: 'Around the fullest part of your hips.' },
      { key: 'length', title: 'Length', body: 'From the top of the shoulder, by the collar, down to where you want the hem.' },
    ],
    tip: 'Keep the tape snug but not tight. Between two sizes? Our cuts are relaxed, so most people choose the smaller one.',
  },
  fit: [
    { title: 'Everyday Shirt & Studio Shirt', body: 'Relaxed through the body. Size down for a closer fit.' },
    { title: 'Market Dress', body: 'Loose shift. Choose by chest and hip.' },
    { title: 'Office Trouser', body: 'Straight leg, half-elastic waist. Choose by waist.' },
    { title: 'Linen Overshirt', body: 'Boxy, made to layer. Take your usual size.' },
  ],
  care: {
    title: 'Caring for handloom cloth',
    line: 'Handloom cloth gets better with time. A little care keeps it that way.',
    items: [
      { title: 'Wash cool', body: 'By hand, or on a gentle machine cycle with mild soap.' },
      { title: 'Dry in the shade', body: 'Strong sun fades natural colours. Hang it up to dry.' },
      { title: 'Iron while damp', body: 'Or don’t iron at all. Soft creases are part of linen.' },
      { title: 'Indigo first', body: 'Wash indigo on its own for the first few washes. It may share a little colour.' },
      { title: 'Small slubs are normal', body: 'Tiny bumps in the thread are a sign of hand weaving, not a fault.' },
      { title: 'Softer every wash', body: 'The cloth relaxes and softens each time you wash it.' },
    ],
  },
  exchanges: {
    title: 'Exchanges & returns',
    body: '[Your exchange and returns policy: how many days, condition of the piece, who pays delivery, and how to start an exchange.]',
  },
  madeToMeasure: { href: '/shop/made-to-measure', label: 'Or have it made to your measurements' },
};

export const orderPage = {
  meta: {
    title: 'How to order | Loom & Linen',
    description:
      'Order in three steps: choose your piece, check your size, and we deliver it folded and tied with thread. Build your order and send it on WhatsApp.',
  },
  eyebrow: 'Order',
  headline: 'Ordering is three small steps.',
  intro: 'There is no checkout. Choose your piece below and send it to us on WhatsApp. A real person replies, confirms the price and delivery, and helps with size.',
  steps: home.ease.steps,
  builder: {
    title: 'Build your order',
    piece: 'Piece',
    colour: 'Colour',
    size: 'Size',
    note: 'Anything else? (optional)',
    notePlaceholder: 'For example: it’s a gift, or I’m between two sizes',
    send: 'Send on WhatsApp',
    preview: 'Your message',
  },
  info: [
    { title: 'Payment', body: '[Payment methods you accept, and when payment is taken.]' },
    { title: 'Delivery', body: '[Delivery areas, times and costs, in Sri Lanka and abroad.]' },
    { title: 'Exchanges', body: '[Exchange policy.]' },
    { title: 'Visiting the studio', body: 'Try pieces on at our studio in [Colombo]. See the contact page for hours.' },
  ],
};

export const contactPage = {
  meta: {
    title: 'Contact | Loom & Linen',
    description: 'Talk to Loom & Linen on WhatsApp, by phone or email, or visit the studio in [Colombo], Sri Lanka.',
  },
  eyebrow: 'Contact',
  headline: 'Talk to a real person.',
  intro: 'The quickest way is WhatsApp. You can also call, email, send the form below, or visit the studio.',
  form: {
    title: 'Send a message',
    name: 'Your name',
    email: 'Email',
    phone: 'Phone or WhatsApp (optional)',
    topic: 'What is it about?',
    topics: ['A piece in the collection', 'Sizes and fit', 'Made-to-measure', 'Gift cards', 'Something else'],
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Thank you! Your message is on its way. We usually reply within [reply time].',
    error: 'Sorry, that didn’t send. Please try WhatsApp or email instead.',
  },
  direct: {
    whatsapp: 'WhatsApp',
    phone: 'Phone',
    email: 'Email',
    studio: 'Studio',
    hours: 'Opening hours',
  },
};

export const notFound = {
  meta: { title: 'Page not found | Loom & Linen', description: 'This page has come loose.' },
  headline: 'This thread has come loose.',
  line: 'The page you were looking for isn’t here. Let’s get you back to the cloth.',
};

/* ------------------------------------------------------------------ */
/* Chat helper (scripted, no AI, no server)                            */
/* ------------------------------------------------------------------ */

export interface ChatAnswer {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
  link?: { href: string; label: string };
}

export const chat = {
  title: 'Questions?',
  open: 'Ask a question',
  greeting: 'Hello! I can answer the common questions. Tap one below, or type your own.',
  placeholder: 'Type a question…',
  fallback: 'I’m not sure about that one. A real person can help, on WhatsApp or by the contact form.',
  handoffWhatsapp: 'Ask on WhatsApp',
  handoffForm: 'Use the contact form',
  reset: 'Start again',
  answers: [
    {
      id: 'size',
      label: 'Will it fit?',
      keywords: ['size', 'fit', 'measure', 'small', 'large', 'big', 'tight', 'loose', 'xl', 'chest', 'waist'],
      answer: 'Our cuts are relaxed. Check the simple size guide, and if you’re between sizes, most people choose the smaller one. We’re also happy to help on WhatsApp.',
      link: { href: '/size-and-care', label: 'Open the size guide' },
    },
    {
      id: 'fabric',
      label: 'What is the cloth like?',
      keywords: ['fabric', 'cloth', 'cotton', 'linen', 'material', 'photo', 'colour', 'color', 'texture', 'hot', 'breathe', 'soft'],
      answer: 'Handloom cotton and linen, woven on wooden looms. It breathes in the heat and gets softer every wash. Tiny slubs in the thread are normal: they show it was woven by hand. Colours can vary a little from the photos.',
      link: { href: '/weavers', label: 'See how it’s woven' },
    },
    {
      id: 'order',
      label: 'How do I order?',
      keywords: ['order', 'buy', 'purchase', 'checkout', 'pay', 'payment', 'price', 'cost', 'how much'],
      answer: 'Choose a piece, colour and size, then tap “Order on WhatsApp”. Your message is filled in for you. We reply with the price, payment and delivery details.',
      link: { href: '/order', label: 'How ordering works' },
    },
    {
      id: 'delivery',
      label: 'Delivery',
      keywords: ['delivery', 'deliver', 'shipping', 'ship', 'post', 'abroad', 'overseas', 'when', 'arrive'],
      answer: 'Every piece arrives folded and tied with thread. Delivery: [delivery areas, times and costs].',
    },
    {
      id: 'exchange',
      label: 'Can I exchange it?',
      keywords: ['return', 'exchange', 'refund', 'swap', 'change', 'wrong'],
      answer: 'Exchanges: [exchange policy]. Just message us and we’ll sort it out.',
      link: { href: '/size-and-care#exchanges', label: 'Exchanges & returns' },
    },
    {
      id: 'mtm',
      label: 'Made-to-measure',
      keywords: ['made to measure', 'custom', 'tailor', 'bespoke', 'measurement', 'my size'],
      answer: 'Yes! Choose any piece and cloth, and we cut it to your measurements. Ready in [lead time].',
      link: { href: '/shop/made-to-measure', label: 'About made-to-measure' },
    },
    {
      id: 'gift',
      label: 'Gift cards',
      keywords: ['gift', 'card', 'voucher', 'present'],
      answer: 'Gift cards come tied with thread, and can be sent by WhatsApp or email. Valid for [validity period].',
      link: { href: '/shop/gift-card', label: 'Gift cards' },
    },
    {
      id: 'studio',
      label: 'Visit the studio',
      keywords: ['studio', 'shop', 'visit', 'address', 'where', 'open', 'hours', 'try'],
      answer: 'Our studio is at [Studio street address], [Colombo]. Opening hours: [Opening hours].',
      link: { href: '/contact', label: 'Contact & directions' },
    },
  ] satisfies ChatAnswer[],
};

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footer = {
  line: 'Everyday clothes in handloom cotton and linen. Woven in [the weaving village], sewn in [Colombo], Sri Lanka.',
  closing: 'Made slowly, worn every day.',
};
