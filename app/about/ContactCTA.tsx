'use client';
import { useContactModal } from '@/components/ContactModalProvider';

export default function ContactCTA() {
  const { openModal } = useContactModal();
  return (
    <button
      onClick={openModal}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'var(--accent)', color: 'var(--accent-fg)',
        fontWeight: 700, padding: '13px 28px', borderRadius: 'var(--radius)',
        border: 'none', cursor: 'pointer', fontSize: '0.95rem',
        fontFamily: 'inherit',
      }}
    >
      Get in touch →
    </button>
  );
}
