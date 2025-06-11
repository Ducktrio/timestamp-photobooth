import { BrowserWindow } from 'electron';
import { CameraDriver } from '../drivers/camera';
import { WebSocketServer } from 'ws';

export const ViewfinderService = (window: BrowserWindow) => {
  const wss = new WebSocketServer({ port: 8080 });
  console.log('socket opened');

  wss.on('connection', async (ws) => {
    console.log('socket new client');
    let buffer = Buffer.alloc(0);

    CameraDriver.start_stream((chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      if (buffer.length > 1024)
        if (buffer.includes(Buffer.from([0xff, 0xd9]))) {
          window.webContents.send('stream', buffer);
          buffer = Buffer.alloc(0);
        }
    });

    ws.on('close', async () => {
      console.log('a socket client disconnected');
      await CameraDriver.stop_stream();
    });
  });
  wss.on('close', () => {
    console.log('socket closed');
  });
  return;
};
