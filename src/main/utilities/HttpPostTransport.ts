import TransportStream from 'winston-transport';
import axios, { AxiosRequestHeaders } from 'axios';

interface HttpPostTransportOptions
  extends TransportStream.TransportStreamOptions {
  endpoint: string;
  headers?: {};
  batch?: boolean;
  flushInterval?: number;
}

interface LogPayload {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

export class HttpPostTransport extends TransportStream {
  private endpoint: string;
  private headers: {};
  private batch: boolean;
  private buffer: LogPayload[] = [];
  private timer?: NodeJS.Timeout;
  private flushInterval: number;

  constructor(opts: HttpPostTransportOptions) {
    super(opts);

    this.endpoint = opts.endpoint;
    this.headers = opts.headers!;
    this.batch = opts.batch ?? false;
    this.flushInterval = opts.flushInterval ?? 5000;

    if (this.batch) {
      this.timer = setInterval(() => this.flush(), this.flushInterval);
    }
  }

  log(info: any, callback: () => void): void {
    setImmediate(() => this.emit('logged', info));

    if (info.level === 'trace' || info.level === 'debug') return;

    const logPayload: LogPayload = {
      level: info.level,
      message: info.message,
      timestamp: new Date().toISOString(),
      ...info.meta, // optional additional fields
    };

    if (this.batch) {
      this.buffer.push(logPayload);
    } else {
      axios
        .post(this.endpoint, logPayload, { headers: this.headers })
        .catch((err) => {
          console.error('[HttpPostTransport] Failed to send log:', err.message);
        });
    }

    callback();
  }

  flush(): void {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer.length = 0;

    axios
      .post(this.endpoint, logsToSend, { headers: this.headers })
      .catch((err) => {
        console.error('[HttpPostTransport] Failed to flush logs:', err.message);
      });
  }

  close(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.flush();
    }
  }
}
