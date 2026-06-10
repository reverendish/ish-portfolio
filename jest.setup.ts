import '@testing-library/jest-dom';

// IntersectionObserver not available in jsdom
global.IntersectionObserver = class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
} as unknown as typeof IntersectionObserver;

// ResizeObserver not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(_callback: ResizeObserverCallback) {}
} as unknown as typeof ResizeObserver;

// HeroCanvas uses Three.js WebGL — mock it for all tests
jest.mock('@/components/HeroCanvas', () => ({
  __esModule: true,
  default: () => null,
}));

// Silence Next.js font warnings in tests
jest.mock('next/font/local', () => () => ({ className: 'mock-font', variable: '--mock-font' }));
