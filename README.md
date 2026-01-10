# Auto Clicker Auto Fill

Auto click, fill, and submit with AutoClicker.

Fill input fields, click buttons or links—anywhere, on any site. Easy to configure in a few steps and work like a PRO.

---

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/53bda8a642194c29bb27326df9ed5823)](https://app.codacy.com/gh/Dhruv-Techapps/auto-clicker-auto-fill/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

---

## Table of Contents

1. [Overview](#overview)
   - [acf-extension](#acf-extension)
   - [acf-i18n](#acf-i18n)
   - [acf-options-page](#acf-options-page)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Getting Started](#getting-started)
5. [Running Tasks](#running-tasks)
6. [Contributing](#contributing)
7. [Important Links](#important-links)

---

## Overview

Auto Clicker AutoFill is a Chrome extension and options page for automating repetitive browser actions. It enables users to record, configure, and replay clicks, form fills, and submissions on any website.

### acf-extension

The `acf-extension` is a Chrome extension that automates clicking, filling, and submitting actions on web pages. It includes background scripts, content scripts, a wizard for recording actions, and a DevTools panel for debugging.

### acf-i18n

The `acf-i18n` component manages language translations, ensuring the extension and options page are accessible to users worldwide.

### acf-options-page

The `acf-options-page` is a React-based configuration interface, hosted at [stable.getautoclicker.com](https://stable.getautoclicker.com), where users can manage extension settings and preferences.

---

## Features

- Automate clicks, form fills, and submissions on any website.
- Record and replay user actions with a wizard interface.
- Cross-origin messaging between extension and options page.
- Internationalization (i18n) support.
- DevTools integration for debugging.
- Secure, isolated utilities and messaging.
- Options page built with React and Vite.
- Sentry integration for error tracking.
- Firebase integration for storage and authentication.
- Modular monorepo structure with Nx for scalable development.

---

## Architecture

This project uses an Nx monorepo structure:

- **Apps**
  - `acf-extension`: Chrome extension (background, content scripts, wizard, devtools, shared logic).
  - `acf-options-page`: React options/configuration page (Vite).
  - `acf-i18n`: Internationalization resources.
- **Packages**
  - `core`: Shared utilities for extension and options page.
  - `acf`: Auto Clicker AutoFill-specific logic, events, services, and storage.
  - `shared`: Integrations (Firebase, Google, Discord, OpenAI, etc.).

See the [docs](https://getautoclicker.com/docs/4.x/getting-started/introduction/) for a full breakdown.

---

## Getting Started

Before getting started, create a new `.env` file from the provided `.env.example`.

### Prerequisites

- Node.js (LTS recommended)
- pnpm
- [Nx CLI](https://nx.dev/)

### Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Install Nx globally (if not already):**
   ```bash
   pnpm install -g nx
   ```
3. **Create .env files:** Copy `.env.example` to `.env` in both `apps/acf-extension/` and `apps/acf-options-page/`.

### Running Tasks

To serve, lint, test, and format the project, use the following Nx commands:

Serve the components:

```bash
nx serve acf-extension
```

Run linting:

```bash
nx lint
```

Run testing:

```bash
nx test
```

Check formatting:

```bash
nx format:check
```

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to get started.

- Use functional React components and ES modules.
- Utilities must not have direct DOM dependencies.
- All new features must include test coverage.
- Follow trunk-based development (small, frequent commits to main).
- Use react-i18next for localization.
- Wrap major UI surfaces with error boundaries and Sentry breadcrumbs.

## Important Links

- [Docs](https://getautoclicker.com/docs/4.x/getting-started/introduction/)
- [Blog](https://blog.getautoclicker.com/)
- **Variants:**
  - [Stable](https://stable.getautoclicker.com)
  - [Beta](https://beta.getautoclicker.com)
  - [Dev](https://dev.getautoclicker.com)
- [GitHub](https://github.com/Dhruv-Techapps)
- [Twitter](https://twitter.com/dharmeshhemaram)
- [Open Collective](https://opencollective.com/auto-clicker-autofill)
- [Discord](https://discord.gg/vmnNfWKqnR)
- [YouTube](https://www.youtube.com/@autoclickerautofill)

## License

This project is licensed under the [MIT License](LICENSE.md).

## Security

Please see [SECURITY](SECURITY.md) for security policies and reporting guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for our community standards.
