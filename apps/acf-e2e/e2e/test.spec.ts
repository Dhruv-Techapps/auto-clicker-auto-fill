import { expect, pageTest as test } from './fixtures';

test.describe('Test', () => {
  test('Extension ID', async ({ extensionId }) => {
    expect(extensionId).toBeTruthy();
    expect(extensionId.length).toBeGreaterThan(0);
    console.log('[Test] Extension loaded with ID:', extensionId);
  });
});
