import { describe, it, expect } from 'vitest';
import { detectFormat } from '@/engine/detectFormat';

function bytes(...b: number[]): ArrayBuffer {
  return new Uint8Array(b).buffer;
}

describe('detectFormat', () => {
  it('detects PNG from its 8-byte signature', () => {
    expect(detectFormat(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('png');
  });
  it('detects JPEG from FF D8 FF', () => {
    expect(detectFormat(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0))).toBe('jpeg');
  });
  it('detects WebP from RIFF....WEBP', () => {
    expect(detectFormat(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50))).toBe('webp');
  });
  it('detects AVIF from ftyp box brand "avif"', () => {
    expect(detectFormat(bytes(0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66))).toBe('avif');
  });
  it('detects HEIC from ftyp box brand "heic"', () => {
    expect(detectFormat(bytes(0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63))).toBe('heic');
  });
  it('returns unknown for unrecognized bytes', () => {
    expect(detectFormat(bytes(0, 1, 2, 3, 4, 5, 6, 7))).toBe('unknown');
  });
});
