import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';
import { FadeIn } from '@/components/animations';
import { posts } from './writing/posts';

const panel: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '0 32px',
};

export default function Home() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ContactModalProvider>
      <Nav />
      <style>{`.feed-card{transition:border-color .2s}.feed-card:hover{border-color:var(--accent)}.footer-link{transition:color .2s}.footer-link:hover{color:var(--text)}`}</style>

      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* ── Hero ── */}
        <section style={{ ...panel, padding: '80px 32px 56px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', fontWeight: 600, display: 'block', marginBottom: '16px' }}>
            Research &amp; experiments
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '20px' }}>
            Building things, and writing down what actually happened.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: '620px' }}>
            Software, automations, and whatever experiment I'm running this week.
          </p>
        </section>

        {/* ── Feed ── */}
        <section style={{ ...panel, padding: '24px 32px 100px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sorted.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 60}>
                <Link href={`/writing/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <article className="feed-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--accent)', flexShrink: 0, minWidth: '2.2ch' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <time style={{ fontSize: '0.78rem', color: 'var(--faint)' }} dateTime={p.date}>
                            {new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </time>
                          <span style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>· {p.readingTime}</span>
                        </div>
                        <h2 style={{ fontWeight: 600, fontSize: '1.4rem', letterSpacing: '-0.01em', marginBottom: '10px', color: 'var(--text)' }}>
                          {p.title}
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                          {p.blurb}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ color: 'var(--faint)', fontSize: '0.85rem' }}>© 2026 Ish Sitotombe · Colchester, UK</span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:ishsitotombe@gmail.com" className="footer-link" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ishsitotombe@gmail.com
            </a>
            <Link href="/about" className="footer-link" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              About
            </Link>
            {/* TODO: point this at outreach.ishsitotombe.co.uk once that subdomain is repointed to app/outreach-landing */}
            <Link href="/outreach-landing" className="footer-link" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Need something built?
            </Link>
            <a href="https://github.com/reverendish" target="_blank" rel="noopener" className="footer-link" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </ContactModalProvider>
  );
}
