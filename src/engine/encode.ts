import type { OutputFormat } from './types';

const MIME: Record<Exclude<OutputFormat, 'avif'>, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Draw an ImageBitmap onto an OffscreenCanvas at the given size and encode to a Blob.
 * JPEG/PNG/WebP use the browser encoder; AVIF lazy-loads @jsquash/avif for reliable cross-browser output.
 */
export async function encodeBitmap(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);

  if (format === 'avif') {
    const { encode } = await import('@jsquash/avif');
    const imageData = ctx.getImageData(0, 0, width, height);
    // @jsquash quality is 0..100; our quality is 0..1.
    const buf = await encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buf], { type: 'image/avif' });
  }

  return canvas.convertToBlob({ type: MIME[format], quality });
}
