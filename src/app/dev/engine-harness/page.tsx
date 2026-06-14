'use client';
import { useEffect } from 'react';
import { convertImage } from '@/engine';

// Dev-only page: exposes the engine on window so Playwright can drive it in a real browser.
export default function EngineHarness() {
  useEffect(() => {
    (window as unknown as { __convertImage: typeof convertImage }).__convertImage = convertImage;
  }, []);
  return <div data-testid="engine-ready">engine harness</div>;
}
