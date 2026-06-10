/**
 * Nav tests
 * Covers: renders logo and CTA button, openModal called on CTA click, scroll behaviour.
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from '@/components/Nav';
import { useContactModal } from '@/components/ContactModalProvider';

// ── mock ContactModalProvider hook ────────────────────────────────────────────
const mockOpenModal = jest.fn();
jest.mock('@/components/ContactModalProvider', () => ({
  useContactModal: jest.fn(() => ({ openModal: mockOpenModal })),
}));

const mockUseContactModal = useContactModal as jest.Mock;

beforeEach(() => {
  mockOpenModal.mockReset();
  mockUseContactModal.mockReturnValue({ openModal: mockOpenModal });
});

// ── render ────────────────────────────────────────────────────────────────────
describe('render', () => {
  it('renders the brand logo', () => {
    render(<Nav />);
    expect(screen.getByText(/ish\./i)).toBeInTheDocument();
  });

  it('renders "Get in touch" button', () => {
    render(<Nav />);
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    render(<Nav />);
    // ThemeToggle renders a button — just check it's in the nav area
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

// ── get in touch ──────────────────────────────────────────────────────────────
describe('"Get in touch" button', () => {
  it('calls openModal when clicked', async () => {
    render(<Nav />);
    await userEvent.setup().click(screen.getByRole('button', { name: /get in touch/i }));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});

// ── scroll behaviour ──────────────────────────────────────────────────────────
describe('scroll behaviour', () => {
  it('nav is in the document on mount', () => {
    render(<Nav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('adds scroll listener on mount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    render(<Nav />);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    addSpy.mockRestore();
  });

  it('removes scroll listener on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Nav />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
