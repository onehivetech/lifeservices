// data.jsx — copy, imagery library, services, projects, journal, FAQs

const u = (id, w = 1600, h) => {
  const base = `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;
  return h ? `${base}&h=${h}` : base;
};

const IMG = {
  // ── Creative / conceptual — leads the brand
  creative1:    "photo-1490750967868-88aa4486c946",
  creative2:    "photo-1532712938310-34cb3982ef74",
  creative3:    "photo-1483193722442-5422d99849bc",
  creative4:    "photo-1502920917128-1aa500764cbd",
  creative5:    "photo-1518895949257-7621c3c786d7",
  creative6:    "photo-1518806118471-f28b20a1d79d",
  creative7:    "photo-1444703686981-a3abbc4d4fe3",
  creative8:    "photo-1518709268805-4e9042af9f23",
  creativeMist: "photo-1502134249126-9f3755a50d78",
  creativeNight:"photo-1465101046530-73398c7f28ca",

  // ── Elopement / wedding
  heroElope:    "photo-1519741497674-611481863552",
  coupleField:  "photo-1465495976277-4387d4b0b4c6",
  coupleSunset: "photo-1469371670807-013ccf25f16a",
  coupleBoho:   "photo-1583939003579-730e3918a45a",
  coupleQuiet:  "photo-1547721064-da6cfb341d50",
  coupleField2: "photo-1591946614720-90a587da4a36",
  coupleLake:   "photo-1591604466107-ec97de577aff",
  brideBoho:    "photo-1525258946800-98cfd641d0de",
  weddingHands: "photo-1519225421980-715cb0215aed",
  ceremony:     "photo-1511795409834-ef04bbd61622",
  flowers:      "photo-1487530811176-3780de880c2d",
  rings:        "photo-1606800052052-a08af7148866",
  candle:       "photo-1519741347686-c1e0aadf4611",

  // ── Portraits — family / maternity / lifestyle / in-home
  family:       "photo-1511895426328-dc8714191300",
  familyBeach:  "photo-1502086223501-7ea6ecd79368",
  familyHome:   "photo-1542037104857-ffbb0b9155fb",
  familySoft:   "photo-1531983412531-1f49a365ffed",
  familyField:  "photo-1488521787991-ed7bbaae773c",
  motherBaby:   "photo-1581952976147-5a2d15560349",
  motherChild:  "photo-1543342384-1f1350e27861",
  childWalk:    "photo-1503454537195-1dcabb73ffb9",
  maternity:    "photo-1545912452-8aea7e25a3d3",
  womanWarm:    "photo-1494790108377-be9c29b29330",

  // ── Branding
  workspace:    "photo-1573497019940-1c28c88b4f3e",
  brandingMaker:"photo-1521737711867-e3b97375f902",
  brandingHands:"photo-1556761175-5973dc0f32e7",
  brandingDesk: "photo-1486312338219-ce68d2c6f44d",
  brandingWoman:"photo-1611232658409-0d98127f237f",
  branding:     "photo-1551836022-d5d88e9218df",
  laptop:       "photo-1542744173-8e7e53415bb0",

  // ── Landscape / Tweed Valley
  hinterland:   "photo-1500382017468-9049fed747ef",
  beach:        "photo-1507525428034-b723cf961d3e",
  rainforest:   "photo-1448375240586-882707db888b",
  field:        "photo-1465495976277-4387d4b0b4c6",
  mountains:    "photo-1469854523086-cc02fe5d8800",
  coast:        "photo-1426604966848-d7adac402bff",

  katrina:      "photo-1573496359142-b8d87734a5a2",
};

const img = (key, w = 1600) => u(IMG[key], w);

// ────────────────────────────────────────────────────────
// Copy — Katrina's voice, refined
// ────────────────────────────────────────────────────────
const COPY = {
  positioning:   "A creative portrait artist photographing in the Tweed Valley.",
  subtitle:      "Creative portraiture, elopements, portraits & branding.",
  homeHeroLine:  "A creative portrait artist photographing in the Tweed Valley.",
  cta:           "Enquire",
  ackCountry:    "I acknowledge the Bundjalung people as the Traditional Custodians of the land on which I live and work, and pay respect to Elders past, present and emerging.",
};

// ────────────────────────────────────────────────────────
// Services — new hierarchy, uneven visual weight
// 01 Creative (primary), 02 Elopements, 03 Portraits, 04 Branding (quietest)
// ────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "creative",
    n: "01",
    label: "Creative",
    tag: "Conceptual portraiture & fine-art commissions.",
    price: "On enquiry",
    blurb: "Conceptual, styled, narrative portrait work — made slowly, scoped per project. The heart of the practice.",
    image: "creative1",
    weight: "primary",
  },
  {
    id: "elopements",
    n: "02",
    label: "Elopements",
    tag: "Intimate, intentional, unhurried.",
    price: "From $1,800",
    blurb: "Micro-weddings and elopements across the Tweed Valley, Byron Shire and Gold Coast hinterland.",
    image: "heroElope",
    weight: "mid",
  },
  {
    id: "portraits",
    n: "03",
    label: "Portraits",
    tag: "Family, maternity, lifestyle, in-home.",
    price: "From $550",
    blurb: "In-home and on-location sessions for the in-between years — quiet, gently directed.",
    image: "family",
    weight: "mid",
  },
  {
    id: "branding",
    n: "04",
    label: "Branding",
    tag: "Editorial business imagery.",
    price: "From $1,200",
    blurb: "A small line of personal branding work for makers and founders in the Northern Rivers.",
    image: "workspace",
    weight: "quiet",
  },
];

// ────────────────────────────────────────────────────────
// Curated PROJECTS — each service has 3 projects (not big galleries)
// One project = one shoot or one cohesive body of work
// ────────────────────────────────────────────────────────
const PROJECTS = {
  creative: [
    {
      slug: "ophelia",
      title: "Ophelia, Tweed River",
      year: "2025",
      meta: "A series of one — Murwillumbah",
      blurb: "A single afternoon on the Tweed, a borrowed antique dress, a model with two hours of patience and a stillness rare in someone her age. Made for the wall above the desk where I write to clients.",
      cover: "creative3",
      images: ["creative3", "creative1", "creative2", "creative4", "creative8", "creative5"],
    },
    {
      slug: "fold-of-night",
      title: "The Fold of Night",
      year: "2024",
      meta: "Winter commission — Mt Warning rainforest",
      blurb: "A six-frame editorial built around a single scene: a woman walking out of a dark wood at the half-hour before the wood becomes dark itself. Light by a single hand-held lantern.",
      cover: "creativeNight",
      images: ["creativeNight", "creative5", "creativeMist", "creative6", "creative8", "creative4"],
    },
    {
      slug: "fabric",
      title: "Fabric, in motion",
      year: "2024",
      meta: "Personal series — Lennox Head cliffs",
      blurb: "Eight meters of unbleached linen, a south-westerly wind, and a dancer who has trained for fifteen years. The series began as an excuse for a private experiment and ended as a small show at a friend's gallery.",
      cover: "creative7",
      images: ["creative7", "creative2", "creative1", "creative3", "creative6"],
    },
  ],
  elopements: [
    {
      slug: "lila-theo-cabarita",
      title: "Lila & Theo",
      year: "2026",
      meta: "Six-person sunrise ceremony — Cabarita Headland",
      blurb: "A ceremony at first light on the headland, a breakfast hour at The Channon, and an afternoon at the bus. The kind of day that earns the word elopement.",
      cover: "heroElope",
      images: ["heroElope", "coupleField", "weddingHands", "coupleSunset", "candle", "rings"],
    },
    {
      slug: "maeve-owen-osteria",
      title: "Maeve & Owen",
      year: "2025",
      meta: "Forty-person wedding — Osteria Casuarina",
      blurb: "An Italian-style restaurant in the hinterland, a long-table dinner, two sets of parents who hadn't met until that morning, and a barefoot first dance at ten p.m.",
      cover: "ceremony",
      images: ["ceremony", "coupleBoho", "flowers", "brideBoho", "candle", "coupleQuiet"],
    },
    {
      slug: "hannah-jude-brunswick",
      title: "Hannah & Jude",
      year: "2025",
      meta: "Beach elopement — Brunswick Heads",
      blurb: "Two of them, no guests, a celebrant from town, and the morning the easterly was finally still. Photographed in just under three hours.",
      cover: "coupleField2",
      images: ["coupleField2", "coupleLake", "coupleSunset", "weddingHands", "rings"],
    },
  ],
  portraits: [
    {
      slug: "whitlam-family",
      title: "The Whitlam family",
      year: "2026",
      meta: "In-home — Murwillumbah",
      blurb: "Three kids, a paddling pool, two bowls of cut watermelon, and an hour of photographs in the backyard. This is what an in-home session looks like in February.",
      cover: "familyField",
      images: ["familyField", "familyHome", "childWalk", "motherChild", "familySoft"],
    },
    {
      slug: "anya-maternity",
      title: "Anya",
      year: "2025",
      meta: "Maternity — first light, Hastings Point",
      blurb: "A first-time mother at thirty-eight weeks, on a quiet beach at six in the morning. We worked for under an hour. Half the frames are her facing away from the camera.",
      cover: "maternity",
      images: ["maternity", "motherBaby", "womanWarm", "familyBeach"],
    },
    {
      slug: "the-patels",
      title: "The Patel family",
      year: "2025",
      meta: "Extended family — Tweed hinterland",
      blurb: "Three generations, two dogs, and grandparents visiting from Mumbai for the first time in eleven years. A ninety-minute walking session along a single stretch of dirt road.",
      cover: "family",
      images: ["family", "familyBeach", "motherBaby", "childWalk", "familyHome"],
    },
  ],
  branding: [
    {
      slug: "ceramicist",
      title: "A ceramicist's studio",
      year: "2025",
      meta: "Half-day session — Crabbes Creek",
      blurb: "A maker working in a shed at the back of her parents' property. Half-day shoot, two locations: hands at the wheel, and a clean editorial portrait against the painted weatherboard.",
      cover: "workspace",
      images: ["workspace", "brandingHands", "brandingMaker", "branding"],
    },
    {
      slug: "founder-portraits",
      title: "Founder portraits",
      year: "2025",
      meta: "Two-location session — Byron Bay",
      blurb: "A small library of portraits and working shots for a wellness founder relaunching her business. Headshots, candid moments, and three deliberate hero frames for the new homepage.",
      cover: "brandingWoman",
      images: ["brandingWoman", "brandingDesk", "laptop", "branding"],
    },
  ],
};

// ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "She turned up to our place with three kids losing their minds and somehow, an hour later, we had the family portraits we'd been trying to get for five years.",
    name: "Hannah",
    detail: "Family portraits, Murwillumbah",
  },
  {
    quote: "Katrina photographed our elopement on the headland above Brunswick and made the whole morning feel like ours, not a shoot. The images came back two weeks later and we have not stopped looking at them since.",
    name: "Erin & Tom",
    detail: "Elopement, Brunswick Heads",
  },
  {
    quote: "Her creative work is unlike anything else in the region. Working with her was the most creatively alive I've felt in a long time.",
    name: "Marlowe",
    detail: "Creative commission",
  },
  {
    quote: "I had no idea what to do in front of a camera. Katrina shot a brand session that I'm still pulling images from two years later.",
    name: "Sasha",
    detail: "Branding, Byron Bay",
  },
];

// ────────────────────────────────────────────────────────
const JOURNAL = [
  { cat: "Creative",   title: "On making strange pictures slowly",                 image: "creative3",   date: "April 2026",    read: "9 min",  excerpt: "Notes on a creative practice that resists the pace of the wedding season." },
  { cat: "Elopements", title: "Lila & Theo — a sunrise elopement at Cabarita",    image: "heroElope",   date: "March 2026",    read: "12 min", excerpt: "A six-person ceremony at first light, an hour drive to The Channon for breakfast, and a slow afternoon at the bus." },
  { cat: "Family",     title: "The Whitlam family — a Sunday in their backyard",  image: "familyField", date: "February 2026", read: "8 min",  excerpt: "Three kids, a paddling pool, two bowls of cut watermelon and one quiet hour of photographs." },
  { cat: "Elopements", title: "Where to elope in the Tweed Valley — twelve places I love",  image: "hinterland", date: "February 2026", read: "18 min", excerpt: "Twelve locations I keep coming back to, with what each one is good for and when the light is best." },
  { cat: "Maternity",  title: "Anya — a maternity session at first light",        image: "maternity",   date: "January 2026",  read: "6 min",  excerpt: "An hour on a quiet beach with a first-time mother at thirty-eight weeks." },
  { cat: "In-Home",    title: "What an in-home lifestyle session actually looks like", image: "familyHome", date: "December 2025", read: "10 min", excerpt: "On letting kids set the pace and trusting the wait." },
  { cat: "Branding",   title: "Photographing a maker — a ceramicist's studio",    image: "workspace",   date: "November 2025", read: "8 min",  excerpt: "Half a day in a shed at the back of a paddock, building a library that fits her year." },
  { cat: "Personal",   title: "On turning fifty",                                  image: "katrina",     date: "October 2025",  read: "5 min",  excerpt: "A short essay on still photographing, still learning, still uncertain about most of it." },
];

const JOURNAL_CATS = ["All", "Creative", "Elopements", "Family", "Maternity", "In-Home", "Branding", "Personal"];

// ────────────────────────────────────────────────────────
const FAQS = [
  { q: "How far in advance should I book?", a: "For elopements, six to twelve months is typical, though I do hold space each season for shorter notice. Portraits and branding sessions usually book four to six weeks out. If you're working to a tighter timeline, send me a note anyway and I'll tell you honestly what's possible." },
  { q: "Do you travel outside the Tweed Valley?", a: "Yes — though my home is the Tweed, Byron Shire and Gold Coast hinterland, and most of my work happens within an hour of Murwillumbah. I travel further by arrangement; travel costs are quoted up front." },
  { q: "How long until I receive my photographs?", a: "Sneak peeks within seven days, full galleries within four weeks for portraits and within six weeks for elopements. Galleries are delivered through Pic-Time with a print release included." },
  { q: "Do you offer albums and prints?", a: "Yes. Every gallery comes with a print release so you can print anywhere you like, and I sell heirloom albums and fine-art prints through Pic-Time if you'd prefer that done for you." },
  { q: "What's your approach on the day?", a: "Quiet. Unhurried. I direct gently where it helps and stay out of the way where it doesn't. Bring your people, be in your day, and let me work around it." },
  { q: "Do you have backup gear?", a: "Two camera bodies, three lenses, two flashes, dual memory cards on every shot. Insured. Nothing on the day depends on a single piece of equipment." },
  { q: "What does Creative actually mean?", a: "Conceptual portraiture — styled, narrative, often a little strange. We start with a conversation about an idea you've been carrying, scope a small concept and a location, and build the shoot around it. Pricing is bespoke because no two commissions are the same." },
  { q: "What if it rains?", a: "We don't reschedule — we shoot anyway. Some of my favourite work has happened in light rain or in the half-hour after a storm." },
];

const SHOOT_TYPES = ["Creative commission", "Elopement", "Portrait session", "Branding", "Not sure yet"];

Object.assign(window, { IMG, u, img, COPY, SERVICES, PROJECTS, TESTIMONIALS, JOURNAL, JOURNAL_CATS, FAQS, SHOOT_TYPES });
