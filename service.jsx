// service.jsx — TWO templates:
//   CreativePage          — project-based art portfolio (no process/included/FAQ)
//   ServicePage (others)  — short intro + 2–3 curated projects + small FAQ + inquiry

function pageBgFor(slug) { return "var(--bg)"; }

// ─────────────────────────────────────────────────────────────
// CREATIVE PAGE — art portfolio
// ─────────────────────────────────────────────────────────────
function CreativePage({ go, openInquiry, openInquiryFor }) {
  const projects = PROJECTS.creative;
  const allImages = projects.flatMap((p) => p.images);
  const [lbIndex, setLbIndex] = React.useState(null);

  // compute offset per project for lightbox indexing
  const offsets = projects.reduce((acc, p, i) => {
    acc[i] = i === 0 ? 0 : acc[i - 1] + projects[i - 1].images.length;
    return acc;
  }, {});

  return (
    <div>
      {/* HERO — type-led, no big image (image work follows) */}
      <section style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>SECTION — CREATIVE PORTFOLIO</div>
          <h1
            className="serif"
            style={{
              fontWeight: 300,
              fontSize: "clamp(64px, 8.5vw, 144px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "var(--fg)",
              maxWidth: "14ch",
            }}
          >
            Pictures made <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>slowly.</em>
          </h1>
          <p className="body-l" style={{ marginTop: 36, maxWidth: "58ch", fontSize: 19, color: "var(--fg-soft)" }}>
            Conceptual, styled and narrative portrait work — made one idea at a time, scoped per project. A small line of bespoke commissions for people who want a photograph that feels like a scene from a film they haven't yet made.
          </p>
        </div>
      </section>

      {/* Project series — one per row, generous whitespace */}
      {projects.map((p, i) => (
        <section
          key={p.slug}
          style={{
            padding: "120px 0",
            borderTop: i === 0 ? "1px solid var(--rule-soft)" : "none",
            background: i % 2 === 1 ? "var(--beige-soft)" : "var(--bg)",
          }}
        >
          <div className="container--wide" style={{ padding: "0 56px" }}>
            {/* Project header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, marginBottom: 64, alignItems: "end" }}>
              <div>
                <div className="tiny" style={{ color: "var(--accent)", marginBottom: 16 }}>PROJECT 0{i + 1}  /  {p.year}</div>
                <p className="caption" style={{ margin: 0, fontSize: 14 }}>{p.meta}</p>
              </div>
              <div>
                <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5.5vw, 80px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
                  <em style={{ fontStyle: "italic", color: "var(--fg)", fontWeight: 400 }}>{p.title}</em>
                </h2>
                <p className="body-l" style={{ marginTop: 28, maxWidth: "56ch", fontSize: 17 }}>{p.blurb}</p>
              </div>
            </div>

            <ProjectGallery
              images={p.images}
              openLightbox={(idx) => setLbIndex(idx)}
              offset={offsets[i]}
            />
          </div>
        </section>
      ))}

      {/* About my creative practice — quiet, two-column */}
      <section className="section section--alt">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 88 }}>
            <div>
              <div className="marker" style={{ color: "var(--fg-mute)" }}>ON MY CREATIVE PRACTICE</div>
            </div>
            <div>
              <p className="body-l" style={{ margin: 0, fontSize: 19, maxWidth: "58ch" }}>
                The creative work began as a personal project — an excuse to follow ideas that don't fit inside a wedding day or a portrait session — and grew into a small line of bespoke commissions for people who want a photograph that feels like a scene from a film they haven't yet made.
              </p>
              <p className="body-l" style={{ marginTop: 24, fontSize: 17, color: "var(--fg-soft)", maxWidth: "58ch" }}>
                Every commission starts with a conversation about an image you've been carrying. We sit with it together until it becomes a shoot we can scope — a written treatment, a location, a small team, a few months of patience. Final delivery is usually six to twelve hero images.
              </p>
              <p className="body-l" style={{ marginTop: 24, fontSize: 17, color: "var(--fg-soft)", maxWidth: "58ch" }}>
                I take on three to five creative commissions a year. Pricing is bespoke because no two projects are the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing — quiet inquiry */}
      <section className="section">
        <div className="container--narrow" style={{ textAlign: "center" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>ENQUIRE</div>
          <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0 }}>
            If there's an image <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>you've been carrying,</em> begin here.
          </h3>
          <p className="body-l" style={{ marginTop: 28, maxWidth: "44ch", margin: "28px auto 0", fontSize: 17 }}>
            Creative commissions are scoped slowly and answered personally. Tell me about the picture and I'll reply within 48 hours.
          </p>
          <div style={{ marginTop: 40 }}>
            <button onClick={() => openInquiryFor("Creative")} className="btn btn--solid btn--lg">
              Begin a conversation <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <Lightbox
        images={allImages}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onNav={(d) => setLbIndex((i) => (i + d + allImages.length) % allImages.length)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVICE PAGE — Elopements / Portraits / Branding
// Short intro + curated projects + small FAQ + inquiry
// ─────────────────────────────────────────────────────────────
const SERVICE_INTROS = {
  elopements: {
    title: "Elopements,",
    italic: "intimate by design.",
    blurb: "Micro-weddings and elopements across the Tweed Valley, Byron Shire and Gold Coast hinterland — photographed quietly, edited gently, delivered without rush.",
    intro: "Most elopements I shoot run four to eight hours. I bring two cameras, a small kit, and a long-standing relationship with every venue I work at. You bring your people, your vows, and your day. No formal posing, no shouting, no shot list pinned to the back of my hand.",
    practice: [
      ["Coverage",   "Four to eight hours, single photographer."],
      ["Locations",  "Murwillumbah · Byron · Gold Coast hinterland."],
      ["Delivery",   "Sneak peeks in seven days. Full gallery in six weeks via Pic-Time, print release included."],
      ["Booking",    "Twenty-five percent holding fee, balance two weeks prior. Studio Ninja paperwork."],
    ],
    faqs: [0, 1, 2, 4, 5, 7],
  },
  portraits: {
    title: "Portraits,",
    italic: "for the in-between years.",
    blurb: "Family, maternity, lifestyle and in-home sessions in the soft hour before sunset. Sixty to ninety minutes that pass like fifteen.",
    intro: "Portrait sessions are about connection, not poses. I direct gently — a hand here, a step there — but most of the work is making space for your family to be the family it already is. Kids on the floor, dogs underfoot, a half-eaten bowl of watermelon.",
    practice: [
      ["Format",      "Family · Maternity · Lifestyle · In-home."],
      ["Coverage",    "Sixty to ninety minutes, single photographer."],
      ["Delivery",    "Sneak peeks in seven days. Full gallery in four weeks via Pic-Time, print release included."],
      ["Add-ons",     "Heirloom albums and fine-art prints through the gallery."],
    ],
    faqs: [0, 2, 3, 4],
  },
  branding: {
    title: "Branding,",
    italic: "for people who actually make things.",
    blurb: "Editorial headshots and lifestyle business imagery for small business owners, creators and entrepreneurs across the Northern Rivers.",
    intro: "Branding sessions are designed for people whose face is the front door of their business. We start with a planning call to map your needs against your visual identity. Then we shoot for half a day and I deliver a library you can pull from for the next twelve months.",
    practice: [
      ["Format",      "Half-day shoot, up to three locations."],
      ["Strategy",    "Forty-five minute planning call before the shoot."],
      ["Delivery",    "Eighty to 150 images, organised by category in Pic-Time."],
      ["Licensing",   "Full commercial usage rights included."],
    ],
    faqs: [0, 2, 3],
  },
};

function ServicePage({ slug, go, openInquiry, openInquiryFor }) {
  if (slug === "creative") return <CreativePage go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />;

  const s = SERVICES.find((x) => x.id === slug);
  const data = SERVICE_INTROS[slug];
  const projects = PROJECTS[slug] || [];
  const allImages = projects.flatMap((p) => p.images);
  const [lbIndex, setLbIndex] = React.useState(null);

  const offsets = projects.reduce((acc, p, i) => {
    acc[i] = i === 0 ? 0 : acc[i - 1] + projects[i - 1].images.length;
    return acc;
  }, {});

  return (
    <div>
      {/* HERO */}
      <section style={{ paddingTop: 88, paddingBottom: 80 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>{s.n} &nbsp;·&nbsp; {s.label.toUpperCase()}</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(64px, 8.5vw, 144px)", lineHeight: 1, letterSpacing: "-0.01em", margin: 0, color: "var(--fg)", maxWidth: "14ch" }}>
            {data.title} <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>{data.italic}</em>
          </h1>
          <p className="body-l" style={{ marginTop: 36, maxWidth: "58ch", fontSize: 19, color: "var(--fg-soft)" }}>
            {data.blurb}
          </p>
        </div>
      </section>

      {/* Hero image — full-bleed */}
      <div className="bleed" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", height: "78vh", minHeight: 560, overflow: "hidden" }}>
        <img src={img(projects[0]?.cover || s.image, 2400)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Intro + practice list */}
      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 96 }}>
            <div>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>APPROACH</div>
              <p className="body-l" style={{ margin: 0, fontSize: 19, maxWidth: "32ch" }}>{data.intro}</p>
            </div>
            <div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--rule)" }}>
                {data.practice.map(([k, v]) => (
                  <li key={k} style={{ display: "grid", gridTemplateColumns: "200px 1fr 240px", gap: 32, padding: "24px 0", borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
                    <span className="tiny" style={{ color: "var(--fg-mute)" }}>{k.toUpperCase()}</span>
                    <span className="serif" style={{ fontSize: 20, fontWeight: 400, color: "var(--fg)", gridColumn: "span 2" }}>{v}</span>
                  </li>
                ))}
                <li style={{ display: "grid", gridTemplateColumns: "200px 1fr 240px", gap: 32, padding: "24px 0", borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
                  <span className="tiny" style={{ color: "var(--fg-mute)" }}>PRICING</span>
                  <span className="serif" style={{ fontSize: 20, fontWeight: 400, color: "var(--fg)" }}>{s.price}</span>
                  <button onClick={() => openInquiryFor(s.label)} className="link-cta" style={{ justifySelf: "end", fontSize: 10.5 }}>
                    Enquire <span className="arrow">→</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED PROJECTS */}
      <section className="section--alt" style={{ padding: "60px 0" }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <SectionHead
            marker="SELECTED PROJECTS"
            title="A handful of"
            italic={`recent ${s.label.toLowerCase()} sessions.`}
            blurb="Browse projects, not endless thumbnails. Click any frame for full size."
          />
        </div>
      </section>

      {projects.map((p, i) => (
        <section
          key={p.slug}
          style={{
            padding: "100px 0",
            background: i % 2 === 0 ? "var(--bg)" : "var(--beige-soft)",
            borderTop: "1px solid var(--rule-soft)",
          }}
        >
          <div className="container--wide" style={{ padding: "0 56px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, marginBottom: 56, alignItems: "end" }}>
              <div>
                <div className="tiny" style={{ color: "var(--accent)", marginBottom: 14 }}>PROJECT 0{i + 1} &nbsp;·&nbsp; {p.year}</div>
                <p className="caption" style={{ margin: 0 }}>{p.meta}</p>
              </div>
              <div>
                <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>{p.title}</em>
                </h3>
                <p className="body-l" style={{ marginTop: 20, maxWidth: "52ch", fontSize: 16 }}>{p.blurb}</p>
              </div>
            </div>
            <ProjectGallery images={p.images} openLightbox={(idx) => setLbIndex(idx)} offset={offsets[i]} />
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <SectionHead marker="QUESTIONS" title="Answered" italic="honestly." />
          <FaqAccordion items={data.faqs.map((i) => FAQS[i])} />
        </div>
      </section>

      {/* Quiet closing */}
      <section className="section section--alt">
        <div className="container--narrow" style={{ textAlign: "center" }}>
          <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0 }}>
            Tell me about <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>your day.</em>
          </h3>
          <div style={{ marginTop: 40 }}>
            <button onClick={() => openInquiryFor(s.label)} className="btn btn--solid btn--lg">Enquire <span className="arrow">→</span></button>
          </div>
        </div>
      </section>

      <Lightbox
        images={allImages}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onNav={(d) => setLbIndex((i) => (i + d + allImages.length) % allImages.length)}
      />
    </div>
  );
}

Object.assign(window, { ServicePage, CreativePage, SERVICE_INTROS });
