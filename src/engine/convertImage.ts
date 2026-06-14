import type { ConvertOptions, ConvertResult } from './types';
import { decodeToBitmap } from './decode';
import { encodeBitmap } from './encode';
import { calcDimensions } from './calcDimensions';
import { searchQuality } from './searchQuality';

const DEFAULT_QUALITY = 0.82;

/** Convert/compress/resize a single image entirely client-side. */
export async function convertImage(file: Blob, opts: ConvertOptions): Promise<ConvertResult> {
  const bitmap = await decodeToBitmap(file);
  const { width, height } = calcDimensions(bitmap.width, bitmap.height, opts.resize);
  const quality = opts.quality ?? DEFAULT_QUALITY;

  let blob: Blob;
  if (opts.targetBytes != null && opts.to !== 'png') {
    const { quality: q } = await searchQuality(
      async (probe) => (await encodeBitmap(bitmap, width, height, opts.to, probe)).size,
      opts.targetBytes,
    );
    blob = await encodeBitmap(bitmap, width, height, opts.to, q);
  } else {
    blob = await encodeBitmap(bitmap, width, height, opts.to, quality);
  }

  bitmap.close();
  return { blob, width, height, bytes: blob.size, format: opts.to };
}
