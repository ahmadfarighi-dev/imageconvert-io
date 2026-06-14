import type { ResizeOptions } from './types';

export function calcDimensions(
  srcW: number,
  srcH: number,
  resize: ResizeOptions | undefined,
): { width: number; height: number } {
  if (!resize || (resize.width == null && resize.height == null)) {
    return { width: srcW, height: srcH };
  }
  let width = resize.width;
  let height = resize.height;
  if (width != null && height == null) {
    height = Math.round((width / srcW) * srcH);
  } else if (height != null && width == null) {
    width = Math.round((height / srcH) * srcW);
  }
  return {
    width: Math.max(1, Math.round(width as number)),
    height: Math.max(1, Math.round(height as number)),
  };
}
