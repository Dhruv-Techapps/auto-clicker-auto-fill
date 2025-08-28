// DevTools extension to register DOM Watcher panel

// Register the DOM Watcher panel
chrome.devtools.panels.create(
  'DOM Watcher',
  '', // No icon for now
  'dom-watcher-panel.html',
  (panel) => {
    console.log('DOM Watcher panel created');

    // Handle panel shown/hidden events
    panel.onShown.addListener((window) => {
      console.log('DOM Watcher panel shown');
    });

    panel.onHidden.addListener(() => {
      console.log('DOM Watcher panel hidden');
    });
  }
);
