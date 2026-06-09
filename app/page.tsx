'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';

function useTyping(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ClipReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        clipPath: visible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
        opacity: visible ? 1 : 0,
        transition: `clip-path 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 0.4s ease ${delay}ms`,
        willChange: 'clip-path',
      }}
    >
      {children}
    </div>
  );
}

const DEMOS: Record<string, {
  color: string;
  tabLabel: string;
  tag: string;
  title: string;
  desc: string;
  href: string;
  uiMockup: React.ReactNode;
  scriptLines: { text: string; dim?: boolean; accent?: boolean }[];
}> = {
  mcp: {
    color: '#a5b4fc',
    tabLabel: 'MCP-x-Mac',
    tag: 'Open Source · Swift · macOS',
    title: 'MCP-x-Mac',
    desc: 'A self-evolving MCP server that gives AI agents control of any macOS app — including ones with no API. Discovers its own capabilities, writes its own tools, and self-heals when apps update.',
    href: 'https://github.com/reverendish/mcp-x-mac-seed',
    uiMockup: null,
    scriptLines: [
      { text: '$ mcp-x-mac connect --app "Finder"', dim: true },
      { text: '→ Discovering app capabilities...', dim: true },
      { text: '→ Generated 12 new tools', accent: true },
      { text: '' },
      { text: 'Agent: open ~/Documents/invoices', dim: true },
      { text: '→ tool: finder_open_path', dim: true },
      { text: '✓ Opened Finder at ~/Documents/invoices', accent: true },
      { text: '' },
      { text: 'Agent: find all PDFs from last 30 days', dim: true },
      { text: '→ tool: finder_search_files', dim: true },
      { text: '✓ Found 14 matching files', accent: true },
      { text: '  invoice_apr.pdf  invoice_may.pdf  +12 more', dim: true },
    ],
  },
  outreach: {
    color: '#a5b4fc',
    tabLabel: 'Outreach Agent',
    tag: 'Sales · CRM',
    title: 'Outreach Agent',
    desc: 'Search any UK company via Companies House, enrich with officer data, and generate a personalised cold email in seconds. Includes a full CRM to track campaigns and contacts.',
    href: 'https://outreach.ishsitotombe.co.uk',
    uiMockup: null,
    scriptLines: [
      { text: '> Searching: "Moonpig Group PLC"', dim: true },
      { text: '→ Found: Moonpig Group PLC · 12345678', dim: true },
      { text: '→ Director: Nick Marsden (CEO)', accent: true },
      { text: '' },
      { text: '> Generating personalised email...', dim: true },
      { text: '────────────────────────────────', dim: true },
      { text: 'Subject: Automating card personalisation at Moonpig', accent: true },
      { text: '' },
      { text: 'Hi Nick,', },
      { text: 'Noticed Moonpig\'s been scaling personalisation —', },
      { text: 'I build AI workflows that handle the repetitive', },
      { text: 'parts of that at scale. Worth a quick call?', },
    ],
  },
  compliance: {
    color: '#a5b4fc',
    tabLabel: 'Compliance Checker',
    tag: 'Legal · GDPR · PECR',
    title: 'Compliance Checker',
    desc: 'Instant UK compliance audit — GDPR, PECR, Companies Act, WCAG, and up to 260 sector-specific checks. Identifies critical issues with citations and explanations in under a minute.',
    href: 'https://compliance.ishsitotombe.co.uk',
    uiMockup: null,
    scriptLines: [
      { text: '> https://example-estate-agent.co.uk', dim: true },
      { text: '→ Classifying sector: Estate Agents', accent: true },
      { text: '→ Running 48 checks...', dim: true },
      { text: '────────────────────────────────', dim: true },
      { text: '✗ Cookie consent banner missing (PECR)', accent: true },
      { text: '✗ ICO registration number not found', accent: true },
      { text: '✗ Property Ombudsman membership absent', accent: true },
      { text: '✓ HTTPS / SSL', dim: true },
      { text: '✓ Privacy policy present', dim: true },
      { text: '────────────────────────────────', dim: true },
      { text: 'Score: 58/100 · 3 critical · 5 medium', accent: true },
    ],
  },
};

const TOOLS = [
  { key: 'outreach',   href: 'https://outreach.ishsitotombe.co.uk' },
  { key: 'compliance', href: 'https://compliance.ishsitotombe.co.uk' },
];

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-2)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'var(--surface-2)',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '4px 12px',
          fontSize: '0.72rem',
          color: 'var(--muted)',
          fontFamily: 'var(--font-geist-mono)',
          letterSpacing: '0.02em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

function ScriptedOutput({ lines, color, running, started }: {
  lines: { text: string; dim?: boolean; accent?: boolean }[];
  color: string;
  running: boolean;
  started: boolean;
}) {
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    if (!running) return;
    setShownCount(0);
    lines.forEach((_, i) => {
      setTimeout(() => setShownCount(i + 1), i * 140);
    });
  }, [running, lines]);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'var(--font-geist-mono)',
      fontSize: '0.72rem',
      lineHeight: 1.7,
      minHeight: '220px',
      color: 'var(--muted)',
      minWidth: 0,
      overflow: 'hidden',
    }}>
      {!started && (
        <span style={{ color: 'var(--faint)' }}>Click 'Run demo' to see it in action</span>
      )}
      {lines.slice(0, shownCount).map((line, i) => (
        <div
          key={i}
          style={{
            color: line.accent ? color : line.dim ? 'var(--faint)' : 'var(--muted)',
            animation: 'slideUp 0.2s ease forwards',
            minHeight: '1.2em',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {line.text || ' '}
        </div>
      ))}
      {running && shownCount < lines.length && (
        <span style={{ color, animation: 'blink 1s step-end infinite' }}>▋</span>
      )}
    </div>
  );
}

function McpUIMockup() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'var(--font-geist-mono)' }}>
        Connected apps (71 tools)
      </div>
      {['Finder · 14 tools', 'Calendar · 8 tools', 'Mail · 11 tools', 'Safari · 9 tools'].map(app => (
        <div key={app} style={{
          padding: '8px 12px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: 'var(--text)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{app.split('·')[0].trim()}</span>
          <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{app.split('·')[1].trim()}</span>
        </div>
      ))}
      <div style={{
        marginTop: '4px',
        padding: '8px 12px',
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent)',
        borderRadius: '6px',
        fontSize: '0.72rem',
        color: 'var(--accent)',
        fontFamily: 'var(--font-geist-mono)',
      }}>
        ✓ Self-healing active · 80 tests passing
      </div>
    </div>
  );
}

function OutreachUIMockup() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        display: 'flex', gap: '8px',
        padding: '8px 12px',
        background: 'var(--bg)',
        border: '1px solid var(--border-2)',
        borderRadius: '6px',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flex: 1, fontFamily: 'var(--font-geist-mono)' }}>Moonpig Group PLC</span>
        <span style={{ fontSize: '0.7rem', background: 'var(--accent)', color: '#09090b', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Search</span>
      </div>
      {[
        { label: 'Company', value: 'Moonpig Group PLC' },
        { label: 'Number', value: '12345678' },
        { label: 'Status', value: 'Active' },
        { label: 'Director', value: 'Nick Marsden (CEO)' },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>{row.label}</span>
          <span style={{ color: 'var(--text)' }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function ComplianceUIMockup() {
  const checks = [
    { label: 'Cookie consent', pass: false },
    { label: 'HTTPS / SSL', pass: true },
    { label: 'Privacy policy', pass: true },
    { label: 'ICO number', pass: false },
    { label: 'Property Ombudsman', pass: false },
  ];
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>example-estate-agent.co.uk</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>58/100</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '8px' }}>
        <div style={{ width: '58%', height: '100%', background: 'var(--accent)', borderRadius: '2px' }} />
      </div>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.73rem' }}>
          <span style={{ color: c.pass ? '#86efac' : '#fca5a5', fontFamily: 'var(--font-geist-mono)', fontSize: '0.7rem' }}>
            {c.pass ? '✓' : '✗'}
          </span>
          <span style={{ color: c.pass ? 'var(--muted)' : 'var(--text)' }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', business: '', problem: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</div>
      <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Got it — I'll reply within 24 hours.</h3>
      <p style={{ color: 'var(--muted)' }}>Check your inbox.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = { width: '100%', padding: '13px 16px', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <input required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <input required placeholder="Business name" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} style={inputStyle} />
      </div>
      <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
      <textarea required rows={4} placeholder="What's the one task that eats the most of your time each week?" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      <button type="submit" style={{ background: 'var(--accent)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', cursor: 'pointer' }}>
        Send it over
      </button>
      <p style={{ fontSize: '0.8rem', color: 'var(--faint)', textAlign: 'center' }}>No spam. Just a reply from me.</p>
    </form>
  );
}

export default function Home() {
  const typed = useTyping(['lead follow-ups.', 'late payment chasing.', 'customer onboarding.']);
  const [email, setEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [activeDemo, setActiveDemo] = useState('outreach');
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);

  const runDemo = () => {
    if (demoRunning) return;
    setDemoStarted(true);
    setDemoRunning(true);
    const demo = DEMOS[activeDemo];
    setTimeout(() => setDemoRunning(false), demo.scriptLines.length * 140 + 200);
  };

  useEffect(() => {
    setDemoStarted(false);
    setDemoRunning(false);
  }, [activeDemo]);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'hero' }) });
    setHeroSubmitted(true);
  };

  const sectionStyle: React.CSSProperties = { maxWidth: '900px', margin: '0 auto', padding: '80px 24px' };
  const labelStyle: React.CSSProperties = { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: '36px', display: 'block' };
  const divider = { borderTop: '1px solid var(--border)' } as React.CSSProperties;

  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '80px 32px', borderRadius: '16px' }} className="heroDots">
          <div style={{ display: 'inline-block', background: 'var(--accent-dim)', border: '1px solid rgba(165,180,252,0.3)', color: 'var(--accent)', fontSize: '0.75rem', padding: '5px 14px', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '28px' }}>
            Automation · AI · Colchester, UK
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px' }}>
            <ClipReveal>
              <>Stop doing<br />
              <span style={{ color: 'var(--accent)' }}>{typed || ' '}</span>
              <span style={{ borderRight: '3px solid var(--accent)', animation: 'blink 1s step-end infinite' }} /><br />
              manually.</>
            </ClipReveal>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: '520px', marginBottom: '40px', lineHeight: 1.7 }}>
            <ClipReveal delay={120}>
              <>I build custom AI automations that take the repetitive parts of running your business off your plate — so you can focus on the work that actually makes you money.</>
            </ClipReveal>
          </p>
          <FadeIn delay={240}>
            <>
              {heroSubmitted ? (
                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1rem' }}>✓ I'll be in touch within 24 hours.</p>
              ) : (
                <form onSubmit={handleHeroSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '440px' }}>
                  <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '13px 16px', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
                  <button type="submit" style={{ background: 'var(--accent)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '13px 22px', fontSize: '0.95rem', cursor: 'pointer' }}>
                    Let's talk
                  </button>
                </form>
              )}
              <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--faint)' }}>Or scroll down to try the tools — no sign-up needed.</p>
            </>
          </FadeIn>
        </div>
      </section>

      {/* TOOLS */}
      <div style={divider} />
      <section id="tools" style={sectionStyle}>
        <FadeIn>
          <span style={labelStyle}>What I build</span>
          <ClipReveal>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '10px', lineHeight: 1.1 }}>
              Live demos — try them now
            </h2>
          </ClipReveal>
          <FadeIn delay={100}>
            <p style={{ color: 'var(--muted)', marginBottom: '40px', maxWidth: '460px', lineHeight: 1.7 }}>
              Scripted walkthroughs of real tools. Every one is customisable for your business.
            </p>
          </FadeIn>
        </FadeIn>

        {/* Tab pills */}
        <FadeIn delay={120}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {TOOLS.map(t => {
              const demo = DEMOS[t.key];
              const isActive = activeDemo === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveDemo(t.key)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--accent)' : 'var(--border-2)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                    fontFamily: 'var(--font-geist-sans)',
                  }}
                >
                  {demo.tabLabel}
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Main demo area */}
        <FadeIn delay={160}>
          <div className="demoGrid">
            {/* Left — browser frame with split panel */}
            <BrowserFrame url={DEMOS[activeDemo].href}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '300px' }}>
                {/* UI mockup */}
                <div style={{ borderRight: '1px solid var(--border)', minWidth: 0, overflow: 'hidden' }}>
                  {activeDemo === 'outreach'   && <OutreachUIMockup />}
                  {activeDemo === 'compliance' && <ComplianceUIMockup />}
                </div>
                {/* Scripted output */}
                <ScriptedOutput
                  lines={DEMOS[activeDemo].scriptLines}
                  color={DEMOS[activeDemo].color}
                  running={demoRunning}
                  started={demoStarted}
                />
              </div>
              {/* Run button inside frame */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <button
                  onClick={runDemo}
                  disabled={demoRunning}
                  style={{
                    background: demoRunning ? 'transparent' : 'var(--accent)',
                    color: demoRunning ? 'var(--muted)' : '#09090b',
                    border: demoRunning ? '1px solid var(--border-2)' : 'none',
                    borderRadius: '6px',
                    padding: '7px 18px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: demoRunning ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-geist-sans)',
                  }}
                >
                  {demoRunning ? 'Running...' : demoStarted ? 'Run again' : 'Run demo'}
                </button>
              </div>
            </BrowserFrame>

            {/* Right — description + CTA */}
            <div
              key={activeDemo}
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 500 }}>
                  {DEMOS[activeDemo].tag}
                </div>
                <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.2 }}>
                  {DEMOS[activeDemo].title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                  {DEMOS[activeDemo].desc}
                </p>
              </div>
              <a
                href={DEMOS[activeDemo].href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--accent)',
                  color: '#09090b',
                  fontWeight: 700,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  width: 'fit-content',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Try the full tool →
              </a>
              <p style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>
                Want this for your business?{' '}
                <a href="/#contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Get in touch</a>
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* PROJECT */}
      <div style={divider} />
      <section id="projects" style={sectionStyle}>
        <FadeIn>
          <span style={labelStyle}>Open source</span>
          <a href="https://github.com/reverendish/mcp-x-mac-seed" target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', transition: 'border-color 0.2s, background 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>Swift · macOS · AI Agent</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>MCP-x-Mac</h3>
                </div>
                <span style={{ fontSize: '1.2rem', color: 'var(--faint)' }}>↗</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>A self-evolving MCP server that gives AI agents control of any macOS app — including ones with no API. Discovers its own capabilities, writes its own tools, and self-heals when apps update. 71 tools across 50+ apps. 80 tests.</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Self-healing', '71 tools', '50+ apps', 'MIT open source'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '100px', color: 'var(--muted)' }}>{tag}</span>
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
          <div className="howItWorksGrid">
            {[
              { n: '01', title: 'Tell me what\'s eating your time', body: 'Fill in the form. I\'ll reply within 24 hours with a quick call to understand the problem.' },
              { n: '02', title: 'I build the automation', body: 'Most small automations take a few days. I use AI to build fast, which keeps the cost low.' },
              { n: '03', title: 'You get your time back', body: 'The system runs in the background. Pay once — no monthly fees unless it makes sense.' },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={i * 120}>
                <div style={{ padding: '32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--faint)', fontWeight: 600, marginBottom: '14px' }}>{step.n}</div>
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* CONTACT */}
      <div style={divider} />
      <section id="contact" style={{ ...sectionStyle, paddingBottom: '120px' }}>
        <FadeIn>
          <span style={{ ...labelStyle, textAlign: 'center', display: 'block' }}>Get in touch</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '8px' }}>What's slowing you down?</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '48px' }}>Takes 2 minutes. I'll reply within 24 hours.</p>
          <ContactForm />
        </FadeIn>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--faint)', fontSize: '0.85rem' }}>
        © 2026 Ish Sitotombe · Colchester, UK
      </footer>
    </>
  );
}
