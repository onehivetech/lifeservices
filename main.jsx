// main.jsx — routing, tweaks. v2: no scroll behavior, no transparent header.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "type": "lora-manrope",
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState("home");
  const [inquiryOpen, setInquiryOpen] = React.useState(false);
  const [inquiryPreset, setInquiryPreset] = React.useState("");

  const go = React.useCallback((id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const openInquiry = React.useCallback(() => {
    setInquiryPreset("");
    setInquiryOpen(true);
  }, []);

  const openInquiryFor = React.useCallback((label) => {
    const map = {
      "Creative": "Creative commission",
      "Elopements": "Elopement",
      "Portraits": "Portrait session",
      "Branding": "Branding",
    };
    setInquiryPreset(map[label] || label);
    setInquiryOpen(true);
  }, []);

  // Apply type/density via data-attrs on <html>
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-type", t.type);
    root.setAttribute("data-density", t.density);
  }, [t.type, t.density]);

  let body;
  switch (page) {
    case "home":       body = <HomePage go={go} openInquiry={openInquiry} />; break;
    case "creative":   body = <CreativePage go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />; break;
    case "elopements": body = <ServicePage slug="elopements" go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />; break;
    case "portraits":  body = <ServicePage slug="portraits"  go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />; break;
    case "branding":   body = <ServicePage slug="branding"   go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />; break;
    case "about":      body = <AboutPage go={go} openInquiry={openInquiry} />; break;
    case "pricing":    body = <PricingPage go={go} openInquiry={openInquiry} openInquiryFor={openInquiryFor} />; break;
    case "contact":    body = <ContactPage go={go} openInquiry={openInquiry} />; break;
    case "blog":       body = <BlogPage go={go} />; break;
    case "faq":        body = <FaqPage go={go} openInquiry={openInquiry} />; break;
    case "seo":        body = <SeoPage go={go} openInquiry={openInquiry} />; break;
    case "portal":     body = <PortalPage go={go} />; break;
    default:           body = <HomePage go={go} openInquiry={openInquiry} />;
  }

  return (
    <div data-screen-label={`Katrina Cram — ${page}`}>
      <Header page={page} go={go} openInquiry={openInquiry} />
      <main>{body}</main>
      <Footer go={go} />
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} presetType={inquiryPreset} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Typography" />
        <TweakSelect
          label="Pairing"
          value={t.type}
          options={[
            { value: "lora-manrope",      label: "Lora + Manrope" },
            { value: "cormorant-manrope", label: "Cormorant + Manrope" },
            { value: "ebgaramond-inter",  label: "EB Garamond + Inter" },
          ]}
          onChange={(v) => setTweak("type", v)}
        />

        <TweakSection label="Spacing" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular", "airy"]}
          onChange={(v) => setTweak("density", v)}
        />

        <TweakSection label="Jump to page" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "0 12px 8px" }}>
          {["home", "creative", "elopements", "portraits", "branding", "about", "blog", "pricing", "contact", "faq", "seo", "portal"].map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                fontFamily: "ui-sans-serif, system-ui",
                fontSize: 11,
                letterSpacing: "0.04em",
                padding: "6px 10px",
                textAlign: "left",
                border: "1px solid " + (page === p ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"),
                background: page === p ? "rgba(0,0,0,0.06)" : "transparent",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
