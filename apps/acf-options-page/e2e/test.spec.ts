import { expect, test } from './fixtures';

test.describe('Test', () => {
  test('Extension ID', async ({ context, extensionId }) => {
    expect(extensionId).toBeTruthy();
    expect(extensionId.length).toBeGreaterThan(0);
    console.log('[Test] Extension loaded with ID:', extensionId);
  });
});
