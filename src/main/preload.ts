import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import logger from './utilities/logger';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  logger: {
    error(message: string, ...args: string[]) {
      logger.error(message, ...args);
    },
    warn(message: string, ...args: string[]) {
      logger.warn(message, ...args);
    },
    info(message: string, ...args: string[]) {
      logger.info(message, ...args);
    },
    trace(message: string, ...args: string[]) {
      logger.trace(message, ...args);
    },

    debug(message: string, ...args: string[]) {
      logger.debug(message, ...args);
    },
  },
  camera: {
    status: async () => ipcRenderer.invoke('camera/status'),
    async capture() {
      console.log('[MAIN] invoking capture');
      await ipcRenderer.invoke('camera/capture');
    },
  },
  file: {
    getCaptures: async () => ipcRenderer.invoke('file/getCaptures'),
    async getVideo() {
      return await ipcRenderer.invoke('file/getVideo');
    },
  },
  media: {
    saveMotion(url: string) {
      ipcRenderer.send('media/motion', url);
    },
    async renderVideo() {
      await ipcRenderer.invoke('media/render');
    },
    saveCanvas(url: string) {
      ipcRenderer.send('media/canvas', url);
    },
    print(url: string, quantity: number, split: boolean) {
      ipcRenderer.invoke('media/print', url, quantity, split);
    },
    async upload(imageCount: number, captures: string[]) {
      return await ipcRenderer.invoke('media/upload', imageCount, captures);
    },
  },
  session: {
    begin: async () => ipcRenderer.invoke('session/begin'),
  },
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  config: {
    BOOTH_TOKEN: process.env.BOOTH_TOKEN,
    SNAP_SCRIPT:
      process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'
        ? 'https://app.sandbox.midtrans.com/snap/snap.js'
        : null,
    ENV: process.env.NODE_ENV,
  },
  onStream: (callback: (chunk: Uint8Array) => void) =>
    ipcRenderer.on('stream', (_, frame) => callback(frame)),
});
