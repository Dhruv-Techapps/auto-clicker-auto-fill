declare global {
  interface Window {
    OTEL_NAME: string;
    OTEL_VERSION: string;
  }
}
export {};
