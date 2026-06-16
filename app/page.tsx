'use client';
import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import { useContactModal } from '@/components/ContactModalProvider';
import HeroCanvas from '@/components/HeroCanvas';
import OutreachDemoForm from '@/components/OutreachDemoForm';
import ComplianceDemoForm from '@/components/ComplianceDemoForm';
import BrowserFrame from '@/components/BrowserFrame';
import { FadeIn, ClipReveal } from '@/components/animations';

// ── Feature flags ─────────────────────────────────────────────────────────────
// Set to true once you have real testimonials to replace the placeholders below
const SHOW_SOCIAL_PROOF = false;

// ── Typewriter hook ───────────────────────────────────────────────────────────
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

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMOS: Record<string, {
  type: 'interactive' | 'free';
  color: string;
  tabLabel: string;
  tag: string;
  title: string;
  desc: string;
  href: string;
}> = {
  outreach: {
    type: 'interactive',
    color: '#a5b4fc',
    tabLabel: 'Outreach Agent',
    tag: 'Sales · CRM · Companies House',
    title: 'Outreach Agent',
    desc: 'Search UK companies via Companies House, enrich with director data, generate personalised cold emails — then manage the full pipeline. Give it your details and see a real email land in your inbox.',
    href: 'https://outreach.ishsitotombe.co.uk',
  },
  compliance: {
    type: 'free',
    color: '#a5b4fc',
    tabLabel: 'Compliance Checker',
    tag: 'Free · GDPR · PECR',
    title: 'UK Compliance Checker',
    desc: 'Enter any UK website URL and get an instant compliance audit — GDPR, PECR, Companies Act, WCAG, and up to 260 sector-specific checks. Free to use, no sign-up required.',
    href: 'https://compliance.ishsitotombe.co.uk',
  },
};

// ── Hoisted style constants ───────────────────────────────────────────────────
const panel: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '80px 32px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--faint)',
  marginBottom: '16px',
  display: 'block',
  fontWeight: 600,
};

const sectionH2: React.CSSProperties = {
  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1.05,
  marginBottom: '12px',
};

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const typed = useTyping(['outreach.', 'late payment chasing.', 'customer onboarding.', 'compliance checks.']);
  const [activeDemo, setActiveDemo] = useState('outreach');
  const { openModal } = useContactModal();

  const demo = DEMOS[activeDemo];

  return (
    <>
      <Nav />

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 32px 80px', position: 'relative', zIndex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
        <HeroCanvas />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <FadeIn delay={300}>
            <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
              Stop doing<br />
              <span style={{ color: 'var(--hero-typed, var(--accent))' }}>
                {typed}
                <span style={{ borderRight: '3px solid var(--hero-typed, var(--accent))', animation: 'blink 1s step-end infinite', marginLeft: '2px' }} />
              </span><br />
              manually.
            </h1>
          </FadeIn>

          <FadeIn delay={700}>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '520px', marginBottom: '40px', lineHeight: 1.75 }}>
              UK agencies and B2B firms use me to automate the workflows their teams manually slog through every week — custom-built to exactly how you work, and running within days.
            </p>
          </FadeIn>

          <FadeIn delay={1100}>
            <button onClick={openModal} style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '13px 22px', fontSize: '0.95rem', cursor: 'pointer' }}>
              Get in touch →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── TOOLS / DEMOS ───────────────────────────────── */}
      <section id="tools">
        <div style={{ ...panel, maxWidth: '1100px' }}>
          <FadeIn>
            <span style={labelStyle}>What I build</span>
            <ClipReveal>
              <h2 style={sectionH2}>Live demos</h2>
            </ClipReveal>
          </FadeIn>

          {/* Tab pills */}
          <FadeIn delay={120}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {Object.keys(DEMOS).map(key => {
                const d = DEMOS[key];
                const isActive = activeDemo === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveDemo(key)}
                    style={{
                      padding: '8px 20px', borderRadius: '100px', border: '1px solid',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border-2)',
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--muted)',
                      fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                      fontFamily: 'var(--font-geist-sans)',
                    }}
                  >
                    {d.tabLabel}
                  </button>
                );
              })}
            </div>
          </FadeIn>

          {/* Demo area */}
          <FadeIn delay={160}>
            <div className="demoGrid">
              {/* Left — browser mockup */}
              <BrowserFrame url={demo.href}>
                <div style={{ minHeight: '280px' }}>
                  {activeDemo === 'outreach'   && <OutreachDemoForm accentColor={demo.color} />}
                  {activeDemo === 'compliance' && <ComplianceDemoForm accentColor={demo.color} />}
                </div>
              </BrowserFrame>

              {/* Right — description */}
              <div
                key={activeDemo}
                style={{ animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 500 }}>
                    {demo.tag}
                  </div>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.2 }}>
                    {demo.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75 }}>
                    {demo.desc}
                  </p>
                </div>
                <a
                  href={demo.href}
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
                  {demo.type === 'interactive' ? 'Try the full tool →' : 'Use the free tool →'}
                </a>
                <p style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>
                  Want this for your business?{' '}
                  <button onClick={openModal} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Get in touch</button>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────── */}
      {/* Set SHOW_SOCIAL_PROOF = true at the top of this file once you have real testimonials */}
      {SHOW_SOCIAL_PROOF && (
        <section id="testimonials">
          <div style={panel}>
            <FadeIn>
              <span style={labelStyle}>What clients say</span>
              <ClipReveal>
                <h2 style={{ ...sectionH2, marginBottom: '40px' }}>Results that speak.</h2>
              </ClipReveal>
              <div className="testimonialsGrid">
                {[
                  {
                    // PLACEHOLDER — replace with real quote before enabling
                    quote: "We were spending 6 hours every Monday pulling together our weekly client report. Ish automated the whole thing — it runs Sunday night and lands in every client's inbox before they've had their morning coffee. Game-changer.",
                    name: "Sarah M.",
                    role: "Operations Director",
                    company: "Digital Marketing Agency, London",
                    metric: "6 hrs/week saved",
                  },
                  {
                    // PLACEHOLDER — replace with real quote before enabling
                    quote: "I'd tried Zapier three times and kept hitting the same wall. Ish built exactly what I needed in under a week — it handles all the edge cases Zapier couldn't. Worth every penny.",
                    name: "James T.",
                    role: "Founder",
                    company: "B2B SaaS, Manchester",
                    metric: "3 days to deploy",
                  },
                  {
                    // PLACEHOLDER — replace with real quote before enabling
                    quote: "The outreach tool pulled directors from Companies House, personalised each email, and sent them while we slept. We booked 4 discovery calls in the first week.",
                    name: "Priya K.",
                    role: "Head of Business Development",
                    company: "PR Agency, Bristol",
                    metric: "4 calls in week 1",
                  },
                ].map((t, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.75, fontStyle: 'italic' }}>
                        "{t.quote}"
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{t.role}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>{t.company}</div>
                        </div>
                        <span style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '100px', color: 'var(--accent)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {t.metric}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── PROJECTS ──────────────────────────────────────── */}
      <section id="projects">
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>Open source</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, marginBottom: '28px' }}>Built in public.</h2>
            </ClipReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <h3 style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: '8px' }}>MCP-x-Mac</h3>
                  <p style={{ color: 'var(--accent)', fontSize: '0.82rem', marginBottom: '10px', fontWeight: 500 }}>
                    Gives AI agents direct control of any Mac app — including ones with no API — through a self-building tool registry.
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '20px' }}>
                    A self-evolving MCP server that discovers its own capabilities, writes its own tools, and self-heals when apps update. 71 tools across 50+ apps. 80 tests.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Self-healing', '71 tools', '50+ apps', 'MIT open source'].map(tag => (
                      <span key={tag} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '100px', color: 'var(--muted)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
              <a href="https://huggingface.co/datasets/reverendish/advanced-math-error-correction" target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>HuggingFace · Dataset · LLM Training</div>
                    <span style={{ fontSize: '1.1rem', color: 'var(--faint)' }}>↗</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: '8px' }}>Advanced Math Error Correction</h3>
                  <p style={{ color: 'var(--accent)', fontSize: '0.82rem', marginBottom: '10px', fontWeight: 500 }}>
                    A training dataset that teaches AI models to catch and fix their own reasoning errors — the same rigour behind the automations I build.
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '20px' }}>
                    Curated dataset for fine-tuning LLMs on mathematical reasoning and error correction. Designed to improve model accuracy on multi-step problems where small mistakes compound.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Fine-tuning', 'Math reasoning', 'Open dataset'].map(tag => (
                      <span key={tag} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '100px', color: 'var(--muted)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works">
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>How it works</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, marginBottom: '40px' }}>Three steps, then it runs itself.</h2>
            </ClipReveal>
            <div className="howItWorksGrid">
              {[
                { n: '01', title: 'Tell me what\'s eating your time', body: 'Click \'Get in touch\' — takes 2 minutes. I\'ll reply within 24 hours with a quick call to understand the problem.' },
                { n: '02', title: 'I build the automation', body: 'I build with the best AI tooling available — which means faster turnaround and a fraction of what a traditional dev shop charges.' },
                { n: '03', title: 'You get your time back', body: 'The automation runs in the background. Most projects are a one-off cost — no monthly fees.' },
              ].map((step, i) => (
                <FadeIn key={step.n} delay={i * 120}>
                  <div style={{ padding: '28px 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '12px' }}>{step.n}</div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{step.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Pricing signal + CTA */}
            <FadeIn delay={360}>
              <div style={{ marginTop: '40px', padding: '28px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '520px' }}>
                  <strong style={{ color: 'var(--text)', fontWeight: 700 }}>Most projects start from £1,500.</strong>{' '}
                  I'll give you an honest quote on the first call — no vague day-rate estimates, no surprise invoices.
                </p>
                <button
                  onClick={openModal}
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '12px 22px', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Get in touch →
                </button>
              </div>
            </FadeIn>
          </FadeIn>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about">
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>Who I am</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '48px', alignItems: 'start' }}>
              {/* Photo slot
                  TODO: Replace this placeholder div with:
                  <Image src="/ish.jpg" alt="Ish Sitotombe" width={120} height={120} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  Add ish.jpg to /public/ when ready.
              */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--accent-dim)',
                border: '2px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--accent)',
                letterSpacing: '-0.03em',
                flexShrink: 0,
              }}>
                IS
              </div>

              <div>
                <ClipReveal>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px' }}>
                    Ish Sitotombe
                  </h2>
                </ClipReveal>

                {/* PLACEHOLDER — update this copy before launch */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                    I'm an automation engineer based in Colchester, UK. I build custom AI systems for agencies and B2B service firms — the kind of workflows that are too specific for Zapier and too expensive for a traditional dev shop.
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                    I specialise in UK-facing tooling: outreach pipelines using Companies House data, GDPR and PECR compliance checks, and workflow automation that connects the systems your team already uses.
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                    {/* TODO: Add specific background/experience detail here */}
                    [Add 1-2 sentences about your background — previous roles, years of experience, or what made you go independent.]
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <a href="/about" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Read more →
                  </a>
                  <a href="https://github.com/reverendish" target="_blank" rel="noopener" style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    GitHub ↗
                  </a>
                  {/* TODO: Replace # with your actual LinkedIn URL */}
                  <a href="#" target="_blank" rel="noopener" style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer id="contact" style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ color: 'var(--faint)', fontSize: '0.85rem' }}>© 2026 Ish Sitotombe · Colchester, UK</span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* TODO: Switch to a business email (e.g. ish@ishsitotombe.co.uk) when set up */}
            <a href="mailto:ishsitotombe@gmail.com" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              ishsitotombe@gmail.com
            </a>
            <a href="https://github.com/reverendish" target="_blank" rel="noopener" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              GitHub
            </a>
            {/* TODO: Replace # with your actual LinkedIn URL */}
            <a href="#" target="_blank" rel="noopener" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
