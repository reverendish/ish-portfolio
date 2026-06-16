'use client';
import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import { useContactModal } from '@/components/ContactModalProvider';
import HeroCanvas from '@/components/HeroCanvas';
import OutreachDemoForm from '@/components/OutreachDemoForm';
import ComplianceDemoForm from '@/components/ComplianceDemoForm';

// ── useTyping ─────────────────────────────────────────────────────────────────
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

// ── Animation wrappers ────────────────────────────────────────────────────────
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

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMOS: Record<string, {
  type: 'interactive' | 'scripted';
  color: string;
  tabLabel: string;
  tag: string;
  title: string;
  desc: string;
  href: string;
  scriptLines?: { text: string; dim?: boolean; accent?: boolean }[];
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
    type: 'interactive',
    color: '#a5b4fc',
    tabLabel: 'Compliance Checker',
    tag: 'Free · GDPR · PECR',
    title: 'UK Compliance Checker',
    desc: 'Free forever. Enter any UK website URL and get an instant compliance audit — GDPR, PECR, Companies Act, WCAG, and up to 260 sector-specific checks. I absorb the AWS costs so you don\'t have to.',
    href: 'https://compliance.ishsitotombe.co.uk',
  },
};

const TOOLS = [
  { key: 'outreach',   href: 'https://outreach.ishsitotombe.co.uk' },
  { key: 'compliance', href: 'https://compliance.ishsitotombe.co.uk' },
];

// ── BrowserFrame ──────────────────────────────────────────────────────────────
function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-2)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
    }}>
      {/* Titlebar */}
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

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const typed = useTyping(['outreach.', 'late payment chasing.', 'customer onboarding.', 'compliance checks.']);
  const [activeDemo, setActiveDemo] = useState('outreach');
  const { openModal } = useContactModal();

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

  const demo = DEMOS[activeDemo];

  return (
    <>
      <Nav />

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 32px 80px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <HeroCanvas />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <FadeIn delay={300}>
            <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
              Stop doing<br />
              <span style={{ color: 'var(--hero-typed)' }}>
                {typed}
                <span style={{ borderRight: '3px solid var(--hero-typed)', animation: 'blink 1s step-end infinite', marginLeft: '2px' }} />
              </span><br />
              manually.
            </h1>
          </FadeIn>

          <FadeIn delay={700}>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '480px', marginBottom: '40px', lineHeight: 1.75 }}>
              I build custom AI automations that take the repetitive parts of running your business off your plate — so you can focus on the work that actually makes you money.
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
              {TOOLS.map(t => {
                const d = DEMOS[t.key];
                const isActive = activeDemo === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveDemo(t.key)}
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
                {/* Content area — fixed height */}
                <div style={{ minHeight: '280px' }}>
                  {activeDemo === 'outreach'    && <OutreachDemoForm accentColor={demo.color} />}
                  {activeDemo === 'compliance'  && <ComplianceDemoForm accentColor={demo.color} />}
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
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '10px' }}>MCP-x-Mac</h3>
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
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '10px' }}>Advanced Math Error Correction</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '20px' }}>
                    A curated dataset for fine-tuning LLMs on mathematical reasoning and error correction. Designed to improve model accuracy on multi-step problems where small mistakes compound.
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
      <section>
        <div style={panel}>
          <FadeIn>
            <span style={labelStyle}>How it works</span>
            <ClipReveal>
              <h2 style={{ ...sectionH2, marginBottom: '40px' }}>Three steps, then it runs itself.</h2>
            </ClipReveal>
            <div className="howItWorksGrid">
              {[
                { n: '01', title: 'Tell me what\'s eating your time', body: 'Click \'Get in touch\' — takes 2 minutes. I\'ll reply within 24 hours with a quick call to understand the problem.' },
                { n: '02', title: 'I build the automation', body: 'Most small automations take a few days. I use AI to build fast, which keeps the cost low.' },
                { n: '03', title: 'You get your time back', body: 'The system runs in the background. Pay once — no monthly fees unless it makes sense.' },
              ].map((step, i) => (
                <FadeIn key={step.n} delay={i * 120}>
                  <div style={{ padding: '28px 32px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--faint)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '12px' }}>{step.n}</div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: '10px', lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{step.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--faint)', fontSize: '0.85rem', background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
        © 2026 Ish Sitotombe · Colchester, UK
      </footer>
    </>
  );
}
