/**
 * Binary-search encoder quality (0..1) to produce output <= targetBytes.
 * `encode(quality)` must return the resulting byte size for that quality.
 * Returns the best quality whose size is <= target (or q=0 if even minimum exceeds it).
 */
export async function searchQuality(
  encode: (quality: number) => Promise<number>,
  targetBytes: number,
  iterations = 8,
): Promise<{ quality: number; bytes: number }> {
  // If max quality already fits, take it.
  const maxBytes = await encode(1);
  if (maxBytes <= targetBytes) return { quality: 1, bytes: maxBytes };

  // If min quality still too big, return the smallest we can produce.
  const minBytes = await encode(0);
  if (minBytes > targetBytes) return { quality: 0, bytes: minBytes };

  let lo = 0;
  let hi = 1;
  let best = { quality: 0, bytes: minBytes };
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const bytes = await encode(mid);
    if (bytes <= targetBytes) {
      best = { quality: mid, bytes };
      lo = mid; // try higher quality
    } else {
      hi = mid; // need smaller
    }
  }
  return best;
}
