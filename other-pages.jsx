// other-pages.jsx — About, Pricing, Contact, Blog, FAQ, SEO landing, Portal

// ─────────────────────────────────────────────────────────────
// ABOUT — short. Portrait + 2 paragraphs + practice list. That's it.
// ─────────────────────────────────────────────────────────────
function AboutPage({ go, openInquiry }) {
  return (
    <div>
      <section style={{ paddingTop: 88, paddingBottom: 0 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>ABOUT — KATRINA</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(56px, 7.5vw, 120px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)", maxWidth: "14ch" }}>
            Freshly 50, <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>still soft on the shutter.</em>
          </h1>
        </div>
      </section>

      <section style={{ padding: "80px 0 120px" }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 96, alignItems: "start" }}>
            <div className="plate plate--portrait">
              <img src={img("katrina", 1200)} alt="Katrina Cram" />
            </div>
            <div style={{ paddingTop: 12 }}>
              <p className="body-l" style={{ margin: 0, fontSize: 20, lineHeight: 1.7 }}>
                I'm a part-time photographer based in Murwillumbah, the northern New South Wales town tucked just under the Queensland border at the foot of Mt Warning. I photograph elopements, portraits, branding, and a small line of conceptual creative work.
              </p>
              <p className="body-l" style={{ marginTop: 24, fontSize: 18, color: "var(--fg-soft)", lineHeight: 1.7 }}>
                Freshly 50, mum of three, married thirty years, building a motorhome bus with my husband. Five grandchildren on the floor when I'm not photographing other people's. Coffee, pad thai, lollies, bourbon with Netflix. I've been doing this for over a decade and I have nothing left to prove — only better pictures to make for the people who hire me.
              </p>

              {/* Practice — small, honest list */}
              <div style={{ marginTop: 56, borderTop: "1px solid var(--rule)", paddingTop: 32 }}>
                <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>PRACTICE</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    ["Based in",   "Murwillumbah, NSW — Bundjalung Country"],
                    ["Working in", "Tweed Valley · Byron Shire · Gold Coast hinterland"],
                    ["Working since", "2014 — roughly forty sessions a year"],
                    ["Approach",   "Quiet. Unhurried. Gently directed."],
                  ].map(([k, v]) => (
                    <li key={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 32, alignItems: "baseline" }}>
                      <span className="tiny" style={{ color: "var(--fg-mute)" }}>{k.toUpperCase()}</span>
                      <span className="serif" style={{ fontSize: 18, fontWeight: 400, color: "var(--fg)" }}>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="body-l" style={{ marginTop: 56, fontSize: 17, fontStyle: "italic", fontFamily: "var(--serif)", color: "var(--fg-soft)", maxWidth: "44ch" }}>
                On my creative practice, which is the heart of what I make — <button onClick={() => go("creative")} className="link-cta" style={{ fontSize: 11, marginLeft: 6 }}>read here <span className="arrow">→</span></button>
              </p>

              <div style={{ marginTop: 48 }}>
                <button onClick={openInquiry} className="btn btn--solid">
                  Begin a conversation <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRICING — list of services with floors
// ─────────────────────────────────────────────────────────────
function PricingPage({ go, openInquiry, openInquiryFor }) {
  return (
    <div>
      <section style={{ paddingTop: 88, paddingBottom: 64 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>PRICING</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(56px, 7.5vw, 120px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
            Starting points <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>for the work.</em>
          </h1>
          <p className="body-l" style={{ marginTop: 36, fontSize: 19, color: "var(--fg-soft)", maxWidth: "52ch" }}>
            Final quotes are custom — built around your day, your locations and your people. These are honest starting points so you can plan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ borderTop: "1px solid var(--rule)" }}>
            {SERVICES.map((s) => (
              <article key={s.id} style={{ borderBottom: "1px solid var(--rule)", padding: "48px 0", display: "grid", gridTemplateColumns: "80px 1.4fr 1.4fr 1fr", gap: 56, alignItems: "start" }}>
                <div className="tiny" style={{ color: "var(--accent)", paddingTop: 14 }}>{s.n}</div>

                <div>
                  <h2 className="serif" style={{ fontWeight: 300, fontSize: 48, lineHeight: 1, letterSpacing: "-0.005em", margin: 0, color: "var(--fg)" }}>
                    {s.label}
                  </h2>
                  <p className="serif" style={{ fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "var(--fg-soft)", margin: "10px 0 0" }}>
                    {s.tag}
                  </p>
                </div>

                <div>
                  <p className="body" style={{ margin: 0, fontSize: 15 }}>{s.blurb}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 8 }}>FROM</div>
                  <div className="serif" style={{ fontWeight: 300, fontSize: 44, lineHeight: 1, letterSpacing: "-0.005em", color: "var(--fg)" }}>
                    {s.price}
                  </div>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                    <button onClick={() => go(s.id)} className="link-cta" style={{ fontSize: 10.5 }}>See the page <span className="arrow">→</span></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container--narrow" style={{ textAlign: "center" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 28 }}>ACROSS EVERY BOOKING</div>
          <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0 }}>
            The same care, regardless <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>of the size of the day.</em>
          </h2>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56, textAlign: "left", borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
            {[
              ["Pic-Time delivery",   "Private galleries with a print release. Order prints, albums and fine art through the gallery, or use the files anywhere."],
              ["Full backup",         "Two cameras, three lenses, two flashes, dual memory cards on every shot. Insured. Nothing depends on a single piece of equipment."],
              ["Studio Ninja",        "Contracts, quotes, invoices and questionnaires through one client portal. No chasing PDFs or hunting email threads."],
            ].map(([t, b]) => (
              <div key={t}>
                <h4 className="serif" style={{ fontWeight: 400, fontSize: 22, lineHeight: 1.15, margin: 0 }}>{t}</h4>
                <p className="body" style={{ marginTop: 14, fontSize: 14 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: "center" }}>
        <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, margin: 0 }}>
          Ready to <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>talk?</em>
        </h3>
        <div style={{ marginTop: 32 }}>
          <button onClick={openInquiry} className="btn btn--solid btn--lg">Begin a conversation <span className="arrow">→</span></button>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────
function ContactPage({ go, openInquiry }) {
  return (
    <div>
      <section style={{ paddingTop: 88, paddingBottom: 64 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>CONTACT</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(56px, 7.5vw, 120px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0 }}>
            Let's <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>talk.</em>
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 96 }}>
            {/* Left rail */}
            <aside>
              <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 28 }}>DIRECT</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 28 }}>
                <li>
                  <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 6 }}>EMAIL</div>
                  <a className="serif" style={{ fontSize: 22, fontWeight: 400, color: "var(--fg)" }} href="mailto:hello@katrinacram.com.au">hello@katrinacram.com.au</a>
                </li>
                <li>
                  <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 6 }}>PHONE</div>
                  <a className="serif" style={{ fontSize: 22, fontWeight: 400, color: "var(--fg)" }} href="tel:+61400000000">+61 400 000 000</a>
                </li>
                <li>
                  <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 6 }}>INSTAGRAM</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <a className="serif" style={{ fontSize: 20, fontWeight: 400, color: "var(--fg)" }} href="#">@bohoelope</a>
                    <a className="serif" style={{ fontSize: 20, fontWeight: 400, color: "var(--fg)" }} href="#">@photographerkat_fantasy</a>
                  </div>
                </li>
                <li>
                  <div className="tiny" style={{ color: "var(--fg-mute)", marginBottom: 6 }}>STUDIO</div>
                  <p className="serif" style={{ fontSize: 20, fontWeight: 400, color: "var(--fg)", margin: 0 }}>
                    Murwillumbah, NSW<br />
                    <span style={{ color: "var(--fg-soft)", fontSize: 17 }}>By appointment only</span>
                  </p>
                </li>
              </ul>

              {/* Map */}
              <div style={{ marginTop: 56, position: "relative", aspectRatio: "4/3", background: "var(--beige-soft)", overflow: "hidden", border: "1px solid var(--rule)" }}>
                <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
                  <rect width="400" height="300" fill="#EFE9E3" />
                  <path d="M0 180 Q 100 170 180 175 T 400 165" stroke="#C9C2B7" strokeWidth="0.75" fill="none" />
                  <path d="M0 210 Q 80 200 200 205 T 400 200" stroke="#C9C2B7" strokeWidth="0.75" fill="none" />
                  <path d="M0 240 Q 100 235 220 238 T 400 232" stroke="#C9C2B7" strokeWidth="0.75" fill="none" />
                  <path d="M120 0 Q 140 80 130 200" stroke="#C9C2B7" strokeWidth="0.75" fill="none" />
                  <path d="M260 0 Q 240 100 270 250" stroke="#C9C2B7" strokeWidth="0.75" fill="none" />
                  <circle cx="195" cy="155" r="6" fill="#6E735D" />
                  <circle cx="195" cy="155" r="14" fill="none" stroke="#6E735D" strokeWidth="1" />
                  <text x="210" y="158" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#3A3A37" letterSpacing="1">MURWILLUMBAH</text>
                  <text x="210" y="170" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#7E7E78" letterSpacing="1">28°20'S 153°23'E</text>
                </svg>
              </div>
            </aside>

            {/* Right — form */}
            <ContactFormFull />
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="section section--alt">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <SectionHead marker="WHAT HAPPENS NEXT" title="Three quiet steps." italic="" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56, borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
            {[
              ["01", "You submit", "The form lands in my inbox. No automated reply, no waiting list — just me."],
              ["02", "I reply",     "Within 48 hours, usually much sooner. I'll tell you honestly if I'm the right fit."],
              ["03", "We scope",    "A custom quote via Studio Ninja. A 25% holding fee secures the date."],
            ].map(([n, t, b]) => (
              <div key={n}>
                <div className="tiny" style={{ color: "var(--accent)", marginBottom: 18 }}>{n}</div>
                <h4 className="serif" style={{ fontWeight: 400, fontSize: 26, lineHeight: 1.1, margin: 0 }}>{t}</h4>
                <p className="body" style={{ marginTop: 14 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactFormFull() {
  const [sent, setSent] = React.useState(false);
  const [data, setData] = React.useState({ type: "Creative commission", name: "", email: "", phone: "", date: "", location: "", message: "" });
  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));

  if (sent) {
    return (
      <div style={{ padding: 64, background: "var(--beige-soft)", textAlign: "center", border: "1px solid var(--rule)" }}>
        <div className="marker" style={{ color: "var(--accent)", marginBottom: 20 }}>ENQUIRY RECEIVED</div>
        <h3 className="serif" style={{ fontWeight: 300, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.005em", margin: 0 }}>
          Thank you, <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>{data.name.split(" ")[0] || "friend"}.</em>
        </h3>
        <p className="body-l" style={{ marginTop: 20, maxWidth: "44ch", margin: "20px auto 0", fontSize: 16 }}>
          Your note has landed. I'll reply within 48 hours — usually much sooner.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      style={{ background: "var(--beige-soft)", padding: 48, border: "1px solid var(--rule)" }}
    >
      <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>THE FORM</div>
      <h3 className="serif" style={{ fontWeight: 300, fontSize: 36, lineHeight: 1, letterSpacing: "-0.005em", margin: 0 }}>
        Begin <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>here.</em>
      </h3>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Your name" full>
          <input value={data.name} onChange={(e) => upd("name", e.target.value)} required style={inputStyle()} />
        </FormField>
        <FormField label="Email">
          <input type="email" required value={data.email} onChange={(e) => upd("email", e.target.value)} style={inputStyle()} />
        </FormField>
        <FormField label="Phone (optional)">
          <input type="tel" value={data.phone} onChange={(e) => upd("phone", e.target.value)} style={inputStyle()} />
        </FormField>
        <FormField label="Type of session">
          <select value={data.type} onChange={(e) => upd("type", e.target.value)} style={inputStyle()}>
            {SHOOT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Date (or rough month)">
          <input type="date" value={data.date} onChange={(e) => upd("date", e.target.value)} style={inputStyle()} />
        </FormField>
        <FormField label="Location" full>
          <input value={data.location} onChange={(e) => upd("location", e.target.value)} placeholder="e.g. Cabarita Headland, our backyard, somewhere in the hinterland" style={inputStyle()} />
        </FormField>
        <FormField label="Tell me about your day" full>
          <textarea rows={5} value={data.message} required onChange={(e) => upd("message", e.target.value)} placeholder="Who, what, when, why this matters. Anything is helpful." style={{ ...inputStyle(), resize: "vertical", fontFamily: "var(--sans)" }} />
        </FormField>
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--rule-soft)" }}>
        <span className="tiny" style={{ color: "var(--fg-mute)" }}>A personal reply within 48 hours.</span>
        <button type="submit" className="btn btn--solid btn--lg">Send enquiry <span className="arrow">→</span></button>
      </div>
    </form>
  );
}

function FormField({ label, children, full }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8, gridColumn: full ? "span 2" : "auto" }}>
      <span className="tiny" style={{ color: "var(--fg-mute)" }}>{label}</span>
      {children}
    </label>
  );
}
function inputStyle() {
  return {
    width: "100%", padding: "12px 14px", fontSize: 14, fontFamily: "var(--sans)",
    background: "var(--cream)", color: "var(--fg)",
    border: "1px solid var(--rule)", borderRadius: 0, outline: "none",
    transition: "border-color 150ms ease",
  };
}

// ─────────────────────────────────────────────────────────────
// BLOG — with category filter chips
// ─────────────────────────────────────────────────────────────
function BlogPage({ go }) {
  const [cat, setCat] = React.useState("All");
  const filtered = cat === "All" ? JOURNAL : JOURNAL.filter((j) => j.cat === cat);

  return (
    <div>
      <section style={{ paddingTop: 88, paddingBottom: 64 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>BLOG</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(56px, 7.5vw, 120px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0 }}>
            Notes from <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>the field.</em>
          </h1>
        </div>
      </section>

      {/* Filter chips */}
      <section style={{ paddingBottom: 56, borderBottom: "1px solid var(--rule)" }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {JOURNAL_CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: "9px 18px",
                  fontFamily: "var(--sans)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: cat === c ? "var(--cream)" : "var(--fg)",
                  background: cat === c ? "var(--accent)" : "transparent",
                  border: "1px solid " + (cat === c ? "var(--accent)" : "var(--rule)"),
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "background-color 150ms ease, color 150ms ease, border-color 150ms ease",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured (first match) */}
      <section className="section">
        <div className="container--wide" style={{ padding: "0 56px" }}>
          {filtered.length === 0 ? (
            <p className="body-l" style={{ textAlign: "center", color: "var(--fg-mute)" }}>
              No posts in this category yet.
            </p>
          ) : (
            <>
              {filtered.slice(0, 1).map((j, i) => (
                <article key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, marginBottom: 96, alignItems: "center", cursor: "pointer" }}>
                  <div className="plate" style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    <img src={img(j.image, 1800)} alt="" />
                  </div>
                  <div>
                    <div className="tiny" style={{ color: "var(--accent)", marginBottom: 20 }}>FEATURED &nbsp;·&nbsp; {j.cat.toUpperCase()}</div>
                    <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.005em", margin: 0 }}>{j.title}</h2>
                    <p className="body-l" style={{ marginTop: 24, fontSize: 17 }}>{j.excerpt}</p>
                    <div style={{ marginTop: 28, display: "flex", gap: 24, alignItems: "center" }}>
                      <span className="tiny">{j.date.toUpperCase()}</span>
                      <span className="tiny">·</span>
                      <span className="tiny">{j.read.toUpperCase()}</span>
                      <a href="#" className="link-cta" style={{ marginLeft: "auto", fontSize: 10.5 }}>Read essay <span className="arrow">→</span></a>
                    </div>
                  </div>
                </article>
              ))}

              {/* Grid of the rest */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48 }}>
                {filtered.slice(1).map((j, i) => (
                  <article key={i} style={{ cursor: "pointer" }}>
                    <div className="plate" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/5", marginBottom: 22, overflow: "hidden" }}>
                      <img src={img(j.image, 900)} alt="" />
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 12 }}>
                      <span className="tiny" style={{ color: "var(--accent)" }}>{j.cat.toUpperCase()}</span>
                      <span className="tiny">·</span>
                      <span className="tiny">{j.read.toUpperCase()}</span>
                    </div>
                    <h3 className="serif" style={{ fontWeight: 400, fontSize: 22, lineHeight: 1.2, margin: 0 }}>{j.title}</h3>
                    <p className="body" style={{ marginTop: 12, fontSize: 14 }}>{j.excerpt}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
function FaqPage({ go, openInquiry }) {
  return (
    <div>
      <section style={{ paddingTop: 88, paddingBottom: 80 }}>
        <div className="container--wide" style={{ padding: "0 56px" }}>
          <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 36 }}>FAQ</div>
          <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(56px, 7.5vw, 120px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0 }}>
            Questions, <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>answered honestly.</em>
          </h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <FaqAccordion items={FAQS} startOpen={0} />
        </div>
      </section>
      <section className="section section--alt">
        <div className="container--narrow" style={{ textAlign: "center" }}>
          <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, margin: 0 }}>
            Still have <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>a question?</em>
          </h3>
          <div style={{ marginTop: 32 }}>
            <button onClick={openInquiry} className="btn btn--solid">Ask me directly <span className="arrow">→</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SEO LANDING — Murwillumbah Wedding Photographer (elopement-led)
// ─────────────────────────────────────────────────────────────
function SeoPage({ go, openInquiry }) {
  return (
    <div>
      <PageHero
        marker="NORTHERN RIVERS — LANDING"
        title="Murwillumbah"
        italic="wedding photographer."
        blurb="A local wedding & elopement photographer based at the foot of Mt Warning. Photographing across the Tweed Valley and Northern Rivers since 2014."
        image="hinterland"
      />

      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 88, alignItems: "start" }}>
          <aside style={{ position: "sticky", top: 140 }}>
            <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 24 }}>ON THIS PAGE</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
              {[
                "About the region",
                "Wedding venues I love",
                "When to elope here",
                "Real Tweed Valley weddings",
                "Frequently asked",
              ].map((s, i) => (
                <li key={s}>
                  <a href="#" className="serif" style={{ fontSize: 17, fontWeight: 400, color: "var(--fg-soft)" }}>
                    <span className="tiny" style={{ color: "var(--accent)", marginRight: 14 }}>0{i + 1}</span>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
          <div>
            <h2 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.005em", margin: 0 }}>
              The Tweed Valley is the kind of country <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>that rewards a slow camera.</em>
            </h2>
            <p className="body-l" style={{ marginTop: 32, fontSize: 18 }}>
              Murwillumbah sits at the foot of Mt Warning, in the caldera of an ancient volcano. The light here is unlike anywhere else I've photographed — long, soft mornings; tall afternoon shadows; the green of the hinterland after rain.
            </p>
            <p className="body" style={{ marginTop: 24 }}>
              I've been photographing weddings and elopements across the Tweed Valley, Byron Shire and Gold Coast hinterland since 2014. Most of my work happens within an hour of home, which means I know the venues, the back roads, and the half-hour windows when the light at each location is at its best.
            </p>

            <div style={{ marginTop: 56, marginBottom: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="plate" style={{ aspectRatio: "4/5" }}><img src={img("hinterland", 1100)} alt="" /></div>
              <div className="plate" style={{ aspectRatio: "4/5" }}><img src={img("ceremony", 1100)} alt="" /></div>
            </div>

            <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.1, margin: 0 }}>
              Wedding venues I love.
            </h3>
            <ul style={{ marginTop: 24, padding: 0, listStyle: "none", borderTop: "1px solid var(--rule)" }}>
              {[
                ["Tweed Coast Estate", "A working farm with a chapel under fig trees. Best for golden-hour ceremonies."],
                ["Osteria Casuarina", "An Italian-style restaurant with a long verandah. Best for small weddings of 40 or fewer."],
                ["Mt Warning lookout", "A bushwalk and a sunrise. Best for two-person elopements with a celebrant."],
                ["Cabarita Headland", "Ocean on three sides. Best for sunrise vows and barefoot ceremonies."],
                ["The Channon Tavern", "An hour west, deep in the rainforest. Best for long-table receptions that go all night."],
              ].map(([t, b], i) => (
                <li key={t} style={{ padding: "22px 0", borderBottom: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "32px 1fr 2fr", gap: 24, alignItems: "baseline" }}>
                  <span className="tiny" style={{ color: "var(--accent)" }}>0{i + 1}</span>
                  <span className="serif" style={{ fontSize: 19, fontWeight: 400, fontStyle: "italic" }}>{t}</span>
                  <span className="body" style={{ margin: 0, fontSize: 14 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container--narrow" style={{ textAlign: "center" }}>
          <h3 className="serif" style={{ fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.1, margin: 0 }}>
            Marrying in <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>the Tweed?</em>
          </h3>
          <p className="body-l" style={{ marginTop: 24, maxWidth: "44ch", margin: "24px auto 0" }}>Tell me about your day — I'd love to hear it.</p>
          <div style={{ marginTop: 36 }}>
            <button onClick={openInquiry} className="btn btn--solid btn--lg">Enquire <span className="arrow">→</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT PORTAL — placeholder (Path A: links out to Studio Ninja)
// ─────────────────────────────────────────────────────────────
function PortalPage({ go }) {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 180 }}>
      <div className="container--narrow" style={{ textAlign: "center" }}>
        <div className="marker" style={{ color: "var(--fg-mute)", marginBottom: 28 }}>CLIENT PORTAL</div>
        <h1 className="serif" style={{ fontWeight: 300, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1, letterSpacing: "-0.005em", margin: 0 }}>
          Welcome back.
        </h1>
        <p className="body-l" style={{ marginTop: 28, maxWidth: "44ch", margin: "28px auto 0", fontSize: 18 }}>
          Existing clients access quotes, contracts, questionnaires and invoices through my Studio Ninja portal. Galleries are delivered separately through Pic-Time.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="#" className="btn btn--solid">Open Studio Ninja portal <span className="arrow">→</span></a>
          <a href="#" className="btn">Open Pic-Time gallery <span className="arrow">→</span></a>
        </div>
        <p className="small" style={{ marginTop: 40, color: "var(--fg-mute)", fontSize: 13 }}>
          Lost your link? Email <a style={{ color: "var(--accent)", borderBottom: "1px solid currentColor" }} href="mailto:hello@katrinacram.com.au">hello@katrinacram.com.au</a> and I'll resend it.
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { AboutPage, PricingPage, ContactPage, BlogPage, FaqPage, SeoPage, PortalPage });
