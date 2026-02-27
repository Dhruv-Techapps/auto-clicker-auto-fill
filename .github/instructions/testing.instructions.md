---
applyTo: "**/*.spec.ts,**/*.e2e.ts,**/e2e/**/*.ts"
---

# Testing Standards for auto-clicker-auto-fill

## Always
- Use Vitest for unit tests, Playwright for E2E
- Mock all `chrome.*` APIs — never use real browser APIs in unit tests
- Use `vi.clearAllMocks()` in `beforeEach`
- Test one behavior per `it()` block
- Follow Arrange / Act / Assert structure with blank lines between sections
- Name tests as: `should <expected outcome> when <condition>`

## Never
- Don't import from `@playwright/test` directly in E2E tests — use `../fixtures/extension`
- Don't hardcode extension IDs
- Don't make real HTTP or Firebase calls in unit tests
- Don't modify source files to make tests pass
- Don't use `any` type in test files
```

---

## How to Use It

Once these three files are committed to your repo, you have **three ways** to trigger test generation:

**Option A — GitHub Issue (Copilot Coding Agent):**
Create an issue and assign it to Copilot:
```
Title: Set up E2E testing with Playwright and write unit tests for acf-extension

Body:
Please set up the complete E2E test infrastructure using Playwright for the acf-extension 
app, then write unit tests for the background service worker and content scripts.

Acceptance criteria:
- apps/acf-extension-e2e/ scaffolded with playwright.config.ts, project.json, and extension fixture
- Unit tests written for apps/acf-extension/src/background/ and apps/acf-extension/src/content/
- All tests pass: `nx test acf-extension` and `nx e2e acf-extension-e2e`
- No source files modified
```

**Option B — VS Code Chat with @test-agent:**
```
@test-agent Write unit tests for apps/acf-extension/src/background/index.ts
@test-agent Set up the E2E scaffold and write popup tests
@test-agent Write content script tests for the auto-fill logic
```

**Option C — Copilot Chat (inline):**
```
/test Write tests for this file following the project's vitest standards
