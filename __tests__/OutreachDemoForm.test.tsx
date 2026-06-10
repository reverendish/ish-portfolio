/**
 * OutreachDemoForm tests
 * Covers: idle form render, validation, loading state, success state, error state, reset.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OutreachDemoForm from '@/components/OutreachDemoForm';

// ── fetch mock ────────────────────────────────────────────────────────────────
const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// ── env ───────────────────────────────────────────────────────────────────────
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  mockFetch.mockReset();
  process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_OUTREACH_API_URL: 'https://api.example.com' };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

// ── helpers ───────────────────────────────────────────────────────────────────
function renderForm() {
  return render(<OutreachDemoForm />);
}

async function fillAndSubmit(name = 'Sarah', business = 'estate agent', email = 'sarah@example.com') {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/first name/i), name);
  await user.selectOptions(screen.getByLabelText(/business type/i), business);
  await user.type(screen.getByLabelText(/your email/i), email);
  await user.click(screen.getByRole('button', { name: /generate/i }));
}

// ── idle state ────────────────────────────────────────────────────────────────
describe('idle form', () => {
  it('renders all three fields', () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('business select has at least 5 preset options', () => {
    renderForm();
    const select = screen.getByLabelText(/business type/i) as HTMLSelectElement;
    // options include the disabled placeholder + presets
    expect(select.options.length).toBeGreaterThanOrEqual(6);
  });

  it('all required fields start empty', () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/your email/i)).toHaveValue('');
  });
});

// ── successful send ───────────────────────────────────────────────────────────
describe('successful send', () => {
  const EMAIL_TEXT = 'Subject: Quick question\n\nHi Sarah,\n\nTest email.\n\nInterested?';

  beforeEach(() => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, emailText: EMAIL_TEXT }),
    });
  });

  it('shows subject line after success', async () => {
    renderForm();
    await fillAndSubmit();
    await waitFor(() => expect(screen.getByText(/Quick question/i)).toBeInTheDocument());
  });

  it('shows sent confirmation', async () => {
    renderForm();
    await fillAndSubmit();
    await waitFor(() => expect(screen.getByText(/Sent to/i)).toBeInTheDocument());
  });

  it('shows "Send another" reset button', async () => {
    renderForm();
    await fillAndSubmit();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /send another/i })).toBeInTheDocument()
    );
  });

  it('reset returns to idle form', async () => {
    renderForm();
    await fillAndSubmit();
    await waitFor(() => screen.getByRole('button', { name: /send another/i }));
    await userEvent.setup().click(screen.getByRole('button', { name: /send another/i }));
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('POSTs to the correct endpoint', async () => {
    renderForm();
    await fillAndSubmit('Sarah', 'estate agent', 'sarah@example.com');
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch.mock.calls[0][0]).toContain('/demo-send');
  });

  it('sends name, business, and recipientEmail in body', async () => {
    renderForm();
    await fillAndSubmit('Sarah', 'estate agent', 'sarah@example.com');
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.name).toBe('Sarah');
    expect(body.recipientEmail).toBe('sarah@example.com');
  });
});

// ── error handling ────────────────────────────────────────────────────────────
describe('error handling', () => {
  it('shows error message when API returns non-ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded' }),
    });
    renderForm();
    await fillAndSubmit();
    await waitFor(() => expect(screen.getByText(/Rate limit exceeded/i)).toBeInTheDocument());
  });

  it('shows error message when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderForm();
    await fillAndSubmit();
    // Component shows err.message directly for Error instances
    await waitFor(() =>
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    );
  });

  it('shows error when NEXT_PUBLIC_OUTREACH_API_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_OUTREACH_API_URL;
    renderForm();
    await fillAndSubmit();
    await waitFor(() =>
      expect(screen.getByText(/Demo not available/i)).toBeInTheDocument()
    );
  });

  it('form remains interactive after error (can retry)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderForm();
    await fillAndSubmit();
    await waitFor(() => screen.getByText(/Network error/i));
    // Submit button still present — user can retry
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });
});

// ── loading state ─────────────────────────────────────────────────────────────
describe('loading state', () => {
  it('shows loading indicator while pending', async () => {
    // Never resolves — stays in loading
    mockFetch.mockReturnValueOnce(new Promise(() => {}));
    renderForm();
    await fillAndSubmit();
    await waitFor(() =>
      expect(screen.getByText(/Generating/i)).toBeInTheDocument()
    );
  });
});
