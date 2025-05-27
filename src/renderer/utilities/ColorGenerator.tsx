import { themeFromImage } from '@material/material-color-utilities';

export async function generateColor(image: HTMLImageElement) {
  return await themeFromImage(image)
    .then((value) => {
      const obj: Record<string, number> = value.schemes.light.toJSON();
      // Formula from Material UI guide page
      obj['surfaceContainerLowest'] = value.palettes.neutral.tone(100);
      obj['surfaceContainerLow'] = value.palettes.neutral.tone(96);
      obj['surfaceContainer'] = value.palettes.neutral.tone(92);
      obj['surfaceContainerHigh'] = value.palettes.neutral.tone(87);
      obj['surfaceContainerHighest'] = value.palettes.neutral.tone(81);

      return obj;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

/** Apply style property to :root of document.
 *
 * Only call this function on a module inside DOM runtime */
export function applyColors(colors: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}
