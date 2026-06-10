/**
 * ContactModal tests
 * Covers: visibility, close triggers (button, backdrop, Escape), form submission,
 * body scroll lock, success state.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactModal from '@/components/ContactModal';

const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

function renderModal(isOpen = true) {
  const onClose = jest.fn();
  const utils = render(<ContactModal isOpen={isOpen} onClose={onClose} />);
  return { ...utils, onClose };
}

async function fillForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/your name/i), 'Alice');
  await user.type(screen.getByLabelText(/business name/i), 'Acme Ltd');
  await user.type(screen.getByLabelText(/email address/i), 'alice@acme.com');
  await user.type(screen.getByLabelText(/biggest time sink/i), 'Invoice chasing every Friday');
}

beforeEach(() => {
  mockFetch.mockReset();
});

// ── visibility ────────────────────────────────────────────────────────────────
describe('visibility', () => {
  it('renders the modal when isOpen=true', () => {
    renderModal(true);
    expect(screen.getByText(/What's slowing you down/i)).toBeInTheDocument();
  });

  it('renders nothing when isOpen=false', () => {
    renderModal(false);
    expect(screen.queryByText(/What's slowing you down/i)).not.toBeInTheDocument();
  });
});

// ── closing ───────────────────────────────────────────────────────────────────
describe('closing', () => {
  it('calls onClose when × button clicked', async () => {
    const { onClose } = renderModal();
    await userEvent.setup().click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', async () => {
    const { onClose } = renderModal();
    // The backdrop is the outermost div — click outside the modal card
    const backdrop = screen.getByText(/What's slowing you down/i).closest('[style*="position: fixed"]');
    await userEvent.setup().click(backdrop as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const { onClose } = renderModal();
    await userEvent.setup().keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal card', async () => {
    const { onClose } = renderModal();
    await userEvent.setup().click(screen.getByText(/What's slowing you down/i));
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ── body scroll lock ──────────────────────────────────────────────────────────
describe('scroll lock', () => {
  it('sets body overflow:hidden when modal opens', () => {
    renderModal(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when modal closes', () => {
    const { rerender, onClose } = renderModal(true);
    rerender(<ContactModal isOpen={false} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('');
  });
});

// ── form fields ───────────────────────────────────────────────────────────────
describe('form fields', () => {
  it('renders all four input fields', () => {
    renderModal();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/biggest time sink/i)).toBeInTheDocument();
  });

  it('submit button is labelled "Send it over"', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /send it over/i })).toBeInTheDocument();
  });
});

// ── form submission ───────────────────────────────────────────────────────────
describe('form submission', () => {
  it('shows success state after successful submit', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderModal();
    await fillForm();
    await userEvent.setup().click(screen.getByRole('button', { name: /send it over/i }));
    // Use the h3 text which only appears in the success state
    await waitFor(() =>
      expect(screen.getByText(/Got it — I'll reply within 24 hours/i)).toBeInTheDocument()
    );
  });

  it('shows error message when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    renderModal();
    await fillForm();
    await userEvent.setup().click(screen.getByRole('button', { name: /send it over/i }));
    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    );
  });

  it('shows error message when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderModal();
    await fillForm();
    await userEvent.setup().click(screen.getByRole('button', { name: /send it over/i }));
    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    );
  });

  it('success state shows Close button', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderModal();
    await fillForm();
    await userEvent.setup().click(screen.getByRole('button', { name: /send it over/i }));
    await waitFor(() => screen.getByText(/Got it — I'll reply within 24 hours/i));
    // The success "Close" button has visible text "Close" (distinct from ✕ button)
    const buttons = screen.getAllByRole('button', { name: /close/i });
    const closeBtn = buttons.find(b => b.textContent === 'Close');
    expect(closeBtn).toBeInTheDocument();
  });
});
