'use client';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { convertImage } from '@/engine';

// Dev-only page: exposes the engine on window so Playwright can drive it in a real browser.
// Never ships in production — inlined NODE_ENV check 404s the route at build time.
export default function EngineHarness() {
  if (process.env.NODE_ENV === 'production') notFound();

  useEffect(() => {
    (window as unknown as { __convertImage: typeof convertImage }).__convertImage = convertImage;
  }, []);
  return <div data-testid="engine-ready">engine harness</div>;
}
