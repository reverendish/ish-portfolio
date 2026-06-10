'use client';
import { useState } from 'react';

type DemoState = 'idle' | 'loading' | 'done' | 'error';

const BUSINESS_PRESETS = [
  'estate agent',
  'letting agent',
  'accountancy firm',
  'construction company',
  'recruitment agency',
  'IT company',
  'law firm',
  'dental practice',
  'restaurant or café',
  'other',
];

interface Props {
  accentColor?: string;
}

export default function OutreachDemoForm({ accentColor = '#a5b4fc' }: Props) {
  const [name, setName]             = useState('');
  const [business, setBusiness]     = useState('');
  const [email, setEmail]           = useState('');
  const [state, setState]           = useState<DemoState>('idle');
  const [emailText, setEmailText]   = useState('');
  const [error, setError]           = useState('');
  const [loadingDot, setLoadingDot] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_OUTREACH_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'loading') return;

    setState('loading');
    setError('');

    // Animate loading dots
    const dotTimer = setInterval(() => setLoadingDot(d => (d + 1) % 4), 400);

    try {
      if (!apiUrl) throw new Error('Demo not available in this environment.');

      const res = await fetch(`${apiUrl}/demo-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, business, recipientEmail: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setEmailText(data.emailText);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setState('error');
    } finally {
      clearInterval(dotTimer);
    }
  };

  const reset = () => {
    setState('idle');
    setEmailText('');
    setError('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border-2)',
    borderRadius: '6px',
    color: 'var(--text)',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.68rem',
    color: 'var(--muted)',
    display: 'block',
    marginBottom: '4px',
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (state === 'loading') {
    const dots = '.'.repeat(loadingDot);
    return (
      <div style={{ padding: '24px 20px', fontFamily: 'var(--font-geist-mono)', fontSize: '0.75rem', color: 'var(--muted)', minHeight: '240px' }}>
        <div style={{ color: accentColor, marginBottom: '12px' }}>→ Generating your email{dots}</div>
        <div style={{ color: 'var(--faint)' }}>→ Calling Claude via Bedrock</div>
        <div style={{ marginTop: '8px', color: 'var(--faint)' }}>→ Sending via Resend</div>
        <div style={{ marginTop: '16px' }}>
          <span style={{ color: accentColor, animation: 'blink 1s step-end infinite' }}>▋</span>
        </div>
      </div>
    );
  }

  // ── Done state ──────────────────────────────────────────────────────────────
  if (state === 'done') {
    const lines = emailText.trim().split('\n');
    const subjectLine = lines.find(l => l.toLowerCase().startsWith('subject:'));
    const bodyLines = lines.filter(l => !l.toLowerCase().startsWith('subject:')).filter((l, i, arr) => !(i === 0 && l.trim() === '') || arr.some(x => x.trim()));

    return (
      <div style={{ padding: '16px 20px', fontFamily: 'var(--font-geist-mono)', fontSize: '0.75rem', lineHeight: 1.75, minHeight: '240px' }}>
        <div style={{ color: 'var(--faint)', marginBottom: '8px', fontSize: '0.68rem' }}>
          → Sent to {email} ✓
        </div>
        {subjectLine && (
          <div style={{ color: accentColor, fontWeight: 600, marginBottom: '10px' }}>
            {subjectLine}
          </div>
        )}
        <div style={{ color: 'var(--muted)', borderLeft: `2px solid var(--border-2)`, paddingLeft: '12px' }}>
          {bodyLines.map((line, i) => (
            <div key={i} style={{ minHeight: line.trim() ? undefined : '0.6em' }}>
              {line || ' '}
            </div>
          ))}
        </div>
        <button
          onClick={reset}
          style={{
            marginTop: '16px',
            background: 'transparent',
            border: '1px solid var(--border-2)',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-geist-mono)',
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  // ── Idle / error state ──────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      data-testid="outreach-demo-form"
      style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '240px' }}
    >
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 4px', lineHeight: 1.5 }}>
        Fill in your details — I'll generate a real cold email and send it to your inbox.
      </p>

      <div>
        <label style={labelStyle} htmlFor="demo-name">Your first name</label>
        <input
          id="demo-name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sarah"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="demo-business">Your business type</label>
        <select
          id="demo-business"
          required
          value={business}
          onChange={e => setBusiness(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="" disabled>Select...</option>
          {BUSINESS_PRESETS.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="demo-email">Your email</label>
        <input
          id="demo-email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@yourbusiness.com"
          style={inputStyle}
        />
      </div>

      {state === 'error' && (
        <p style={{ fontSize: '0.72rem', color: '#fca5a5', margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        style={{
          background: accentColor,
          color: '#0a0a0f',
          border: 'none',
          borderRadius: '6px',
          padding: '9px 18px',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginTop: 'auto',
          alignSelf: 'flex-start',
        }}
      >
        Generate &amp; send →
      </button>
    </form>
  );
}
