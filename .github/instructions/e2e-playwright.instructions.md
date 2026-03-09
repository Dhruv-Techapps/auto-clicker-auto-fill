---
description: E2E Playwright testing guide for acf-options-page and acf-extension
applyTo: "apps/acf-options-page/e2e/**/*.ts"
---

# E2E Playwright Testing — Auto Clicker AutoFill

## Architecture Overview

The options page (`apps/acf-options-page`) is a React + Redux app hosted at `http://localhost:4200`.
It acts as the UI for creating and managing automation configurations.

The extension (`apps/acf-extension`) runs as a Chrome extension loaded from `apps/acf-extension/dist`.
The options page is the **extension's options_page** — it communicates config changes to the extension
via Redux middleware → `StorageService.set(chrome.storage.local)` → the extension reads from
`chrome.storage.local`.

### Key Redux Flow

```
User clicks "+" button
  → dispatch(addConfig())          [config.slice.ts]
  → config added to Redux store
  → NO sync to extension yet       [middleware does NOT watch addConfig]

User enters URL and submits form
  → dispatch(updateConfig({ configId, url, name }))  [automation-new.tsx]
  → configsListenerMiddleware fires  [config.middleware.ts]
  → StorageService.set({ configs: [...] })
  → chrome.storage.local updated
  → Extension reads updated configs
```

The middleware in `config.middleware.ts` watches: `importConfigs`, `updateConfig`, `removeConfigs`,
`duplicateConfig`, `syncBatch`, `updateAction`, `reorderActions`, `removeAction`, `syncActionAddon`,
`syncWatch`, `syncSchedule`, `syncActionSettings`, `syncActionStatement`. **`addConfig` is NOT in
this list** — it only shows a toast.

---

## Test Setup — Always Use the Fixture

**Never** import from `@playwright/test` directly in E2E tests.
**Always** import from `./fixtures/extension`:

```typescript
import { test, expect } from './fixtures/extension';
```

The fixture provides:
- `context` — `chromium.launchPersistentContext` with `--load-extension` flags (required for extensions)
- `extensionId` — resolved from the background service worker URL
- `page` — a page from the persistent context

---

## Accessing Chrome Extension Storage

To verify data was written to `chrome.storage.local`, evaluate against the service worker:

```typescript
import { test, expect } from './fixtures/extension';

test('example storage check', async ({ context, extensionId }) => {
  // Get the background service worker page
  let worker = context.serviceWorkers()[0];
  if (!worker) {
    worker = await context.waitForEvent('serviceworker');
  }

  // Use the extension popup/background page to evaluate storage
  const bgPage = await context.newPage();
  await bgPage.goto(`chrome-extension://${extensionId}/_generated_background_page.html`);

  const configs = await bgPage.evaluate(() =>
    chrome.storage.local.get('ACF_CONFIGS').then((r) => r['ACF_CONFIGS'])
  );
  expect(configs).toBeDefined();
  await bgPage.close();
});
```

Alternative: use the service worker directly via `worker.evaluate()`:

```typescript
const configs = await worker.evaluate(() =>
  chrome.storage.local.get('ACF_CONFIGS').then((r) => r['ACF_CONFIGS'])
);
```

The `LOCAL_STORAGE_KEY.CONFIGS` value is `'ACF_CONFIGS'`.

---

## Route Structure

| Route | Component | Description |
|---|---|---|
| `/` | Home | Landing / welcome |
| `/automations` | Automations list | Shows all configs |
| `/automations/:automationId` | Automation | Single config detail |
| `/automations/:automationId` (new) | AutomationNew | URL entry form (config has no URL yet) |
| `/automations/:automationId` (edit) | AutomationEdit | Edit existing URL |

A newly created config has no URL → the route renders `AutomationNew` (the URL entry form).
After URL is submitted → the route renders full automation detail (`AutomationEdit` + actions).

---

## data-testid Naming Conventions

Use `data-testid` for all interactive elements targeted by tests.
Never rely on text content, CSS classes, icon classes, or layout position.

| Element | data-testid |
|---|---|
| Sidebar "+" add config button | `sidebar-add-automation` |
| Automations page "+" add config button | `automations-add-automation` |
| New automation URL input | `automation-url-input` |
| New automation URL form | `automation-url-form` |

---

## Writing Tests

### Structure

```typescript
import { test, expect } from './fixtures/extension';

test('should <expected outcome> when <condition>', async ({ page, extensionId, context }) => {
  // Arrange
  await page.goto('http://localhost:4200/automations');

  // Act
  await page.getByTestId('automations-add-automation').click();

  // Assert
  await expect(page).toHaveURL(/\/automations\/[a-f0-9-]{36}/);
});
```

### Do

- Use `page.getByTestId('...')` for element selection
- Use `page.waitForURL(...)` or `page.waitForSelector(...)` to await async navigation
- Verify chrome.storage via `worker.evaluate()` after actions that trigger middleware
- Use UUID regex `/[a-f0-9-]{36}/` to match dynamic config IDs in URLs

### Don't

- Don't hardcode extension IDs
- Don't use `page.locator('.btn-primary')` or text-based selectors for stability-critical paths
- Don't make real network/Firebase calls — stub or avoid routes that trigger them
- Don't use `any` type in test files
