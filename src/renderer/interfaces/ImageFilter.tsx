import { TMatColorMatrix } from "fabric";

type Blend = {
  color: string; // hexadecimal;
  mode?:
    | "multiply"
    | "add"
    | "difference"
    | "screen"
    | "subtract"
    | "darken"
    | "lighten"
    | "overlay"
    | "exclusion"
    | "tint"; // "multiply" | "add" | "difference" | "screen" | "subtract" | "darken" | "lighten" | "overlay" | "exclusion" | "tint"
  alpha?: number;
};

type ColorMatrix = {
  matrix: TMatColorMatrix; // array of 20 floats; Numbers in positions 4, 9, 14, 19 loose meaning outside the -1, 1 range. 0.0039215686 is the part of 1 that get translated to 1 in 2d
};

export interface ImageFilter {
  /**
   * grayscale filter
   * @type {boolean}
   */
  grayscale?: {
    mode: string; // 'average' | 'lightness' | 'luminosity';
  };

  /**
   * sepia filter. This is basically applying color matrix but predefined from Fabricjs for Sepia
   * @type {boolean}
   */
  sepia?: boolean;

  /**
   * polaroid filter. This is basically applying color matrix but predefined from Fabricjs for Polaroid effect
   * @type {boolean}
   */
  polaroid?: boolean;

  /**
   * black & white filter. This is basically applying color matrix but predefined from Fabricjs for Black and White
   * @type {boolean}
   */
  blackwhite?: boolean;

  /**
   * Brownie filter. This is basically applying color matrix but predefined from Fabricjs for Brownie
   * @type {boolean}
   */
  brownie?: boolean;

  /**
   * Kodachrome filter. This is basically applying color matrix but predefined from Fabricjs for Kodachrome
   * @type {boolean}
   */
  kodachrome?: boolean;

  /**
   * Technicolor filter. This is basically applying color matrix but predefined from Fabricjs for Technicolor
   * @type {boolean}
   */
  technicolor?: boolean;

  /**
   * Vintage filter. This is basically applying color matrix but predefined from Fabricjs for Vintage
   * @type {boolean}
   */
  vintage?: boolean;

  /**
   * blend filter
   * @param {string} color in hex
   * @param {string} mode "multiply" | "add" | "difference" | "screen" | "subtract" | "darken" | "lighten" | "overlay" | "exclusion" | "tint"
   * @param {number} alpha strength of blend color operation
   */
  blend?: Blend[];

  /** Operates image pixels with this kernel
   * @type {ColorMatrix}
   */
  colorMatrix?: ColorMatrix;

  /**
   * apply linear blur
   * @param {number} blur percentange ranging from 0 - 1, in percentage of image dimension
   * @param {boolean} horizontal
   * @param {number} aspectRatio
   */
  blur?: {
    blur: number;
    horizontal: boolean;
    aspectRatio: number;
  };

  /**
   * apply contrast
   * @type {number} ranging from -1 to 1
   */
  contrast?: number;

  /**
   *
   * 0.01 - 2.2
   */
  gamma?: {
    gamma: [number, number, number];
    r: Uint8Array;
    g: Uint8Array;
    b: Uint8Array;
  };

  /**
   * hue rotation filter
   */
  hueRotation?: {
    rotation: number; // -1 to 1
    matrix: TMatColorMatrix; // array of 20 floats
  };

  /** noise filter
   * @type {number}
   */
  noise?: number;

  /**
   * pixelate filter
   * value is number of block size
   * @type {number}
   */
  pixelate?: number;

  /**
   * saturation filter
   * range from -1 to 1
   * @type {number}
   */
  saturation?: number;

  /**
   * apply vibrance
   * range from -1 to 1
   * @type {number}
   */
  vibrance?: number;
}

export interface FilterPreset {
  name: string;
  preset: ImageFilter;
}
