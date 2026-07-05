'use client';
import { useState, useRef } from 'react';

type DemoState = 'idle' | 'loading' | 'done' | 'error';

interface Props {
  accentColor?: string;
}

interface ResultLine {
  text: string;
  accent?: boolean;
  dim?: boolean;
  pass?: boolean;
  fail?: boolean;
}

export default function ComplianceDemoForm({ accentColor = '#e8874a' }: Props) {
  const [url, setUrl]         = useState('');
  const [state, setState]     = useState<DemoState>('idle');
  const [lines, setLines]     = useState<ResultLine[]>([]);
  const [error, setError]     = useState('');
  const abortRef              = useRef<AbortController | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_COMPLIANCE_API_URL;

  const pushLine = (line: ResultLine) =>
    setLines(prev => [...prev, line]);

  const runCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'loading') return;

    if (!apiUrl) {
      setError('Demo not available yet, check back soon.');
      setState('error');
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState('loading');
    setLines([]);
    setError('');

    const target = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    pushLine({ text: `> Checking ${target}`, dim: true });

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop()!;

        for (const part of parts) {
          if (!part.trim()) continue;
          let chunk: Record<string, unknown>;
          try { chunk = JSON.parse(part); } catch { continue; }

          if (chunk.type === 'meta') {
            pushLine({ text: `→ ${chunk.site_name || target}`, accent: true });
          } else if (chunk.type === 'classified') {
            pushLine({ text: `→ Sector: ${chunk.sector_name}`, accent: true });
            pushLine({ text: `→ Running ${chunk.total_checks} checks...`, dim: true });
            pushLine({ text: '────────────────────────', dim: true });
          } else if (chunk.type === 'group') {
            const checks = (chunk.checks as Array<{ pass: boolean; label: string }>) || [];
            const failures = checks.filter(c => c.pass === false).slice(0, 3);
            const passes   = checks.filter(c => c.pass === true).slice(0, 2);
            for (const f of failures) pushLine({ text: `✗ ${f.label}`, fail: true });
            for (const p of passes)   pushLine({ text: `✓ ${p.label}`, pass: true });
          } else if (chunk.type === 'done') {
            pushLine({ text: '────────────────────────', dim: true });
            pushLine({
              text: `Score: ${chunk.overall_score}/100 · ${chunk.critical_count} critical`,
              accent: true,
            });
          } else if (chunk.type === 'error') {
            throw new Error(chunk.message as string);
          }
        }
      }

      setState('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message || 'Something went wrong.');
      setState('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border-2)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-geist-mono)',
    outline: 'none',
    minWidth: 0,
  };

  const lineColor = (l: ResultLine) => {
    if (l.accent) return accentColor;
    if (l.fail)   return '#fca5a5';
    if (l.pass)   return '#86efac';
    return 'var(--faint)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '280px' }}>
      {/* Input bar */}
      <form
        onSubmit={runCheck}
        style={{ display: 'flex', gap: '8px', padding: '12px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}
      >
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="yourwebsite.co.uk"
          required
          style={inputStyle}
          aria-label="Website URL to check"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !url.trim()}
          style={{
            background: state === 'loading' ? 'transparent' : accentColor,
            border: state === 'loading' ? '1px solid var(--border-2)' : 'none',
            borderRadius: 'var(--radius)',
            padding: '7px 14px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: state === 'loading' ? 'var(--muted)' : '#0a0a0f',
            cursor: state === 'loading' ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-geist-sans)',
          }}
        >
          {state === 'loading' ? 'Checking…' : 'Check →'}
        </button>
      </form>

      {/* Output */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        fontFamily: 'var(--font-geist-mono)',
        fontSize: '0.72rem',
        lineHeight: 1.8,
      }}>
        {lines.length === 0 && state === 'idle' && (
          <span style={{ color: 'var(--faint)' }}>Enter a URL above to run a free compliance check.</span>
        )}
        {lines.map((l, i) => (
          <div key={i} style={{ color: lineColor(l), animation: 'slideUp 0.15s ease forwards' }}>
            {l.text}
          </div>
        ))}
        {state === 'loading' && (
          <span style={{ color: accentColor, animation: 'blink 1s step-end infinite' }}>▋</span>
        )}
        {state === 'error' && (
          <div style={{ color: '#fca5a5', marginTop: '4px' }}>{error}</div>
        )}
        {state === 'done' && (
          <button
            onClick={() => { setState('idle'); setLines([]); setUrl(''); }}
            style={{
              marginTop: '8px',
              background: 'transparent',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius)',
              padding: '5px 12px',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            Check another →
          </button>
        )}
      </div>
    </div>
  );
}
