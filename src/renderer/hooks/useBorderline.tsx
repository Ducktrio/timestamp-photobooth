import Frame from 'renderer/interfaces/Frame';

/**
 * Define width and height for a rectangle inside HTMLCanvasElement.
 * Use Frame object to measure ratio
 * Intended for PhaseFive
 */
export default function useBorderline(frame: Frame, canvas: HTMLCanvasElement) {
  const layout = frame.layouts[0];

  const maxHeight = canvas.height;
  const maxWidth = canvas.width;

  const ratio = layout.Height / layout.Width;

  const width = maxHeight / ratio;
  const height = maxWidth * ratio;

  if ((ratio >= 1 && width <= maxWidth) || (ratio < 1 && height > maxHeight))
    return [width, maxHeight];
  if ((ratio >= 1 && width > maxWidth) || (ratio < 1 && height <= maxHeight))
    return [maxWidth, height];
}
