'use client';
import { useState, useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', business: '', problem: '' });
  const [error, setError]         = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError('');
    setSending(true);
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...form }).toString(),
      });
      if (res.ok) setSubmitted(true);
      else setError('Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</div>
      <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
        Got it, I'll reply within 24 hours.
      </h3>
      <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Check your inbox.</p>
      <button
        onClick={onClose}
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)', border: 'none', borderRadius: 'var(--radius)', padding: '10px 24px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Close
      </button>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)', border: '1px solid var(--border-2)',
    borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.95rem',
    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <form
      name="contact"
      onSubmit={handleSubmit}
      data-netlify="true"
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <input type="hidden" name="form-name" value="contact" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <input
          required name="name" aria-label="Your name" placeholder="Your name"
          autoComplete="name"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={inputStyle} className="modal-input"
        />
        <input
          required name="business" aria-label="Business name" placeholder="Business name"
          autoComplete="organization"
          value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
          style={inputStyle} className="modal-input"
        />
      </div>
      <input
        required type="email" name="email" aria-label="Email address" placeholder="Email address"
        autoComplete="email"
        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        style={inputStyle} className="modal-input"
      />
      <textarea
        required rows={4} name="problem" aria-label="Your biggest time sink"
        placeholder="What's the one task that eats the most of your time each week?"
        value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
        style={{ ...inputStyle, resize: 'vertical' }} className="modal-input"
      />
      {error && <p style={{ fontSize: '0.82rem', color: 'var(--status-red)' }}>{error}</p>}
      <button
        type="submit"
        disabled={sending}
        style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, border: 'none', borderRadius: 'var(--radius)', padding: '14px', fontSize: '1rem', cursor: sending ? 'default' : 'pointer', fontFamily: 'inherit', opacity: sending ? 0.7 : 1, transition: 'opacity 0.15s' }}
      >
        {sending ? 'Sending…' : 'Send it over'}
      </button>
      <p style={{ fontSize: '0.8rem', color: 'var(--faint)', textAlign: 'center' }}>
        No spam. Just a reply from me.
      </p>
    </form>
  );
}

export default function ContactModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', trap);
    return () => window.removeEventListener('keydown', trap);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'backdropIn 0.18s ease forwards',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--radius)',
          padding: '40px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
          animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'transparent', border: 'none',
            color: 'var(--muted)', fontSize: '1rem',
            cursor: 'pointer', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius)', transition: 'background 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', fontWeight: 500 }}>
            Get in touch
          </span>
          <h2 id="contact-modal-title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '8px', marginBottom: '6px', color: 'var(--text)' }}>
            What's slowing you down?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Takes 2 minutes. I'll reply within 24 hours.
          </p>
        </div>

        <ContactForm onClose={onClose} />
      </div>
    </div>
  );
}
