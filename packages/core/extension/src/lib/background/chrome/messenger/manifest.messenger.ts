export type ManifestResult = Partial<chrome.runtime.Manifest>;

type ManifestValuesProps = string[];

export type ManifestRequest = {
  messenger: 'manifest';
  methodName: 'values' | 'value';
  message: string | ManifestValuesProps;
};

export class ManifestMessenger {
  async values(keys: ManifestValuesProps): Promise<ManifestResult> {
    if (!keys || !Array.isArray(keys)) {
      throw new Error('Keys is not provided or not of type Array');
    }
    const result: ManifestResult = {};
    keys.forEach((key) => {
      result[key] = this.#process(key);
    });
    return { ...result };
  }

  async value(key: string): Promise<ManifestResult> {
    if (!key || typeof key !== 'string') {
      throw new Error('Key is not provided or key is not of type string');
    }
    return { [key]: this.#process(key) };
  }

  readonly #process = (key: string): string | ManifestResult => {
    let manifest: ManifestResult = chrome.runtime.getManifest();
    const keys = key.split('.');
    keys.forEach((prop) => {
      if (manifest) {
        manifest = manifest[prop];
      }
    });
    return manifest;
  };
}
