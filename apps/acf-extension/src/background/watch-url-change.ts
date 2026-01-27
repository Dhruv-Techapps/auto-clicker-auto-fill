// ...existing code...

import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';

if (chrome.webNavigation) {
  /**
   * Listen for URL changes in SPAs/PWAs using webNavigation API
   */
  // Replaces the previous firstNavigationMap approach with a per-tab last URL & debounce
  const lastUrlByTab = new Map<number, string>();
  const debounceTimers = new Map<number, ReturnType<typeof setTimeout>>();

  const isTrackableUrl = (url?: string) => {
    if (!url) return false;
    // Track http(s) and file URLs; ignore extension/internal protocols
    return /^(https?:|file:)/.test(url) && !url.startsWith('chrome-extension://');
  };

  const scheduleUrlChange = (tabId: number, delayMs = 250) => {
    const prev = debounceTimers.get(tabId);
    if (prev) clearTimeout(prev);
    const timer = setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: RUNTIME_MESSAGE_ACF.URL_CHANGE }, () => {
        // Swallow "Receiving end does not exist" when no content script is injected
        void chrome.runtime.lastError;
      });
      debounceTimers.delete(tabId);
    }, delayMs);
    debounceTimers.set(tabId, timer);
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // Only handle main frame updates
    if (details.frameId !== 0 || !isTrackableUrl(details.url)) return;

    const last = lastUrlByTab.get(details.tabId);
    // Initialize on first event for the tab; do not emit
    if (last === undefined) {
      lastUrlByTab.set(details.tabId, details.url);
      return;
    }
    // Only emit when URL actually changed
    if (last !== details.url) {
      lastUrlByTab.set(details.tabId, details.url);
      scheduleUrlChange(details.tabId);
    }
  });

  // Optionally also react to hash-only changes (SPA routers sometimes use fragments)
  chrome.webNavigation.onReferenceFragmentUpdated.addListener((details) => {
    if (details.frameId !== 0 || !isTrackableUrl(details.url)) return;

    const last = lastUrlByTab.get(details.tabId);
    if (last !== details.url) {
      lastUrlByTab.set(details.tabId, details.url);
      scheduleUrlChange(details.tabId);
    }
  });

  // Clean up maps when tabs go away or are replaced
  chrome.tabs.onRemoved.addListener((tabId) => {
    lastUrlByTab.delete(tabId);
    const t = debounceTimers.get(tabId);
    if (t) clearTimeout(t);
    debounceTimers.delete(tabId);
  });
  chrome.tabs.onReplaced.addListener((_addedTabId, removedTabId) => {
    lastUrlByTab.delete(removedTabId);
    const t = debounceTimers.get(removedTabId);
    if (t) clearTimeout(t);
    debounceTimers.delete(removedTabId);
  });
}
// ...existing code...
