'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Read whatever the inline FOUC script already set on <html>
    const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
    setTheme(current ?? 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: 'transparent',
        border: '1px solid var(--border-2)',
        borderRadius: '8px',
        padding: '6px 10px',
        cursor: 'pointer',
        color: 'var(--muted)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-geist-mono)',
        letterSpacing: '0.04em',
        transition: 'color 0.2s, border-color 0.2s',
        lineHeight: 1,
      }}
    >
      {theme === 'dark' ? '☀ light' : '☾ dark'}
    </button>
  );
}
