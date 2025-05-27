enum StatusCode {
  OK = 0,
  FAILED = 1,
  TIMEOUT = 2,
  ERROR = 3,
}

export interface IIpcResponse<T> {
  status: StatusCode;
  message: string;
  data?: T | null;
  headers?: object;
}

export default class IPCResponse<T> {
  status: StatusCode;
  message: string;
  data?: T | null;
  headers?: object;

  constructor(data: IIpcResponse<T>) {
    this.status = data.status;
    this.message = data.message;
    this.data = data.data;
    this.headers = data.headers;
  }

  get STATUS() {
    return this.status;
  }
  get OK() {
    return this.status === StatusCode.OK;
  }

  get FAILED() {
    return this.status === StatusCode.FAILED;
  }

  get TIMEOUT() {
    return this.status === StatusCode.TIMEOUT;
  }

  get ERROR() {
    return this.status === StatusCode.ERROR;
  }
}
