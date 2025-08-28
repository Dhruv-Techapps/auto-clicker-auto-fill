import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';

// DevTools communication handler for DOM Watcher
export class DomWatcherDevToolsBackground {
  private devToolsPorts: Map<number, chrome.runtime.Port> = new Map();

  constructor() {
    // Listen for DevTools connections
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name === 'dom-watcher-devtools') {
        this.handleDevToolsConnection(port);
      }
    });
  }

  private handleDevToolsConnection(port: chrome.runtime.Port) {
    const tabId = port.sender?.tab?.id;
    if (!tabId) {
      console.error('DomWatcherDevTools: No tab ID in port connection');
      return;
    }

    console.log(`DomWatcherDevTools: Connected to tab ${tabId}`);
    this.devToolsPorts.set(tabId, port);

    // Handle messages from DevTools
    port.onMessage.addListener((message) => {
      this.handleDevToolsMessage(message, tabId);
    });

    // Clean up on disconnect
    port.onDisconnect.addListener(() => {
      console.log(`DomWatcherDevTools: Disconnected from tab ${tabId}`);
      this.devToolsPorts.delete(tabId);
    });
  }

  private async handleDevToolsMessage(message: any, tabId: number) {
    try {
      switch (message.type) {
        case 'GET_WATCHER_STATUS':
          await this.getWatcherStatus(tabId);
          break;
        case 'WATCHER_COMMAND':
          await this.sendWatcherCommand(tabId, message.command);
          break;
        default:
          console.warn('DomWatcherDevTools: Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('DomWatcherDevTools: Error handling message:', error);
    }
  }

  private async getWatcherStatus(tabId: number) {
    try {
      // Send message to content script to get watcher status
      const response = await chrome.tabs.sendMessage(tabId, {
        action: RUNTIME_MESSAGE_ACF.DOM_WATCHER_GET_STATUS
      });

      // Forward response to DevTools
      const port = this.devToolsPorts.get(tabId);
      if (port) {
        port.postMessage({
          type: 'WATCHER_STATUS',
          data: response || { isActive: false, watchedActionsCount: 0, watchedActions: [] }
        });
      }
    } catch (error) {
      console.error('DomWatcherDevTools: Error getting watcher status:', error);

      // Send default status on error
      const port = this.devToolsPorts.get(tabId);
      if (port) {
        port.postMessage({
          type: 'WATCHER_STATUS',
          data: { isActive: false, watchedActionsCount: 0, watchedActions: [] }
        });
      }
    }
  }

  private async sendWatcherCommand(tabId: number, command: string) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: RUNTIME_MESSAGE_ACF.DOM_WATCHER_COMMAND,
        command
      });

      // Get updated status after command
      setTimeout(() => this.getWatcherStatus(tabId), 100);
    } catch (error) {
      console.error('DomWatcherDevTools: Error sending watcher command:', error);
    }
  }

  // Send log messages to DevTools
  public sendLogToDevTools(tabId: number, message: string, level: 'debug' | 'info' | 'warning' | 'error' = 'debug') {
    const port = this.devToolsPorts.get(tabId);
    if (port) {
      port.postMessage({
        type: 'WATCHER_LOG',
        data: { message, level }
      });
    }
  }
}
