declare global {
  interface Window {
    snap: any; // Midtrans API
    config: {
      BOOTH_TOKEN: string;
    };
  }
}

export {};
