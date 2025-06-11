import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      config: {
        BOOTH_TOKEN: string;
        SNAP_SCRIPT: string;
        ENV: string;
      };
      onStream: (callback: (chunk: Uint8Array) => void) => void;

      camera: {
        status(): Promise<void>;
        capture(): Promise<void>;
      };
      media: {
        /**
         * @param {string} url - url representation of the data | buffer | blob
         */
        saveMotion(url: string): void;

        /**
         * Starts video render procedure to backend
         */
        renderVideo(): Promise<void>;

        /**
         * Save canvas
         */
        saveCanvas(url: string): void;

        /**
         * Invoke upload call
         * @param {number} imageCount - number of preserved space for download (canvas + pictures)
         * @param {string[]} captures - list of absolute path of captured pictures
         */
        upload(imageCount: number, captures: string[]): Promise<string>;

        /**
         * Invoke print procedure
         * @param {string} url - url representation of the canvas
         * @param {number} quantity - number of prints
         * @param {boolean} split - split the paper or not
         */
        print(url: string, quantity: number, split: boolean): void;
      };
      session: {
        /**
         * Begin new session
         */
        begin(): Promise<void>;
      };
      file: {
        getCaptures(): Promise<string[]>;
        getVideo(): Promise<string>;
      };
    };
  }
}

export {};
