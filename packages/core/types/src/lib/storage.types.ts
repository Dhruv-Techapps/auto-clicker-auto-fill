// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageMessengerSetProps<T extends string | number | symbol = string, K = any> = {
  [key in T]: K;
};

export type StorageMessengerGetProps = string | string[] | StorageMessengerSetProps | null | undefined;

export type StorageMessengerRemoveProps = string | string[];

export interface StorageRequest {
  messenger: 'storage' | 'session-storage';
  methodName: 'get' | 'set' | 'remove';
  message: StorageMessengerGetProps | StorageMessengerSetProps | StorageMessengerRemoveProps;
}
