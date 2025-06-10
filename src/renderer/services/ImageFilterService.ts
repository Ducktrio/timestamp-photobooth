import { FabricImage, filters } from 'fabric';
import API from '../modules/API';
import { FilterPreset } from '../interfaces/ImageFilter';

const api = new API(window.electron.config.BOOTH_TOKEN);
export default class ImageFilterService {
  static async getFilters() {
    const presets: FilterPreset[] = [
      {
        name: 'None',
        preset: {},
      },
    ];
    await api
      .get<FilterPreset[]>('filters')
      .then((Response) => {
        Response.forEach((x) => presets.push(x));
      })
      .catch((error) => {
        throw error;
      });

    return presets;
  }

  static applyFilter(preset: FilterPreset, image: FabricImage) {
    const filter = new filters.Composed({
      subFilters: [],
    });

    // Color matrix preset
    if (preset.preset.sepia) {
      filter.subFilters.push(new filters.Sepia());
    }
    if (preset.preset.brownie) {
      filter.subFilters.push(new filters.Brownie());
    }
    if (preset.preset.blackwhite) {
      filter.subFilters.push(new filters.BlackWhite());
    }
    if (preset.preset.vintage) {
      filter.subFilters.push(new filters.Vintage());
    }
    if (preset.preset.polaroid) {
      filter.subFilters.push(new filters.Polaroid());
    }
    if (preset.preset.kodachrome) {
      filter.subFilters.push(new filters.Kodachrome());
    }
    if (preset.preset.technicolor) {
      filter.subFilters.push(new filters.Technicolor());
    }
    if (preset.preset.pixelate) {
      filter.subFilters.push(
        new filters.Pixelate({ blocksize: preset.preset.pixelate })
      );
    }
    if (preset.preset.noise) {
      filter.subFilters.push(new filters.Noise({ noise: preset.preset.noise }));
    }
    if (preset.preset.saturation) {
      filter.subFilters.push(
        new filters.Saturation({ saturation: preset.preset.saturation })
      );
    }
    if (preset.preset.vibrance) {
      filter.subFilters.push(
        new filters.Vibrance({ vibrance: preset.preset.vibrance })
      );
    }
    if (preset.preset.hueRotation) {
      filter.subFilters.push(
        new filters.HueRotation({
          rotation: preset.preset.hueRotation.rotation,
          matrix: preset.preset.hueRotation.matrix,
        })
      );
    }
    if (preset.preset.gamma) {
      filter.subFilters.push(
        new filters.Gamma({ gamma: preset.preset.gamma.gamma })
      );
    }
    if (preset.preset.grayscale) {
      filter.subFilters.push(new filters.Grayscale());
    }
    if (preset.preset.colorMatrix) {
      filter.subFilters.push(
        new filters.ColorMatrix({ matrix: preset.preset.colorMatrix })
      );
    }
    if (preset.preset.blur) {
      filter.subFilters.push(
        new filters.Blur({
          blur: preset.preset.blur.blur,
          aspectRatio: preset.preset.blur.aspectRatio,
          horizontal: preset.preset.blur.horizontal,
        })
      );
    }
    if (preset.preset.contrast) {
      filter.subFilters.push(
        new filters.Contrast({
          contrast: preset.preset.contrast,
        })
      );
    }
    if (preset.preset.blend) {
      preset.preset.blend.forEach((x) => {
        filter.subFilters.push(
          new filters.BlendColor({
            alpha: x.alpha,
            mode: x.mode,
            color: x.color,
          })
        );
      });
    }

    console.log(filter);

    image.filters = [filter];
    image.applyFilters();
  }
}
