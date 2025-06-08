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
      };
      session: {
        /**
         * Begin new session
         */
        begin(): Promise<void>;
      };
      file: {
        getCaptures(): Promise<string[]>;
      };
    };
  }
}

export {};
