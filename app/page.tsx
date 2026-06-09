"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

function useTyping(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else { setCharIdx(c => c + 1); }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else { setCharIdx(c => c - 1); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const DEMOS: Record<string, { lines: string[]; color: string }> = {
  outreach: {
    color: "#6ee7b7",
    lines: ["Input: Jake Tokley, TikTok ads, Colchester...", "Generating personalised pitch...", "────────────────────────────", "Hey Jake, fellow Colchester person here.", "Saw your post about the TikTok ad work.", "I build scripts + briefs with AI —", "might save you a few hours a week.", "Worth a quick chat?"],
  },
  latepayment: {
    color: "#f59e0b",
    lines: ["Input: Invoice #1042, £3,200, 47 days overdue...", "Tone: Firm Notice selected...", "────────────────────────────", "Subject: Second Notice — Invoice #1042 — £3,200", "", "This invoice remains unpaid despite our earlier", "reminder. Under the Late Payment of Commercial", "Debts (Interest) Act 1998, statutory interest", "at 8% above base rate may now apply.", "", "Please settle within 7 days."],
  },
  compliance: {
    color: "#a78bfa",
    lines: ["Input: https://example-estate-agent.co.uk...", "Running 36 checks across 6 categories...", "────────────────────────────", "✗ Cookie consent banner missing (PECR)", "✗ ICO registration number not found", "✓ HTTPS / SSL", "✓ Privacy policy present", "Score: 62/100 · 3 critical issues"],
  },
};

function ToolDemo({ toolKey }: { toolKey: string }) {
  const demo = DEMOS[toolKey];
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const run = () => {
    if (running) return;
    setRunning(true); setLines([]);
    demo.lines.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (i === demo.lines.length - 1) setRunning(false);
      }, i * 180);
    });
  };

  return (
    <div style={{ background: "#0d0d0d", border: `1px solid ${lines.length ? demo.color + "40" : "var(--border)"}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.3s" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: "6px" }}>
        {["#ff5f56", "#ffbd2e", "#27c93f"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
      </div>
      <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "0.78rem", minHeight: "168px", color: "var(--muted)" }}>
        {lines.length === 0 && !running && <span style={{ color: "var(--faint)" }}>Click &apos;Run demo&apos; to see it in action</span>}
        {lines.map((line, i) => (
          <div key={i} style={{ color: i < 2 ? "#555" : line.startsWith("──") ? "var(--border-2)" : demo.color, marginBottom: "2px", animation: "fadeIn 0.2s ease" }}>
            {line || " "}
          </div>
        ))}
        {running && <span style={{ color: demo.color }}>▋</span>}
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <button onClick={run} disabled={running} style={{ background: running ? "var(--surface-2)" : demo.color, color: running ? "var(--muted)" : "#000", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "0.8rem", fontWeight: 600, cursor: running ? "default" : "pointer", transition: "all 0.2s" }}>
          {running ? "Running..." : lines.length ? "Run again" : "Run demo"}
        </button>
      </div>
    </div>
  );
}

const TOOLS = [
  { key: "outreach", href: "/tools/outreach-agent", title: "Outreach Agent", tag: "Sales", desc: "Search any UK company and get a personalised cold email generated from live Companies House data." },
  { key: "latepayment", href: "https://latepayment.ishsitotombe.co.uk", title: "Late Payment Chaser", tag: "Legal", desc: "Generate professional debt chasing letters citing UK statutory rights under the Late Payment of Commercial Debts (Interest) Act 1998. Three escalating tones: polite, firm, final." },
  { key: "compliance", href: "https://compliance.ishsitotombe.co.uk", title: "Compliance Checker", tag: "Legal", desc: "36-check UK compliance audit — GDPR, PECR, consumer law. Results in under a minute." },
];

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", business: "", problem: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://formspree.io/f/YOUR_FORM_ID", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: "2rem", marginBottom: "12px" }}>✓</div>
      <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Got it — I&apos;ll reply within 24 hours.</h3>
      <p style={{ color: "var(--muted)" }}>Check your inbox.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = { width: "100%", padding: "13px 16px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none" };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "520px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <input required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <input required placeholder="Business name" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} style={inputStyle} />
      </div>
      <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
      <textarea required rows={4} placeholder="What's the one task that eats the most of your time each week?" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
      <button type="submit" style={{ background: "var(--accent)", color: "#000", fontWeight: 700, border: "none", borderRadius: "8px", padding: "14px", fontSize: "1rem", cursor: "pointer" }}>
        Send it over
      </button>
      <p style={{ fontSize: "0.8rem", color: "var(--faint)", textAlign: "center" }}>No spam. Just a reply from me.</p>
    </form>
  );
}

export default function Home() {
  const typed = useTyping(["lead follow-ups.", "late payment chasing.", "customer onboarding."]);
  const [email, setEmail] = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [activeDemo, setActiveDemo] = useState("outreach");

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://formspree.io/f/YOUR_FORM_ID", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "hero" }) });
    setHeroSubmitted(true);
  };

  const sectionStyle: React.CSSProperties = { maxWidth: "900px", margin: "0 auto", padding: "80px 24px" };
  const labelStyle: React.CSSProperties = { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: "36px", display: "block" };
  const divider = { borderTop: "1px solid var(--border)" } as React.CSSProperties;

  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "inline-block", background: "var(--accent-dim)", border: "1px solid rgba(110,231,183,0.2)", color: "var(--accent)", fontSize: "0.75rem", padding: "5px 14px", borderRadius: "100px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "28px" }}>
            Automation · AI · Colchester, UK
          </div>
          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "20px" }}>
            Stop doing<br />
            <span style={{ color: "var(--accent)" }}>{typed || " "}</span>
            <span style={{ borderRight: "3px solid var(--accent)", animation: "blink 1s step-end infinite" }} /><br />
            manually.
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: "520px", marginBottom: "40px", lineHeight: 1.7 }}>
            I build custom AI automations that take the repetitive parts of running your business off your plate — so you can focus on the work that actually makes you money.
          </p>
          {heroSubmitted ? (
            <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "1rem" }}>✓ I&apos;ll be in touch within 24 hours.</p>
          ) : (
            <form onSubmit={handleHeroSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", maxWidth: "440px" }}>
              <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, minWidth: "200px", padding: "13px 16px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none" }} />
              <button type="submit" style={{ background: "var(--accent)", color: "#000", fontWeight: 700, border: "none", borderRadius: "8px", padding: "13px 22px", fontSize: "0.95rem", cursor: "pointer" }}>
                Let&apos;s talk
              </button>
            </form>
          )}
          <p style={{ marginTop: "12px", fontSize: "0.8rem", color: "var(--faint)" }}>Or scroll down to try the tools — no sign-up needed.</p>
        </div>
      </section>

      {/* TOOLS */}
      <div style={divider} />
      <section id="tools" style={sectionStyle}>
        <FadeIn>
          <span style={labelStyle}>What I build</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px" }}>Live demos — try them now</h2>
          <p style={{ color: "var(--muted)", marginBottom: "44px", maxWidth: "480px" }}>These are boilerplate versions. Every tool is customised to fit your business, branding, and workflow.</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
            {TOOLS.map(t => (
              <button key={t.key} onClick={() => setActiveDemo(t.key)} style={{ padding: "8px 18px", borderRadius: "100px", border: "1px solid", borderColor: activeDemo === t.key ? "var(--accent)" : "var(--border-2)", background: activeDemo === t.key ? "var(--accent-dim)" : "transparent", color: activeDemo === t.key ? "var(--accent)" : "var(--muted)", fontSize: "0.875rem", fontWeight: activeDemo === t.key ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                {t.title}
              </button>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "center" }}>
            <ToolDemo key={activeDemo} toolKey={activeDemo} />
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {(() => {
                const t = TOOLS.find(t => t.key === activeDemo)!;
                return <>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{t.tag}</div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "10px" }}>{t.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{t.desc}</p>
                  </div>
                  <Link href={t.href} style={{ display: "inline-block", background: "var(--accent)", color: "#000", fontWeight: 700, padding: "11px 22px", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", width: "fit-content" }}>
                    Try the full tool →
                  </Link>
                  <p style={{ fontSize: "0.8rem", color: "var(--faint)" }}>
                    Want this for your business? <Link href="/#contact" style={{ color: "var(--accent)", textDecoration: "none" }}>Get in touch</Link>
                  </p>
                </>;
              })()}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "40px" }}>
            {TOOLS.map(t => (
              <Link key={t.key} href={t.href} style={{ display: "block", padding: "18px", background: "var(--surface)", border: `1px solid ${activeDemo === t.key ? "var(--accent)" : "var(--border)"}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{t.tag}</div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px", color: "var(--text)" }}>{t.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>{t.desc}</div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* PROJECT */}
      <div style={divider} />
      <section id="projects" style={sectionStyle}>
        <FadeIn>
          <span style={labelStyle}>Open source</span>
          <a href="https://github.com/reverendish/mcp-x-mac-seed" target="_blank" rel="noopener" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ padding: "32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Swift · macOS · AI Agent</div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>MCP-x-Mac</h3>
                </div>
                <span style={{ fontSize: "1.2rem", color: "var(--faint)" }}>↗</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "20px" }}>A self-evolving MCP server that gives AI agents control of any macOS app — including ones with no API. Discovers its own capabilities, writes its own tools, and self-heals when apps update. 71 tools across 50+ apps. 80 tests.</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Self-healing", "71 tools", "50+ apps", "MIT open source"].map(tag => (
                  <span key={tag} style={{ fontSize: "0.75rem", padding: "4px 10px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "100px", color: "var(--muted)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </a>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <div style={divider} />
      <section style={sectionStyle}>
        <FadeIn>
          <span style={labelStyle}>How it works</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              { n: "01", title: "Tell me what's eating your time", body: "Fill in the form. I'll reply within 24 hours with a quick call to understand the problem." },
              { n: "02", title: "I build the automation", body: "Most small automations take a few days. I use AI to build fast, which keeps the cost low." },
              { n: "03", title: "You get your time back", body: "The system runs in the background. Pay once — no monthly fees unless it makes sense." },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={i * 100}>
                <div style={{ padding: "32px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--faint)", fontWeight: 600, marginBottom: "14px" }}>{step.n}</div>
                  <h3 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "8px" }}>{step.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* CONTACT */}
      <div style={divider} />
      <section id="contact" style={{ ...sectionStyle, paddingBottom: "120px" }}>
        <FadeIn>
          <span style={{ ...labelStyle, textAlign: "center", display: "block" }}>Get in touch</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "8px" }}>What&apos;s slowing you down?</h2>
          <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: "48px" }}>Takes 2 minutes. I&apos;ll reply within 24 hours.</p>
          <ContactForm />
        </FadeIn>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center", color: "var(--faint)", fontSize: "0.85rem" }}>
        © 2026 Ish Sitotombe · Colchester, UK
      </footer>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}
