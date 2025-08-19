/**
 * Chrome Extension Auto-Reload Script for Development
 * This script helps reload the extension during development when files change
 */

const WebSocket = require('ws');

// Simple console colors without external dependency
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
};

class ExtensionReloader {
  constructor(port = 8080) {
    this.port = port;
    this.wss = null;
    this.clients = new Set();
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log(colors.green('🔗 Extension connected to reload server'));
      
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(colors.yellow('📡 Extension disconnected from reload server'));
      });
      
      ws.on('error', (err) => {
        console.log(colors.red('❌ WebSocket error:'), err.message);
        this.clients.delete(ws);
      });
    });

    console.log(colors.blue(`🚀 Extension reload server started on port ${this.port}`));
    console.log(colors.blue('   Extensions can connect to reload automatically on file changes'));
  }

  reload() {
    if (this.clients.size === 0) {
      console.log(colors.yellow('⚠️  No extensions connected to reload server'));
      return;
    }

    console.log(colors.green(`🔄 Reloading ${this.clients.size} connected extension(s)...`));
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'reload' }));
      }
    });
  }

  stop() {
    if (this.wss) {
      this.wss.close();
      console.log(colors.yellow('🛑 Extension reload server stopped'));
    }
  }
}

module.exports = ExtensionReloader;