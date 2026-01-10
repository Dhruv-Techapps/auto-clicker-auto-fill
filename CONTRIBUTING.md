# Contributing Guide

Welcome, and thanks for your interest in improving Auto Clicker AutoFill! This guide explains how to propose changes, the standards we follow, and how to get help.

## Quick Start

1. Fork the repo & clone your fork.
2. Create a branch from `main` (we use trunk-based; keep it small):
   ```bash
   git checkout -b feat/dom-watch-mode
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Make changes with tests + docs.
5. Run quality gates:
   ```bash
   nx format:write
   nx lint
   nx test
   ```
6. (If building an app / package) run a build:
   ```bash
   nx build acf-extension
   ```
7. Commit & push (see commit style below) and open a PR.

## Branching & Commit Style

We prefer small, focused PRs. Use conventional-style prefixes when helpful: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `perf:`

Examples:

```
feat(extension): add DOM watch manager
fix(options): handle null selector in action table
docs: add watch mode configuration reference
```

Keep commits granular (logical units). Avoid squashing unrelated changes into one commit.

## Development Standards

- Use **TypeScript** + **ES modules** only (no `require`).
- React: functional components + hooks; prefer composition over inheritance.
- Side-effect free utilities (no direct DOM access in shared/core unless explicitly extension-scoped).
- Use existing shared packages (`packages/core`, `packages/acf`, `packages/shared/*`) instead of duplicating helpers.
- Localize user-facing strings with `react-i18next` / shared i18n resources.
- Add Sentry breadcrumbs for major flows when introducing new surfaces.
- Follow accessibility best practices (ARIA labels, keyboard navigation, focus management).

## Testing

Minimum expectations for a feature PR:

- Unit tests for pure utilities / selectors.
- Integration test (where feasible) for orchestrated behavior (e.g., action pipeline / messaging).
- Edge cases: empty input, error paths, concurrency (if relevant), and cleanup behavior.

Use `vitest` where existing patterns do; keep tests fast and deterministic. Do not rely on external network services—mock them.

Run all tests:

```bash
nx test
```

## Documentation Requirements

Every user-facing or behavioral change MUST update:

- Configuration reference under `site/src/content` (or appropriate docs section).
- Examples or guides if the change alters usage.
- `CHANGELOG.md` (add under Unreleased > Added / Fixed / Changed sections).

If adding a new configuration key, document: purpose, type, default, and example.

## Performance & Safety

- Avoid unbounded MutationObservers or intervals without teardown.
- Batch DOM mutations and heavy loops; prefer `requestAnimationFrame` or debounced queues when needed.
- Guard network calls (timeouts, retries with backoff if appropriate).
- Do not block the main thread with long synchronous loops—chunk work.

## Pull Request Checklist

Before requesting review ensure:

- [ ] All Nx tasks (lint, test, typecheck, build if relevant) succeed.
- [ ] Added/updated tests pass locally.
- [ ] Docs & changelog updated.
- [ ] No unused code / stray TODOs (unless linked to an issue).
- [ ] No `console.log` (use structured logging if necessary).
- [ ] Feature is behind a flag if it alters default behavior.

## Issue Workflow

For significant changes: open an issue first outlining motivation + approach sketch. Smaller fixes can go straight to PR. Reference issues in commit messages or PR description (`Closes #123`).

## Security & Privacy

- Don’t commit secrets (API keys, tokens). Use environment variables.
- Report vulnerabilities via our [Security Policy](SECURITY.md).
- Avoid expanding data collection scope without explicit discussion.

## Communication

Questions? Use:

- GitHub Issues (bugs / features)
- GitHub Discussions (ideas / architecture)
- Discord (quick help; see README Important Links)

## Code of Conduct

Participation in this project is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). Report unacceptable behavior to the listed contact.

## Thank You

Your contributions help automation become safer, more reliable, and more accessible for everyone. We appreciate your time and effort.
