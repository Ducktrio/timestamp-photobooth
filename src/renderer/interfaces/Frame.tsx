export type Layout = {
  X: number;
  Y: number;
  Width: number;
  Height: number;
};

export default interface Frame {
  /**
   * Identificaiton number for a single frame
   * @type {string}
   */
  id: string;

  /** Name of the frame
   * @type {string}
   */
  name: string;

  /** Identification number of the corresponding theme of the frame
   * @type {string}
   */
  themeId: string;

  /** Numbers of picture(s) avalailable to be pasted on the frame
   * @type {number}
   */
  count: number;

  /** Provide coordinates information for each photo template on the frame.
   * The size of the array is assumed to be equal to count, further checking is better.
   * @type {Layout[]}
   */
  layouts: Layout[];

  /** Price information of this Frame object. Guaranteed to be in Indonesian Rupiah
   * @type {number}
   */
  price: number;

  /** URL direct to the Frame resource.
   * Guaranteed to return response as PNG image file.
   * @type {string}
   */
  url?: string;

  /**
   * A condition where the size of the frame requires the printer to cut the print size, giving user two pieces of paper
   * @type {string}
   */
  split: boolean;

  /**
   * Aspect ratio of the image slot in frame
   * @type {number}
   */
  aspectRatio?: number;
}
