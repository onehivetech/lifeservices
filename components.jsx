// components.jsx — header (utility bar + primary), footer, building blocks
// v2: no motion, opaque header always, light type, muted palette

const NAV_PRIMARY = [
  { id: "creative",   label: "Creative" },
  { id: "elopements", label: "Elopements" },
  { id: "portraits",  label: "Portraits" },
  { id: "branding",   label: "Branding" },
  { id: "about",      label: "About" },
  { id: "contact",    label: "Contact" },
];

const NAV_UTILITY = [
  { id: "blog",        label: "Blog" },
  { id: "portal",      label: "Client portal" },
];

// ─────────────────────────────────────────────────────────────
// Logo — Katrina's actual mark
// ─────────────────────────────────────────────────────────────
function Logo({ go, height = 40 }) {
  return (
    <button
      onClick={() => go("home")}
      style={{ display: "inline-flex", alignItems: "center", height }}
      aria-label="Katrina Cram Photography — Home"
    >
      <img
        src="assets/katrina-cram-logo.png"
        alt="Katrina Cram Photography"
        style={{ height: "100%", width: "auto", display: "block" }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Header — utility bar + primary nav. Opaque, static, no motion.
// ─────────────────────────────────────────────────────────────
function Header({ page, go, openInquiry }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        width: "100%",
        background: "var(--bg)",
        borderBottom: "1px solid var(--rule-soft)",
      }}
    >
      {/* utility bar */}
      <div
        style={{
          borderBottom: "1px solid var(--rule-soft)",
          background: "var(--beige-soft)",
        }}
      >
        <div
          className="container--wide"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 56px",
            color: "var(--fg-mute)",
          }}
        >
          <span className="tiny" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
            MURWILLUMBAH, NSW &nbsp;·&nbsp; WORKING SINCE 2014
          </span>
          <nav style={{ display: "flex", gap: 28 }}>
            {NAV_UTILITY.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="tiny"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: page === n.id ? "var(--accent)" : "var(--fg-mute)",
                  transition: "color 150ms ease",
                }}
              >
                {n.label.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* primary bar */}
      <div
        className="container--wide"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 56px",
        }}
      >
        <Logo go={go} />
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {NAV_PRIMARY.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: page === n.id ? 500 : 400,
                letterSpacing: "0.02em",
                color: page === n.id ? "var(--accent)" : "var(--fg)",
                paddingBottom: 4,
                borderBottom: "1px solid " + (page === n.id ? "var(--accent)" : "transparent"),
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              {n.label}
            </button>
          ))}
          <button onClick={openInquiry} className="btn" style={{ padding: "11px 18px", fontSize: 10.5 }}>
            Enquire <span className="arrow">→</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer — quiet, no big CTA
// ─────────────────────────────────────────────────────────────
function Footer({ go }) {
  return (
    <footer
      style={{
        background: "var(--beige-soft)",
        color: "var(--fg)",
        padding: "96px 0 36px",
        borderTop: "1px solid var(--rule-soft)",
      }}
    >
      <div className="container--wide" style={{ padding: "0 56px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 64,
            paddingBottom: 64,
          }}
        >
          {/* col 1 */}
          <div>
            <Logo go={go} height={48} />
            <p className="body" style={{ marginTop: 24, maxWidth: "30ch", fontSize: 14 }}>
              A creative portrait artist photographing in the Tweed Valley — Bundjalung Country, NSW.
            </p>
          </div>

          {/* col 2 — work */}
          <div>
            <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 18 }}>Work</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["creative", "elopements", "portraits", "branding"].map((id) => {
                const item = NAV_PRIMARY.find((n) => n.id === id);
                return (
                  <li key={id}>
                    <button onClick={() => go(id)} className="serif" style={{ fontSize: 17, fontWeight: 400, color: "var(--fg)" }}>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* col 3 — studio */}
          <div>
            <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 18 }}>Studio</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li><button onClick={() => go("about")}   className="serif" style={{ fontSize: 17, color: "var(--fg)" }}>About</button></li>
              <li><button onClick={() => go("blog")}    className="serif" style={{ fontSize: 17, color: "var(--fg)" }}>Blog</button></li>
              <li><button onClick={() => go("faq")}     className="serif" style={{ fontSize: 17, color: "var(--fg)" }}>FAQs</button></li>
              <li><button onClick={() => go("pricing")} className="serif" style={{ fontSize: 17, color: "var(--fg)" }}>Pricing</button></li>
              <li><button onClick={() => go("portal")}  className="serif" style={{ fontSize: 17, color: "var(--fg)" }}>Client portal</button></li>
            </ul>
          </div>

          {/* col 4 — contact */}
          <div>
            <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 18 }}>Contact</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li><a href="mailto:hello@katrinacram.com.au" className="sans" style={{ fontSize: 14, color: "var(--fg)" }}>hello@katrinacram.com.au</a></li>
              <li><a href="tel:+61400000000" className="sans" style={{ fontSize: 14, color: "var(--fg)" }}>+61 400 000 000</a></li>
              <li style={{ marginTop: 8 }}><a href="#" className="tiny" style={{ color: "var(--accent)" }}>INSTAGRAM @BOHOELOPE</a></li>
              <li><a href="#" className="tiny" style={{ color: "var(--accent)" }}>INSTAGRAM @PHOTOGRAPHERKAT_FANTASY</a></li>
            </ul>
          </div>
        </div>

        <hr className="rule rule--soft" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "32px 0 0", gap: 64 }}>
          <p className="small" style={{ maxWidth: 560, lineHeight: 1.6, margin: 0, fontSize: 12.5 }}>
            {COPY.ackCountry}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#" className="tiny">Privacy</a>
            <a href="#" className="tiny">Terms</a>
            <span className="tiny">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// PageHero — used by service / pricing / contact / SEO pages
// ─────────────────────────────────────────────────────────────
function PageHero({ marker, title, italic, blurb, image }) {
  return (
    <section style={{ paddingTop: 88, paddingBottom: 80 }}>
      <div className="container--wide" style={{ padding: "0 56px" }}>
        {marker && <div className="marker" style={{ marginBottom: 36, color: "var(--fg-mute)" }}>{marker}</div>}
        <h1
          className="serif"
          style={{
            fontWeight: 300,
            fontSize: "clamp(64px, 8.5vw, 128px)",
            lineHeight: 1,
            letterSpacing: "-0.01em",
            margin: 0,
            color: "var(--fg)",
            maxWidth: "16ch",
          }}
        >
          {title}
          {italic && (
            <>
              {" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>{italic}</em>
            </>
          )}
        </h1>
        {blurb && (
          <p className="body-l" style={{ marginTop: 32, maxWidth: "54ch", fontSize: 19, color: "var(--fg-soft)" }}>
            {blurb}
          </p>
        )}
      </div>
      {image && (
        <div className="bleed" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", height: "70vh", minHeight: 540, overflow: "hidden", marginTop: 72 }}>
          <img src={img(image, 2400)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Lightbox — keyboard nav, no animation beyond fade
// ─────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNav }) {
  React.useEffect(() => {
    if (index == null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  if (index == null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(28, 28, 26, 0.96)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <button aria-label="Close" onClick={onClose}
        style={{ position: "absolute", top: 24, right: 28, color: "var(--cream)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>
        Close ✕
      </button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", color: "var(--cream)", fontSize: 28, fontFamily: "var(--serif)" }}>
        ←
      </button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); onNav(1); }}
        style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", color: "var(--cream)", fontSize: 28, fontFamily: "var(--serif)" }}>
        →
      </button>
      <img
        src={img(images[index], 2200)}
        alt=""
        style={{ maxWidth: "85vw", maxHeight: "85vh", objectFit: "contain" }}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="mono" style={{ position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center", color: "var(--cream)", fontSize: 11, letterSpacing: "0.22em", opacity: 0.7 }}>
        {String(index + 1).padStart(2, "0")}  /  {String(images.length).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Project gallery — used by curated project sections
// asymmetric editorial grid, click → lightbox, NO hover scale
// ─────────────────────────────────────────────────────────────
function ProjectGallery({ images, openLightbox, offset = 0 }) {
  // tiled 12-col editorial layout
  const pattern = [
    { span: 8, aspect: "4/3" },
    { span: 4, aspect: "3/4" },
    { span: 4, aspect: "3/4" },
    { span: 8, aspect: "3/2" },
    { span: 6, aspect: "1/1" },
    { span: 6, aspect: "1/1" },
    { span: 5, aspect: "4/5" },
    { span: 7, aspect: "4/3" },
    { span: 12, aspect: "16/7" },
  ];
  return (
    <div className="editorial-grid" style={{ rowGap: 32 }}>
      {images.map((key, i) => {
        const p = pattern[i % pattern.length];
        return (
          <button
            key={i}
            onClick={() => openLightbox(i + offset)}
            style={{
              gridColumn: `span ${p.span}`,
              aspectRatio: p.aspect,
              overflow: "hidden",
              background: "var(--bg-deep)",
              padding: 0,
              border: 0,
              cursor: "zoom-in",
              display: "block",
            }}
          >
            <img
              src={img(key, 1400)}
              alt=""
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ accordion — no transform, just height
// ─────────────────────────────────────────────────────────────
function FaqAccordion({ items, startOpen = 0 }) {
  const [open, setOpen] = React.useState(startOpen);
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--rule)" }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={i} style={{ borderBottom: "1px solid var(--rule)" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 28px",
                gap: 28,
                alignItems: "center",
                width: "100%",
                padding: "28px 0",
                textAlign: "left",
                transition: "color 150ms ease",
              }}
            >
              <span className="marker" style={{ color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="serif" style={{ fontSize: 22, fontWeight: 400, color: "var(--fg)", letterSpacing: "0" }}>
                {it.q}
              </span>
              <span className="serif" style={{ fontSize: 22, fontWeight: 300, color: "var(--accent)" }}>
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen && (
              <div style={{ paddingLeft: 76, paddingRight: 80, paddingBottom: 32 }}>
                <p className="body-l" style={{ margin: 0, maxWidth: "64ch", fontSize: 16 }}>{it.a}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────
// Testimonial block — quiet, sentence case, no shouting
// ─────────────────────────────────────────────────────────────
function TestimonialBlock({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
      {items.map((t, i) => (
        <figure key={i} style={{ margin: 0 }}>
          <blockquote
            className="serif"
            style={{
              fontStyle: "italic",
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.5,
              margin: 0,
              color: "var(--fg)",
              maxWidth: "32ch",
            }}
          >
            “{t.quote}”
          </blockquote>
          <figcaption className="tiny" style={{ marginTop: 24, color: "var(--fg-mute)" }}>
            <span style={{ color: "var(--accent)" }}>—</span>&nbsp;&nbsp;{t.name} · {t.detail}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────
function SectionHead({ marker, title, italic, blurb, align = "split" }) {
  if (align === "center") {
    return (
      <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 80px" }}>
        {marker && <div className="marker" style={{ marginBottom: 24, color: "var(--fg-mute)" }}>{marker}</div>}
        <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
          {title} {italic && <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>{italic}</em>}
        </h2>
        {blurb && <p className="body-l" style={{ marginTop: 28, color: "var(--fg-soft)" }}>{blurb}</p>}
      </div>
    );
  }
  return (
    <div className="section-head">
      <div>
        {marker && <div className="marker" style={{ color: "var(--fg-mute)" }}>{marker}</div>}
      </div>
      <div>
        <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
          {title} {italic && <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>{italic}</em>}
        </h2>
        {blurb && <p className="body-l" style={{ marginTop: 24, maxWidth: "54ch" }}>{blurb}</p>}
      </div>
    </div>
  );
}

Object.assign(window, {
  Header, Footer, Logo, PageHero, Lightbox, ProjectGallery,
  FaqAccordion, TestimonialBlock, SectionHead,
  NAV_PRIMARY, NAV_UTILITY,
});
