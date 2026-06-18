import Image from 'next/image';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';
import ContactCTA from './ContactCTA';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Ish Sitotombe',
  description: 'Business automations and custom software. Based in Colchester, UK.',
};

const TOOLS = [
  { category: 'AI & Automation', items: ['Claude / Anthropic API', 'AWS Bedrock', 'OpenAI', 'n8n', 'Make.com'] },
  { category: 'Languages & Frameworks', items: ['TypeScript', 'Python', 'Swift', 'Next.js', 'React'] },
  { category: 'UK Integrations', items: ['Companies House API', 'GDPR / PECR', 'Xero', 'Stripe'] },
  { category: 'Infrastructure', items: ['Netlify', 'AWS Lambda', 'Vercel', 'Supabase'] },
];

export default function AboutPage() {
  return (
    <ContactModalProvider>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* ── Hero ── */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 32px 0' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', fontWeight: 600, display: 'block', marginBottom: '16px' }}>
            Who I am
          </span>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Image src="/ish.jpg" alt="Ish Sitotombe" width={160} height={160}
              style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />

            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '8px' }}>
                Ish Sitotombe
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 500 }}>
                Colchester, UK
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>
              I build business automations and custom software. Based in Colchester, UK.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>
              I spent five years in construction before switching industries at the start of 2026. No degree, no bootcamp — I taught myself and built the tools on this site.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>
              If you&apos;ve got a process eating your team&apos;s time and want it built properly without agency overhead,{' '}
              <a href="mailto:ishsitotombe@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>get in touch</a>.
            </p>
          </div>
        </section>

        {/* ── Tools ── */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '0 32px 60px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '28px' }}>
            Tools &amp; technologies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {TOOLS.map(group => (
              <div key={group.category}>
                <h3 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', fontWeight: 600, marginBottom: '12px' }}>
                  {group.category}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.items.map(item => (
                    <li key={item} style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open source ── */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '0 32px 60px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Open source
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.7 }}>
            I build in public. You can see how I think on GitHub.
          </p>
          <a
            href="https://github.com/reverendish"
            target="_blank"
            rel="noopener"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 18px', border: '1px solid var(--border-2)', borderRadius: '8px' }}
          >
            github.com/reverendish ↗
          </a>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '0 32px 100px' }}>
          <div style={{ padding: '40px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Ready to automate something?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Tell me what&apos;s eating your team&apos;s time. I&apos;ll come back with an honest assessment and a quote if it makes sense.
            </p>
            <ContactCTA />
            <div style={{ marginTop: '16px' }}>
              <a href="https://www.linkedin.com/in/ish-sitotombe-0905b7291/" target="_blank" rel="noopener" style={{ fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none' }}>
                Or find me on LinkedIn ↗
              </a>
            </div>
          </div>
        </section>

      </main>
    </ContactModalProvider>
  );
}
