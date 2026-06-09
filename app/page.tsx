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
  scriptLines: { text: string; dim?: boolean; accent?: boolean }[];
}> = {
  outreach: {
    color: '#a5b4fc',
    tabLabel: 'Outreach Agent',
    tag: 'Sales · CRM · Companies House',
    title: 'Outreach Agent',
    desc: 'Search UK companies via Companies House, enrich with director data, generate personalised cold emails via Claude, then manage the full pipeline — contacts, campaigns, and follow-up sequences.',
    href: 'https://outreach.ishsitotombe.co.uk',
    scriptLines: [
      { text: '> estate agents in Colchester', dim: true },
      { text: '→ 8 active companies found', accent: true },
      { text: '→ Fetching directors...', dim: true },
      { text: '→ Enriching: Ashton & Co Properties', dim: true },
      { text: '→ Director: James Ashton', dim: true },
      { text: '────────────────────────', dim: true },
      { text: '→ Generating email via Claude...', dim: true },
      { text: 'Subject: Lettings admin at Ashton & Co', accent: true },
      { text: '"Hi James, I noticed Ashton & Co has', },
      { text: 'been expanding — I build automations', },
      { text: 'for letting agents. Worth a chat?"', },
      { text: '────────────────────────', dim: true },
      { text: '→ Added to follow-up sequence', accent: true },
    ],
  },
  compliance: {
    color: '#a5b4fc',
    tabLabel: 'Compliance Checker',
    tag: 'Legal · GDPR · PECR',
    title: 'Compliance Checker',
    desc: 'Instant UK compliance audit — GDPR, PECR, Companies Act, WCAG, and up to 260 sector-specific checks. Identifies critical issues with citations in under a minute.',
    href: 'https://compliance.ishsitotombe.co.uk',
    scriptLines: [
      { text: '> example-estate-agent.co.uk', dim: true },
      { text: '→ Sector: Estate Agents', accent: true },
      { text: '→ Running 48 checks...', dim: true },
      { text: '────────────────────────', dim: true },
      { text: '✗ Cookie consent missing (PECR)', accent: true },
      { text: '✗ ICO number not found', accent: true },
      { text: '✗ Property Ombudsman absent', accent: true },
      { text: '✓ HTTPS / SSL', dim: true },
      { text: '✓ Privacy policy present', dim: true },
      { text: '────────────────────────', dim: true },
      { text: 'Score: 58/100 · 3 critical', accent: true },
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
      boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
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
    const timers = lines.map((_, i) =>
      setTimeout(() => setShownCount(i + 1), i * 140 + 50)
    );
    return () => timers.forEach(clearTimeout);
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

function OutreachUIMockup() {
  const stats = [
    { label: 'Total', value: '47' },
    { label: 'Enriched', value: '31' },
    { label: 'Contacted', value: '18' },
    { label: 'Replied', value: '6' },
  ];
  const queue = [
    { name: 'James Ashton', company: 'Ashton & Co Properties', due: '2d overdue', starred: true },
    { name: 'Sarah Chen', company: 'Brightwell Lettings', due: '1d overdue', starred: false },
  ];
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 200 }}>
      {/* Sidebar */}
      <div style={{
        width: 90, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: 2,
        background: 'var(--surface)',
      }}>
        {['Dashboard', 'Contacts', 'Campaigns', 'Sequences'].map((item, i) => (
          <div key={item} style={{
            fontSize: '0.62rem', padding: '5px 8px', borderRadius: 4,
            color: i === 0 ? 'var(--accent)' : 'var(--muted)',
            background: i === 0 ? 'var(--accent-dim)' : 'transparent',
            fontWeight: i === 0 ? 600 : 400,
          }}>{item}</div>
        ))}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text)' }}>Dashboard</span>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '6px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Follow-up queue */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ padding: '5px 10px', borderBottom: '1px solid var(--border)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            Follow-up queue
            <span style={{ background: '#f59e0b', color: '#000', borderRadius: 3, padding: '0 5px', fontSize: '0.55rem', fontWeight: 700 }}>2</span>
          </div>
          {queue.map(q => (
            <div key={q.name} style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {q.starred && <span style={{ color: '#f59e0b' }}>★</span>}{q.name}
                </div>
                <div style={{ fontSize: '0.58rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.company}</div>
              </div>
              <span style={{ fontSize: '0.58rem', color: '#f87171', flexShrink: 0, marginLeft: 6 }}>{q.due}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceUIMockup() {
  const checks = [
    { label: 'Cookie consent', pass: false },
    { label: 'HTTPS / SSL', pass: true },
    { label: 'Privacy policy', pass: true },
    { label: 'ICO number', pass: false },
    { label: 'Ombudsman', pass: false },
  ];
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '8px' }}>estate-agent.co.uk</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>58/100</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '8px' }}>
        <div style={{ width: '58%', height: '100%', background: 'var(--accent)', borderRadius: '2px' }} />
      </div>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
          <span style={{ color: c.pass ? '#86efac' : '#fca5a5', fontFamily: 'var(--font-geist-mono)', fontSize: '0.68rem', flexShrink: 0 }}>
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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...form,
        }).toString(),
      });
      if (res.ok) setSubmitted(true);
      else setError('Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</div>
      <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Got it — I'll reply within 24 hours.</h3>
      <p style={{ color: 'var(--muted)' }}>Check your inbox.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)', border: '1px solid var(--border-2)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '0.95rem',
    fontFamily: 'inherit', outline: 'none',
  };

  return (
    <form
      name="contact"
      onSubmit={handleSubmit}
      data-netlify="true"
      style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '520px', margin: '0 auto' }}
    >
      <input type="hidden" name="form-name" value="contact" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <input required name="name" aria-label="Your name" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <input required name="business" aria-label="Business name" placeholder="Business name" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} style={inputStyle} />
      </div>
      <input required type="email" name="email" aria-label="Email address" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
      <textarea required rows={4} name="problem" aria-label="Your biggest time sink" placeholder="What's the one task that eats the most of your time each week?" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
      {error && <p style={{ fontSize: '0.82rem', color: '#fca5a5' }}>{error}</p>}
      <button type="submit" style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', cursor: 'pointer' }}>
        Send it over
      </button>
      <p style={{ fontSize: '0.8rem', color: 'var(--faint)', textAlign: 'center' }}>No spam. Just a reply from me.</p>
    </form>
  );
}

export default function Home() {
  const typed = useTyping(['outreach.', 'late payment chasing.', 'customer onboarding.', 'compliance checks.']);
  const [email, setEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [activeDemo, setActiveDemo] = useState('outreach');
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);

  const runDemo = () => {
    if (demoRunning) return;
    setDemoStarted(true);
    setDemoRunning(true);
    const demo = DEMOS[activeDemo];
    setTimeout(() => setDemoRunning(false), demo.scriptLines.length * 140 + 300);
  };

  useEffect(() => {
    setDemoStarted(false);
    setDemoRunning(false);
  }, [activeDemo]);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroError('');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'hero-email', email }).toString(),
      });
      if (res.ok) setHeroSubmitted(true);
      else setHeroError('Something went wrong. Please try again.');
    } catch {
      setHeroError('Something went wrong. Please try again.');
    }
  };

  const panel: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '80px 32px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--faint)',
    marginBottom: '16px',
    display: 'block',
    fontWeight: 500,
  };

  const sectionH2: React.CSSProperties = {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    marginBottom: '12px',
  };

  return (
    <>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────── */}
      {/* Hero is transparent — dot grid shows across full viewport */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 32px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'inline-block', background: 'var(--accent-dim)', border: '1px solid rgba(165,180,252,0.3)', color: 'var(--accent)', fontSize: '0.72rem', padding: '5px 14px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '32px', fontWeight: 500 }}>
            Automation · AI · Colchester, UK
          </div>

          <FadeIn>
            <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
              Stop doing<br />
              <span style={{ color: 'var(--accent)' }}>
                {typed}
                <span style={{ borderRight: '3px solid var(--accent)', animation: 'blink 1s step-end infinite', marginLeft: '2px' }} />
              </span><br />
              manually.
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '480px', marginBottom: '40px', lineHeight: 1.75 }}>
              I build custom AI automations that take the repetitive parts of running your business off your plate — so you can focus on the work that actually makes you money.
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <>
              {heroSubmitted ? (
                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1rem' }}>✓ I'll be in touch within 24 hours.</p>
              ) : (
                <form name="hero-email" onSubmit={handleHeroSubmit} data-netlify="true" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '440px' }}>
                  <input type="hidden" name="form-name" value="hero-email" />
                  <input
                    type="email"
                    required
                    name="email"
                    aria-label="Your email address"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1, minWidth: '180px', padding: '13px 16px', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }}
                  />
                  <button type="submit" style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '13px 22px', fontSize: '0.95rem', cursor: 'pointer' }}>
                    Let's talk
                  </button>
                </form>
              )}
              {heroError && <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#fca5a5' }}>{heroError}</p>}
              <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--faint)' }}>Or scroll down to see the tools.</p>
            </>
          </FadeIn>
        </div>
      </section>

      {/* ── TOOLS / DEMOS ────────────────────────────────── */}
      <section id="tools">
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>What I build</span>
            <ClipReveal>
              <h2 style={sectionH2}>Live demos</h2>
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

          {/* Demo area */}
          <FadeIn delay={160}>
            <div className="demoGrid">
              {/* Left — browser mockup */}
              <BrowserFrame url={DEMOS[activeDemo].href}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '280px', alignItems: 'stretch' }}>
                  <div style={{ borderRight: '1px solid var(--border)', minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {activeDemo === 'outreach'   && <OutreachUIMockup />}
                    {activeDemo === 'compliance' && <ComplianceUIMockup />}
                  </div>
                  <ScriptedOutput
                    lines={DEMOS[activeDemo].scriptLines}
                    color={DEMOS[activeDemo].color}
                    running={demoRunning}
                    started={demoStarted}
                  />
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <button
                    onClick={runDemo}
                    disabled={demoRunning}
                    style={{
                      background: demoRunning ? 'transparent' : 'var(--accent)',
                      color: demoRunning ? 'var(--muted)' : 'var(--accent-fg)',
                      border: demoRunning ? '1px solid var(--border-2)' : 'none',
                      borderRadius: '6px', padding: '7px 18px', fontSize: '0.8rem',
                      fontWeight: 600, cursor: demoRunning ? 'default' : 'pointer',
                      transition: 'all 0.2s', fontFamily: 'var(--font-geist-sans)',
                    }}
                  >
                    {demoRunning ? 'Running...' : demoStarted ? 'Run again' : 'Run demo'}
                  </button>
                </div>
              </BrowserFrame>

              {/* Right — description */}
              <div
                key={activeDemo}
                style={{ animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 500 }}>
                    {DEMOS[activeDemo].tag}
                  </div>
                  <h3 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.2 }}>
                    {DEMOS[activeDemo].title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                    {DEMOS[activeDemo].desc}
                  </p>
                </div>
                <a
                  href={DEMOS[activeDemo].href}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'var(--accent)', color: 'var(--accent-fg)',
                    fontWeight: 700, padding: '11px 22px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '0.875rem', width: 'fit-content',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Try the full tool →
                </a>
                <p style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>
                  Want this for your business?{' '}
                  <Link href="/#contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Get in touch</Link>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────── */}
      <section id="projects">
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>Open source</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, marginBottom: '28px' }}>MCP-x-Mac</h2>
            </ClipReveal>
            <a href="https://github.com/reverendish/mcp-x-mac-seed" target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Swift · macOS · AI Agent</div>
                  <span style={{ fontSize: '1.1rem', color: 'var(--faint)' }}>↗</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '20px' }}>
                  A self-evolving MCP server that gives AI agents control of any macOS app — including ones with no API. Discovers its own capabilities, writes its own tools, and self-heals when apps update. 71 tools across 50+ apps. 80 tests.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Self-healing', '71 tools', '50+ apps', 'MIT open source'].map(tag => (
                    <span key={tag} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '100px', color: 'var(--muted)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section>
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>How it works</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, marginBottom: '40px' }}>Three steps, then it runs itself.</h2>
            </ClipReveal>
            <div className="howItWorksGrid">
              {[
                { n: '01', title: 'Tell me what\'s eating your time', body: 'Fill in the form below. I\'ll reply within 24 hours with a quick call to understand the problem.' },
                { n: '02', title: 'I build the automation', body: 'Most small automations take a few days. I use AI to build fast, which keeps the cost low.' },
                { n: '03', title: 'You get your time back', body: 'The system runs in the background. Pay once — no monthly fees unless it makes sense.' },
              ].map((step, i) => (
                <FadeIn key={step.n} delay={i * 120}>
                  <div style={{ padding: '28px 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '12px' }}>{step.n}</div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{step.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section id="contact">
        <div style={{ ...panel, paddingBottom: '120px' }}>
          <FadeIn>
            <span style={{ ...labelStyle, textAlign: 'center', display: 'block' }}>Get in touch</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, textAlign: 'center', marginBottom: '8px' }}>What's slowing you down?</h2>
            </ClipReveal>
            <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '48px', marginTop: '8px' }}>Takes 2 minutes. I'll reply within 24 hours.</p>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--faint)', fontSize: '0.85rem', background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
        © 2026 Ish Sitotombe · Colchester, UK
      </footer>
    </>
  );
}
