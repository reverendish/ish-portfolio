import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Writing · Ish Sitotombe',
  description: 'Building in public, notes on software, automations, and research experiments.',
};

export default function WritingIndex() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ContactModalProvider>
      <Nav />
      <style>{`.post-card{transition:border-color .2s}.post-card:hover{border-color:var(--accent)}`}</style>
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 32px 100px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', fontWeight: 600, display: 'block', marginBottom: '16px' }}>
            Writing
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '16px' }}>
            Notes &amp; experiments
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: '620px' }}>
            Software, automations, and whatever experiment I'm running this week.
            Some of it ships. Some of it just proves a point.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '48px' }}>
            {sorted.map(p => (
              <Link key={p.slug} href={`/writing/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <article className="post-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <time style={{ fontSize: '0.78rem', color: 'var(--faint)' }} dateTime={p.date}>
                      {new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <span style={{ fontSize: '0.78rem', color: 'var(--faint)' }}>· {p.readingTime}</span>
                  </div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: '10px', color: 'var(--text)' }}>
                    {p.title}
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '18px' }}>
                    {p.blurb}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '100px', color: 'var(--muted)' }}>{t}</span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </ContactModalProvider>
  );
}
