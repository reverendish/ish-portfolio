'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ContactModal from './ContactModal';

interface ContactModalCtx {
  openModal: () => void;
}

const ContactModalContext = createContext<ContactModalCtx>({ openModal: () => {} });

export function useContactModal() {
  return useContext(ContactModalContext);
}

export default function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal  = useCallback(() => setIsOpen(true),  []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ openModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ContactModalContext.Provider>
  );
}
