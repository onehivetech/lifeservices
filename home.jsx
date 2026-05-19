// home.jsx — 7 sections, Creative-led, static, spacious

function HomePage({ go, openInquiry }) {
  const [lbIndex, setLbIndex] = React.useState(null);
  const creativeImages = ["creative1", "creative3", "creative4", "creative2", "creative5", "creative8"];

  return (
    <div>
      {/* ═════════════════════════════════════════════════
          1. HERO — one image, type below
          ═════════════════════════════════════════════════ */}
      <section className="bleed" style={{ paddingTop: 24 }}>
        <div className="bleed" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", height: "calc(100vh - 180px)", minHeight: 640, maxHeight: 900, overflow: "hidden" }}>
          <img src={img("creative3", 2400)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </section>

      <section style={{ padding: "96px 0 120px" }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 88, alignItems: "end" }}>
            <h1
              className="serif"
              style={{
                fontWeight: 300,
                fontSize: "clamp(48px, 6vw, 88px)",
                lineHeight: 1.08,
                letterSpacing: "-0.005em",
                margin: 0,
                color: "var(--fg)",
                maxWidth: "18ch",
              }}
            >
              A <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>creative portrait artist</em> photographing in the Tweed Valley.
            </h1>
            <div style={{ paddingBottom: 14 }}>
              <p className="body-l" style={{ margin: 0, color: "var(--fg-soft)", fontSize: 18, maxWidth: "30ch" }}>
                Creative portraiture, elopements, portraits and a small line of branding work.
              </p>
              <button onClick={openInquiry} className="btn btn--solid" style={{ marginTop: 32 }}>
                Begin a conversation <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          2. CREATIVE WORK FEATURE
          ═════════════════════════════════════════════════ */}
      <section className="section--alt" style={{ padding: "120px 0" }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 88, marginBottom: 80, alignItems: "end" }}>
            <div>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>SECTION 01 — CREATIVE</div>
            </div>
            <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1.08, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)", maxWidth: "20ch" }}>
              Pictures made slowly, <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>one idea at a time.</em>
            </h2>
          </div>

          {/* asymmetric magazine layout */}
          <div className="editorial-grid" style={{ rowGap: 32 }}>
            <button onClick={() => setLbIndex(0)} style={{ gridColumn: "span 7", aspectRatio: "4/3", padding: 0, border: 0, overflow: "hidden", cursor: "zoom-in" }}>
              <img src={img("creative1", 1600)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
            <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8px" }}>
              <div className="tiny" style={{ color: "var(--accent)", marginBottom: 16 }}>OPHELIA, TWEED RIVER — 2025</div>
              <p className="serif" style={{ fontSize: 24, fontWeight: 300, fontStyle: "italic", lineHeight: 1.4, color: "var(--fg)", margin: 0, maxWidth: "26ch" }}>
                A series of one. A single afternoon on the Tweed, a borrowed antique dress, a model with two hours of patience.
              </p>
            </div>
            <button onClick={() => setLbIndex(1)} style={{ gridColumn: "span 4", aspectRatio: "3/4", padding: 0, border: 0, overflow: "hidden", cursor: "zoom-in" }}>
              <img src={img("creative3", 1200)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
            <button onClick={() => setLbIndex(2)} style={{ gridColumn: "span 8", aspectRatio: "16/10", padding: 0, border: 0, overflow: "hidden", cursor: "zoom-in" }}>
              <img src={img("creative4", 1800)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
            <button onClick={() => setLbIndex(3)} style={{ gridColumn: "span 6", aspectRatio: "3/2", padding: 0, border: 0, overflow: "hidden", cursor: "zoom-in" }}>
              <img src={img("creative2", 1400)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
            <button onClick={() => setLbIndex(4)} style={{ gridColumn: "span 6", aspectRatio: "3/2", padding: 0, border: 0, overflow: "hidden", cursor: "zoom-in" }}>
              <img src={img("creative5", 1400)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
            <button onClick={() => go("creative")} className="link-cta">
              Enter the creative portfolio <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          3. SERVICES — uneven 4-up
          ═════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 88, marginBottom: 72, alignItems: "end" }}>
            <div>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>SECTION 02 — WORK</div>
            </div>
            <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1.08, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
              Four ways <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>to work together.</em>
            </h2>
          </div>

          {/* uneven grid: Creative spans 6, Elopements + Portraits span 3 each, Branding span 12 (quiet horizontal) */}
          <div className="editorial-grid" style={{ rowGap: 56 }}>
            {/* Creative — primary, large */}
            <ServiceCard service={SERVICES[0]} go={go} span={6} aspect="4/5" size="lg" />
            {/* Elopements + Portraits — equal mid */}
            <ServiceCard service={SERVICES[1]} go={go} span={3} aspect="3/4" size="md" />
            <ServiceCard service={SERVICES[2]} go={go} span={3} aspect="3/4" size="md" />
            {/* Branding — quiet, full-width landscape */}
            <ServiceCard service={SERVICES[3]} go={go} span={12} aspect="21/8" size="quiet" />
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          4. ABOUT TEASER — short
          ═════════════════════════════════════════════════ */}
      <section className="section section--alt">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 96, alignItems: "center" }}>
            <div className="plate plate--portrait" style={{ maxWidth: 520 }}>
              <img src={img("katrina", 1100)} alt="Katrina Cram" />
            </div>
            <div style={{ paddingRight: 16 }}>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 28 }}>SECTION 03 — KATRINA</div>
              <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
                Freshly 50, <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>still soft on the shutter.</em>
              </h2>
              <p className="body-l" style={{ marginTop: 32, fontSize: 17 }}>
                I'm a Murwillumbah-based photographer working part-time across the Tweed, Byron Shire and Gold Coast hinterland. Mum of three, married thirty years, building a motorhome bus with my husband when I'm not behind a camera.
              </p>
              <p className="body" style={{ marginTop: 18, fontSize: 15 }}>
                Coffee, pad thai, lollies, bourbon with Netflix. I've been doing this for over a decade and I have nothing left to prove — only better pictures to make for the people who hire me.
              </p>
              <button onClick={() => go("about")} className="link-cta" style={{ marginTop: 36 }}>
                More about me <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          5. BLOG PREVIEW
          ═════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 88, marginBottom: 64, alignItems: "end" }}>
            <div>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>SECTION 04 — JOURNAL</div>
            </div>
            <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0 }}>
              Recent <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>writing.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            {JOURNAL.slice(0, 3).map((j, i) => (
              <article key={i} onClick={() => go("blog")} style={{ cursor: "pointer" }}>
                <div className="plate" style={{ aspectRatio: "4/5", marginBottom: 24, overflow: "hidden" }}>
                  <img src={img(j.image, 900)} alt="" />
                </div>
                <div className="tiny" style={{ color: "var(--accent)", marginBottom: 14 }}>{j.cat.toUpperCase()} &nbsp;·&nbsp; {j.read.toUpperCase()}</div>
                <h3 className="serif" style={{ fontWeight: 400, fontSize: 24, lineHeight: 1.25, margin: 0, color: "var(--fg)" }}>
                  {j.title}
                </h3>
                <p className="body" style={{ marginTop: 14 }}>{j.excerpt}</p>
              </article>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 72 }}>
            <button onClick={() => go("blog")} className="link-cta">All writing <span className="arrow">→</span></button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          6. TESTIMONIALS — quiet
          ═════════════════════════════════════════════════ */}
      <section className="section section--alt">
        <div className="container--narrow">
          <SectionHead
            marker="SECTION 05 — KIND WORDS"
            title="From the people"
            italic="who said yes."
            align="center"
          />
          <TestimonialBlock items={TESTIMONIALS.slice(0, 3)} />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════
          7. CLOSING — full-bleed, minimal overlay
          ═════════════════════════════════════════════════ */}
      <section className="bleed" style={{ position: "relative", width: "100vw", marginLeft: "calc(50% - 50vw)", height: "82vh", minHeight: 600, overflow: "hidden", color: "var(--cream)" }}>
        <img src={img("creative5", 2400)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(28,28,26,0.25) 0%, rgba(28,28,26,0.15) 50%, rgba(28,28,26,0.55) 100%)" }} />
        <div className="container--wide" style={{ position: "absolute", inset: 0, padding: "0 56px", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 96 }}>
          <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(72px, 9vw, 160px)", lineHeight: 1, letterSpacing: "-0.01em", margin: 0, color: "var(--cream)", maxWidth: "12ch" }}>
            Let's <em style={{ fontStyle: "italic", fontWeight: 400 }}>begin.</em>
          </h2>
          <div style={{ marginTop: 48 }}>
            <button onClick={openInquiry} className="btn btn--lg" style={{ background: "var(--cream)", color: "var(--fg)", borderColor: "var(--cream)" }}>
              Enquire <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <Lightbox
        images={creativeImages}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onNav={(d) => setLbIndex((i) => (i + d + creativeImages.length) % creativeImages.length)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ServiceCard — varied weights (lg / md / quiet) for the 4-up
// ─────────────────────────────────────────────────────────────
function ServiceCard({ service, go, span, aspect, size }) {
  const isQuiet = size === "quiet";
  const isLg = size === "lg";

  if (isQuiet) {
    // horizontal landscape card — quietest
    return (
      <button
        onClick={() => go(service.id)}
        style={{
          gridColumn: `span ${span}`,
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 56,
          padding: 0,
          border: 0,
          textAlign: "left",
          background: "transparent",
          cursor: "pointer",
          alignItems: "center",
          paddingTop: 24,
          borderTop: "1px solid var(--rule)",
        }}
      >
        <div style={{ aspectRatio: aspect, overflow: "hidden" }}>
          <img src={img(service.image, 1800)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ paddingRight: 8 }}>
          <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 16 }}>{service.n} &nbsp;·&nbsp; {service.price.toUpperCase()}</div>
          <h3 className="serif" style={{ fontWeight: 300, fontSize: 36, lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
            {service.label}
          </h3>
          <p className="body" style={{ marginTop: 12, fontSize: 14 }}>{service.blurb}</p>
          <span className="link-cta" style={{ marginTop: 20, fontSize: 10.5 }}>
            See more <span className="arrow">→</span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => go(service.id)}
      style={{
        gridColumn: `span ${span}`,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        padding: 0,
        border: 0,
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <div style={{ aspectRatio: aspect, marginBottom: 24, overflow: "hidden", width: "100%" }}>
        <img src={img(service.image, isLg ? 1600 : 900)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="tiny" style={{ color: "var(--accent)" }}>{service.n}</span>
        <span className="tiny" style={{ color: "var(--fg-mute)" }}>{service.price}</span>
      </div>
      <h3 className="serif" style={{ fontWeight: 300, fontSize: isLg ? 56 : 36, lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
        {service.label}
      </h3>
      <p className="body" style={{ marginTop: isLg ? 16 : 12, fontSize: isLg ? 16 : 14, maxWidth: "32ch" }}>
        {service.blurb}
      </p>
      <span className="link-cta" style={{ marginTop: 22, alignSelf: "flex-start", fontSize: 10.5 }}>
        See more <span className="arrow">→</span>
      </span>
    </button>
  );
}

Object.assign(window, { HomePage, ServiceCard });
