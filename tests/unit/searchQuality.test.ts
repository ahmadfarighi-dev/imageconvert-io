import { describe, it, expect } from 'vitest';
import { searchQuality } from '@/engine/searchQuality';

// Fake encoder: output bytes scale linearly with quality (10kB at q=0 .. 110kB at q=1).
const fakeEncode = async (quality: number): Promise<number> =>
  Math.round(10_000 + quality * 100_000);

describe('searchQuality', () => {
  it('finds a quality whose size is at or under the target', async () => {
    const { quality, bytes } = await searchQuality(fakeEncode, 50_000);
    expect(bytes).toBeLessThanOrEqual(50_000);
    expect(quality).toBeGreaterThanOrEqual(0);
    expect(quality).toBeLessThanOrEqual(1);
  });
  it('returns the lowest-quality result when even q=0 exceeds target', async () => {
    const { quality, bytes } = await searchQuality(fakeEncode, 5_000);
    expect(quality).toBe(0);
    expect(bytes).toBe(10_000); // best we can do
  });
  it('returns max quality when even q=1 is under target', async () => {
    const { quality } = await searchQuality(fakeEncode, 999_999);
    expect(quality).toBe(1);
  });
  it('converges within the iteration budget', async () => {
    let calls = 0;
    const counting = async (q: number) => { calls++; return fakeEncode(q); };
    await searchQuality(counting, 50_000);
    expect(calls).toBeLessThanOrEqual(10); // 2 probes (q=1, q=0) + up to 8 bisections
  });
});
