# Extension Development Watch Mode

This directory contains scripts and configurations for enhanced Chrome extension development with automatic reloading.

## Files

- `extension-reload-plugin.js` - Webpack plugin that starts a WebSocket server for extension reloading
- `reload-extension.js` - WebSocket server implementation for communicating with the extension
- `reload-client.js` - Client-side code (unused - integrated directly into background script)

## How It Works

1. When webpack runs in development mode, the `ExtensionReloadPlugin` starts a WebSocket server on port 8080
2. The extension's background script connects to this server when built in development mode
3. When webpack rebuilds files, the plugin sends a reload message to connected extensions
4. The extension receives the message and calls `chrome.runtime.reload()` to reload itself

## Usage

The scripts are automatically integrated when running:

```bash
npm run start
# or
npx nx serve acf-extension
```

## Development vs Production

- **Development**: WebSocket server starts, extension connects and can auto-reload
- **Production**: No WebSocket server, no reload client code included

## Ports

- WebSocket server runs on port 8080 (configurable in the plugin options)
- Make sure this port is available during development