import type { InputFormat } from './types';

/** Detect image format by inspecting magic bytes. Reads only the header. */
export function detectFormat(buffer: ArrayBuffer): InputFormat {
  const b = new Uint8Array(buffer);
  if (b.length < 3) return 'unknown';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';

  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';

  if (b.length < 12) return 'unknown';

  // WebP: "RIFF"...."WEBP"
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';

  // ISO-BMFF (HEIC/AVIF): bytes 4-7 are "ftyp", brand at bytes 8-11
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand === 'avif' || brand === 'avis') return 'avif';
    if (brand === 'heic' || brand === 'heix' || brand === 'heif' || brand === 'mif1') return 'heic';
  }

  return 'unknown';
}
