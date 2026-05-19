// inquiry.jsx — multi-step inquiry modal
// Step 1: shoot type
// Step 2: date + location
// Step 3: details (name/email/phone/message)
// Step 4: confirmation

function InquiryModal({ open, onClose, presetType }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    type: presetType || "",
    date: "",
    notSure: false,
    location: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setStep(0);
      setData((d) => ({ ...d, type: presetType || d.type || "" }));
      setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, presetType]);

  if (!open) return null;

  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const validate = (s) => {
    const e = {};
    if (s === 0 && !data.type) e.type = "Tell me what kind of session.";
    if (s === 1) {
      if (!data.notSure && !data.date) e.date = "Pick a date, or tick 'not sure yet'.";
      if (!data.location.trim()) e.location = "Even a rough idea helps.";
    }
    if (s === 2) {
      if (!data.name.trim()) e.name = "I'd love to know your name.";
      if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "A working email, please.";
      if (!data.message.trim() || data.message.trim().length < 20) e.message = "Tell me a little more — 20 characters at least.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const submit = () => { if (validate(2)) setStep(3); };

  return (
    <div className="scrim" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(960px, 100%)",
          margin: "auto",
          flex: "0 0 auto",
          background: "var(--bg)",
          color: "var(--fg)",
          boxShadow: "0 50px 120px rgba(0,0,0,0.4)",
          animation: "panel-in 320ms cubic-bezier(.2,.7,.3,1) both",
        }}
      >
        {/* close button */}
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 24,
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--fg-mute)", zIndex: 2,
          }}
        >
          Close ✕
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr" }}>
          {/* Left rail — image + steps */}
          <aside
            style={{
              position: "relative",
              background: "var(--fg)",
              color: "var(--cream)",
              padding: "44px 40px",
              overflow: "hidden",
              minHeight: 480,
            }}
          >
            <img
              src={img("weddingHands", 1200)}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: step < 3 ? 0.42 : 0.7, transition: "opacity 150ms ease" }}
            />
            <div style={{ position: "relative" }}>
              <div className="marker" style={{ color: "var(--accent)", marginBottom: 22 }}>
                ✦ &nbsp;ENQUIRE
              </div>
              <h2 className="serif" style={{ fontWeight: 300, fontSize: 44, lineHeight: 0.98, letterSpacing: "-0.015em", margin: 0, color: "var(--cream)" }}>
                Let's begin
                <br />
                <em style={{ fontStyle: "italic", color: "var(--accent)" }}>with a few details.</em>
              </h2>
              <p className="body" style={{ marginTop: 18, color: "rgba(245,239,230,0.78)", maxWidth: "32ch", fontSize: 13.5 }}>
                Every inquiry receives a personal reply within 48 hours. No automated reply, no waiting list — just me.
              </p>
            </div>

            {/* steps progress */}
            <ol style={{ position: "relative", listStyle: "none", margin: "36px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {["Type of session", "Date & location", "Your details", "Confirmation"].map((label, i) => {
                const state = i === step ? "active" : i < step ? "done" : "todo";
                return (
                  <li key={label} style={{ display: "flex", alignItems: "center", gap: 16, opacity: state === "todo" ? 0.55 : 1 }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        width: 28, height: 28,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%",
                        border: "1px solid currentColor",
                        background: state === "done" ? "var(--accent)" : "transparent",
                        color: state === "done" ? "var(--fg)" : "var(--cream)",
                        flexShrink: 0,
                      }}
                    >
                      {state === "done" ? "✓" : `0${i + 1}`}
                    </span>
                    <span className="tiny" style={{ color: "var(--cream)", fontSize: 12 }}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Right pane — form steps */}
          <section style={{ padding: "44px 48px 44px", position: "relative", display: "flex", flexDirection: "column" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-mute)", marginBottom: 22 }}>
              STEP {String(step + 1).padStart(2, "0")} &nbsp;/&nbsp; 04
            </div>

            {step === 0 && (
              <StepWrap title="What kind of session?" sub="A starting point — we can refine the rest in conversation.">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SHOOT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { upd("type", t); setErrors({}); }}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "14px 18px",
                        border: "1px solid " + (data.type === t ? "var(--accent-deep)" : "var(--rule)"),
                        background: data.type === t ? "var(--beige-deep)" : "transparent",
                        textAlign: "left",
                        transition: "all 200ms ease",
                      }}
                    >
                      <span className="serif" style={{ fontSize: 19, fontWeight: 300, fontStyle: data.type === t ? "italic" : "normal" }}>{t}</span>
                      <span className="mono" style={{ fontSize: 12, color: data.type === t ? "var(--accent-deep)" : "var(--fg-mute)" }}>
                        {data.type === t ? "●" : "○"}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.type && <ErrorMsg>{errors.type}</ErrorMsg>}
              </StepWrap>
            )}

            {step === 1 && (
              <StepWrap title="When and where?" sub="Approximate is fine — we'll pin it down together.">
                <Field label="Shoot date" error={errors.date}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => upd("date", e.target.value)}
                      disabled={data.notSure}
                      style={inputStyle(data.notSure)}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-soft)" }}>
                      <input
                        type="checkbox"
                        checked={data.notSure}
                        onChange={(e) => upd("notSure", e.target.checked)}
                        style={{ accentColor: "var(--accent-deep)" }}
                      />
                      Not sure yet
                    </label>
                  </div>
                </Field>
                <Field label="Location" error={errors.location}>
                  <input
                    type="text"
                    value={data.location}
                    placeholder="e.g. Mt Warning lookout, our backyard, somewhere in Byron"
                    onChange={(e) => upd("location", e.target.value)}
                    style={inputStyle(false)}
                  />
                </Field>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap title="A little about you." sub="The more you can share, the more useful my reply.">
                <Field label="Your name" error={errors.name}>
                  <input value={data.name} onChange={(e) => upd("name", e.target.value)} style={inputStyle(false)} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Email" error={errors.email}>
                    <input type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} style={inputStyle(false)} />
                  </Field>
                  <Field label="Phone (optional)">
                    <input type="tel" value={data.phone} onChange={(e) => upd("phone", e.target.value)} style={inputStyle(false)} />
                  </Field>
                </div>
                <Field label="Tell me about your day" error={errors.message}>
                  <textarea
                    rows={4}
                    value={data.message}
                    placeholder="Who, what, when, why this matters. Anything is helpful."
                    onChange={(e) => upd("message", e.target.value)}
                    style={{ ...inputStyle(false), resize: "vertical", minHeight: 96, fontFamily: "var(--sans)" }}
                  />
                </Field>
              </StepWrap>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minHeight: 380 }}>
                <div className="marker" style={{ color: "var(--accent-deep)", marginBottom: 24 }}>
                  ✦ &nbsp;INQUIRY RECEIVED
                </div>
                <h3 className="serif" style={{ fontWeight: 300, fontSize: 56, lineHeight: 0.96, letterSpacing: "-0.015em", margin: 0 }}>
                  Thank you,
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--accent-deep)" }}>{(data.name || "friend").split(" ")[0]}.</em>
                </h3>
                <p className="body-l" style={{ marginTop: 28, maxWidth: "42ch" }}>
                  Your note has landed in my inbox. I read every one personally and you'll have a reply within 48 hours — usually much sooner.
                </p>
                <ul style={{ margin: "36px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--rule)", paddingTop: 28 }}>
                  <li className="small"><span className="marker" style={{ marginRight: 12 }}>01</span>I'll reply within 48 hours.</li>
                  <li className="small"><span className="marker" style={{ marginRight: 12 }}>02</span>If we're a fit, a custom quote follows via Studio Ninja.</li>
                  <li className="small"><span className="marker" style={{ marginRight: 12 }}>03</span>A 25% holding fee secures your date.</li>
                </ul>
                <button onClick={onClose} className="btn btn--solid" style={{ marginTop: 40, alignSelf: "flex-start" }}>
                  Back to the site <span className="arrow">→</span>
                </button>
              </div>
            )}

            {/* footer nav */}
            {step < 3 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--rule-soft)" }}>
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="link-cta"
                  style={{ opacity: step === 0 ? 0.3 : 1, borderBottom: "1px solid transparent" }}
                >
                  ← Back
                </button>
                <button
                  onClick={step === 2 ? submit : next}
                  className="btn btn--solid"
                >
                  {step === 2 ? "Send enquiry" : "Continue"} <span className="arrow">→</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StepWrap({ title, sub, children }) {
  return (
    <div style={{ flex: 1 }}>
      <h3 className="serif" style={{ fontWeight: 300, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0 }}>
        {title}
      </h3>
      {sub && <p className="body" style={{ marginTop: 10, marginBottom: 22, fontSize: 14 }}>{sub}</p>}
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="tiny" style={{ display: "block", marginBottom: 6, color: "var(--fg-mute)" }}>{label}</label>
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <p className="small" style={{ margin: "6px 0 0", color: "var(--accent-deep)", fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 14 }}>
      — {children}
    </p>
  );
}

function inputStyle(disabled) {
  return {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "var(--sans)",
    background: disabled ? "var(--bg-deep)" : "var(--cream)",
    color: "var(--fg)",
    border: "1px solid var(--rule)",
    borderRadius: 0,
    outline: "none",
    transition: "border-color 200ms ease",
  };
}

Object.assign(window, { InquiryModal });
