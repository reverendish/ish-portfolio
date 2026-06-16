'use client';
import { useRef, useState, useEffect } from 'react';

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView(0.08);
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

export function ClipReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView(0.1);
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
