import Frame, { Layout } from '../interfaces/Frame';
import { FilterPreset } from '../interfaces/ImageFilter';
import ImageFilterService from '../services/ImageFilterService';
import * as Fabric from 'fabric';

declare module 'fabric' {
  interface SerializedObjectProps {
    id?: string;
    name?: string;
  }
  interface SerializedImageProps {
    id?: string;
    name?: string;
  }
}

Fabric.FabricObject.customProperties = ['name', 'id'];

/**
 * Tools to position pictures in a frame as HTML canvas
 * @param {HTMLDivElement} container - A reference to the element containing the canvas
 * @param {HTMLCanvasElement} canvas - Reference to the canvas element
 * @param {Frame} frame - Frame to use
 */
export default class Canvasor {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private frame: Frame;
  private _scalingFactor: number = 1;
  // @ts-ignore
  private fabricCanvas: Fabric.Canvas;

  constructor(
    container: HTMLDivElement,
    canvas: HTMLCanvasElement,
    frame: Frame
  ) {
    this.container = container;
    this.canvas = canvas;
    this.frame = frame;
  }

  /**
   * Creates new canvas and attach the frame to it.
   * If a reset is needed for the canvas, consider to call "dispose()" from the Fabric.Canvas object first, then set the object to this function returns
   * @returns {Fabcric.Canvas, number} canvas object and scaling factor
   */
  public async create(): Promise<void> {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.frame.url as string;

      img.onload = () => {
        try {
          const { naturalWidth, naturalHeight } = img;

          this.fabricCanvas = new Fabric.Canvas(this.canvas, {
            width: naturalWidth,
            height: naturalHeight,
            selection: false,
          });

          Fabric.FabricImage.fromURL(this.frame.url as string)
            .then((img) => {
              img.set({
                hasBorders: false,
                top: 0,
                left: 0,
                hasControls: false,
                selectable: false,
                dirty: true,
                type: 'frame',
                name: 'frame',
              });
              img.name = 'frame';

              this.fabricCanvas.add(img);
              this.fabricCanvas.bringObjectToFront(img);
            })
            .catch((error) => {
              throw error;
            });
          this.fabricCanvas.renderAll();
          this.scaleCanvas(this.container, naturalWidth, naturalHeight);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (event, source) => {
        reject(`${event} ${source}`);
      };
    });
  }

  private scaleCanvas(
    container: HTMLDivElement,
    imgWidth: number,
    imgHeight: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (container === null || container === undefined)
        reject('Contaner is null or undefined');
      if (!imgWidth || !imgHeight)
        reject('Numbers for image height or width are empty or zero');

      const canvas = this.fabricCanvas;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      const scaleX = containerWidth / imgWidth;
      const scaleY = containerHeight / imgHeight;
      this._scalingFactor = Math.min(scaleX, scaleY);

      try {
        canvas.setZoom(this._scalingFactor);
        canvas.setDimensions({
          width: imgWidth * this._scalingFactor,
          height: imgHeight * this._scalingFactor,
        });
        canvas.renderAll();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @getter
   * Scaling factor that is used for scaling canvas to fit screen size
   * @return {number} scaling factor as number
   */
  public get scalingFactor(): number {
    return this._scalingFactor;
  }

  /**
   * Insert picture to the frame given the layout object from the frame
   * @param {Fabric.Canvas} canvas - Reference to the Canvas object to be modified
   * @param {Layout} layout - layout configuration
   */
  public addPicture(layout: Layout, imageSrc: string) {
    const canvas = this.fabricCanvas;
    const clipPath = new Fabric.Rect({
      left: layout.X,
      top: layout.Y,
      width: layout.Width,
      height: layout.Height,
      absolutePositioned: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    Fabric.FabricImage.fromURL(imageSrc).then((img) => {
      const aspectRatio = img.width / img.height;
      const targetRatio = layout.Width / layout.Height;

      let scaleFactor = 1;

      if (aspectRatio > targetRatio) scaleFactor = layout.Height / img.height;
      else scaleFactor = layout.Width / img.width;

      img.scale(scaleFactor);
      img.set({
        left: layout.X - (img.width * scaleFactor - layout.Width) / 2,
        top: layout.Y - (img.height * scaleFactor - layout.Height) / 2,
        clipPath: clipPath,
      });

      canvas.add(img);
      canvas.sendObjectToBack(img);
    });
  }

  /**
   * Waits for all renders has been settled then destroy entire object and its canvas
   */
  public async dispose(): Promise<boolean | void> {
    try {
      return Promise.resolve(await this.fabricCanvas.dispose());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Converts current canvas as object
   */
  public serialize() {
    return JSON.stringify(this.fabricCanvas);
  }

  public async deserialize(state: string) {
    return await this.fabricCanvas
      .loadFromJSON(state, (o, object) => {
        object.toObject().selectable = false;
        o.scalable = false;
      })
      .then(() => {
        this.fabricCanvas.getObjects().forEach((obj) => {
          obj.set({
            selectable: false,
            eventable: false,
          });
        });
        this.fabricCanvas.requestRenderAll();
      })
      .catch((error) => {
        throw error;
      });
  }

  public toObject() {
    return this.fabricCanvas.toObject([]);
  }

  /**
   * Prepare for export to binary data. Converts into Data URL
   * @param {number} originalHeight original height of the frame or canvas before scaled
   * @param {number} originalWidth original width of the frame or canvas before scaled
   * @returns {Promise<string | void>} resolves with string of data url, otherwise rejects with error
   */
  public async export(
    originalWidth: number,
    originalHeight: number
  ): Promise<string | void> {
    const cloneCanvas = await this.fabricCanvas.clone([]);
    cloneCanvas.setDimensions({
      width: originalWidth,
      height: originalHeight,
    });
    cloneCanvas.renderAll();
    const url = cloneCanvas.toDataURL({
      format: 'jpeg',
      quality: 1.0,
    } as Fabric.TDataUrlOptions);
    return url;
  }

  /**
   * replicate current canvas to its right side
   * @returns {Fabric.Canvas} as clone
   */
  public async replicateAndExport(url: string, width: number, height: number) {
    return await new Promise<string>((resolve) => {
      Fabric.FabricImage.fromURL(url).then(async (img) => {
        const newCanvas = new Fabric.StaticCanvas(undefined, {
          width: width * 2,
          height: height,
        });

        const original = await img.clone([]);
        original.set({ left: 0, top: 0 });
        newCanvas.add(original);

        const replicate = await img.clone([]);
        replicate.set({ left: width, top: 0 });
        newCanvas.add(replicate);
        newCanvas.renderAll();

        resolve(
          newCanvas.toDataURL({
            format: 'jpeg',
            quality: 1.0,
          } as Fabric.TDataUrlOptions)
        );
      });
    });
  }

  /**
   * Apply filter to every object in canvas except for object name "frame"
   * @param {FilterPreset} preset object to apply
   */
  public async applyFilter(preset: FilterPreset) {
    this.fabricCanvas.getObjects().forEach((object) => {
      if (object.name === 'frame') return;
      if (object.isType('image') || object.isType('Image')) {
        ImageFilterService.applyFilter(preset, object as Fabric.FabricImage);
      }
    });
    this.fabricCanvas.renderAll();
  }
}
