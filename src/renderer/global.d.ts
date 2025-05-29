declare global {
  interface Window {
    snap: {
      pay: any;
      embed: any;
    }; // Midtrans API
    config: {
      BOOTH_TOKEN: string;
    };
  }
}

export {};
