export interface RuntimeMessageRequest<T = undefined> {
  messenger: string;
  methodName: string;
  message?: T;
}
