/** Formats the engine can OUTPUT (all browser-encodable, AVIF via WASM). */
export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif';

/** Formats the engine can INPUT (adds HEIC, decoded via lazy WASM). */
export type InputFormat = OutputFormat | 'heic' | 'unknown';

export interface ResizeOptions {
  /** Target width in px. If only one of width/height is set, aspect ratio is preserved. */
  width?: number;
  height?: number;
}

export interface ConvertOptions {
  to: OutputFormat;
  /** Lossy quality 0..1 (ignored for png). Default 0.82. */
  quality?: number;
  resize?: ResizeOptions;
  /** If set, the engine searches quality to land at or under this many bytes (lossy formats only). */
  targetBytes?: number;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  format: OutputFormat;
}
