import Frame from 'renderer/interfaces/Frame';

/**
 * Define width and height for a rectangle inside HTMLCanvasElement.
 * Use Frame object to measure ratio
 * Intended for PhaseFive
 */
export default function useBorderline(frame: Frame, height: number) {
  const layout = frame.layouts[0];

  const maxHeight = height;

  const ratio = layout.Height / layout.Width;

  const width = maxHeight / ratio;

  return [width, maxHeight];
}
