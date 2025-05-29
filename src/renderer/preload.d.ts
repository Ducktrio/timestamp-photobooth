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
    };
  }
}

export {};
