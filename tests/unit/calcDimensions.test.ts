import { describe, it, expect } from 'vitest';
import { calcDimensions } from '@/engine/calcDimensions';

describe('calcDimensions', () => {
  it('returns source dims when no resize requested', () => {
    expect(calcDimensions(800, 600, undefined)).toEqual({ width: 800, height: 600 });
  });
  it('scales height to preserve aspect when only width given', () => {
    expect(calcDimensions(800, 600, { width: 400 })).toEqual({ width: 400, height: 300 });
  });
  it('scales width to preserve aspect when only height given', () => {
    expect(calcDimensions(800, 600, { height: 300 })).toEqual({ width: 400, height: 300 });
  });
  it('uses both when both given (may distort)', () => {
    expect(calcDimensions(800, 600, { width: 100, height: 100 })).toEqual({ width: 100, height: 100 });
  });
  it('never returns less than 1px and rounds to integers', () => {
    expect(calcDimensions(800, 600, { width: 1 })).toEqual({ width: 1, height: 1 });
  });
});
