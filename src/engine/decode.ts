import { detectFormat } from './detectFormat';

/**
 * Decode any supported image (incl. HEIC/AVIF) into an ImageBitmap.
 * Native formats use the browser directly; HEIC and AVIF lazy-load WASM only when needed.
 */
export async function decodeToBitmap(file: Blob): Promise<ImageBitmap> {
  const header = await file.slice(0, 16).arrayBuffer();
  const format = detectFormat(header);

  if (format === 'heic') {
    // Lazy-load libheif WASM only for HEIC inputs.
    const { heicTo } = await import('heic-to');
    const pngBlob = await heicTo({ blob: file, type: 'image/png', quality: 1 });
    return createImageBitmap(pngBlob);
  }

  try {
    // Modern browsers decode JPEG/PNG/WebP/AVIF natively here.
    return await createImageBitmap(file);
  } catch (err) {
    if (format === 'avif') {
      // Fallback: decode AVIF via WASM for browsers lacking native AVIF decode.
      const { decode } = await import('@jsquash/avif');
      const imageData = await decode(await file.arrayBuffer());
      if (!imageData) throw new Error('AVIF WASM decode returned null');
      return createImageBitmap(imageData);
    }
    throw err;
  }
}
