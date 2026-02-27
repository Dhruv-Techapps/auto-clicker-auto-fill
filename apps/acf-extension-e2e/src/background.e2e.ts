import { expect, test } from '../fixtures/extension';

test.describe('Extension Background', () => {
  test('should have active service worker when extension is loaded', async ({
    context,
  }) => {
    const workers = context.serviceWorkers();

    expect(workers.length).toBeGreaterThan(0);
  });

  test('should register service worker with valid chrome-extension URL when extension loads', async ({
    context,
  }) => {
    const [worker] = context.serviceWorkers();

    expect(worker.url()).toMatch(/^chrome-extension:\/\/[a-z]{32}\//);
  });
});
