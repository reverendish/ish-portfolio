import Nav from '@/components/Nav';
import ContactModalProvider from '@/components/ContactModalProvider';
import Link from 'next/link';

export default function NotFound() {
  return (
    <ContactModalProvider>
      <Nav />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', fontWeight: 600, marginBottom: '16px' }}>
            404
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px' }}>
            Page not found.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '32px' }}>
            This page doesn&apos;t exist.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </ContactModalProvider>
  );
}
