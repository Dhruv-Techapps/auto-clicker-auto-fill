export type ManifestResult = Partial<chrome.runtime.Manifest>;

export type ManifestValuesProps = string[];

export interface ManifestRequest {
  messenger: 'manifest';
  methodName: 'values' | 'value';
  message: string | ManifestValuesProps;
}
