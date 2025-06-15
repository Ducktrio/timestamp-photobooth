import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  reboot: (callback: () => void) => {
    ipcRenderer.on('reboot', callback);
  },
  onUpdateStatus: (callback: (status: string, data?: any) => void) => {
    ipcRenderer.on('update-status', (_event, status, data) => {
      callback(status, data);
    });
  },
  camera: {
    status: async () => {
      return await ipcRenderer.invoke('camera/status');
    },
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
    begin: async () => await ipcRenderer.invoke('session/begin'),
    end: async () => await ipcRenderer.invoke('session/end'),
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
        : 'https://app.sandbox.midtrans.com/snap/snap.js', // TODO: CHANGE THIS WHEN MIDTRANS ISSUE RESOLVED
    ENV: process.env.NODE_ENV,
    BORDER_COLOR: process.env.BORDER_COLOR,
  },
  logger: {
    error(message: string, meta?: Record<string, any>) {
      ipcRenderer.send('log/error', { message, meta });
    },
    warn(message: string, meta?: Record<string, any>) {
      ipcRenderer.send('log/warn', { message, meta });
    },
    info(message: string, meta?: Record<string, any>) {
      ipcRenderer.send('log/info', { message, meta });
    },
  },
  onStream: (callback: (chunk: Uint8Array) => void) =>
    ipcRenderer.on('stream', (_, frame) => callback(frame)),
});
