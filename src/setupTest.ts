(global as any).setImmediate = (
  cb: (...args: any[]) => void,
  ...args: any[]
) => {
  return setTimeout(cb, 0, ...args);
};
