declare global {
  interface Window {
    __instant?: boolean;
    __forceError?: boolean;
  }
}

export {};
