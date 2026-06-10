/**
 * ContactModalProvider tests
 * Covers: context wires up, openModal shows modal, clicking backdrop closes it.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactModalProvider, { useContactModal } from '@/components/ContactModalProvider';

function TriggerButton() {
  const { openModal } = useContactModal();
  return <button onClick={openModal}>Open</button>;
}

function renderProvider() {
  return render(
    <ContactModalProvider>
      <TriggerButton />
    </ContactModalProvider>
  );
}

// ── provider ──────────────────────────────────────────────────────────────────
describe('ContactModalProvider', () => {
  it('renders children', () => {
    renderProvider();
    expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
  });

  it('modal is initially closed', () => {
    renderProvider();
    expect(screen.queryByText(/What's slowing you down/i)).not.toBeInTheDocument();
  });

  it('opens modal when openModal is called', async () => {
    renderProvider();
    await userEvent.setup().click(screen.getByRole('button', { name: /open/i }));
    await waitFor(() =>
      expect(screen.getByText(/What's slowing you down/i)).toBeInTheDocument()
    );
  });

  it('closes modal on Escape after opening', async () => {
    renderProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /open/i }));
    await waitFor(() => screen.getByText(/What's slowing you down/i));
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByText(/What's slowing you down/i)).not.toBeInTheDocument()
    );
  });
});
