/**
 * Extension Reload Client - Injected into background script during development
 * Listens for reload signals from the development server and reloads the extension
 */

// Only run in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Extension development reload client active');

  let reconnectTimer;
  
  function connectToReloadServer() {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('🔗 Connected to extension reload server');
      clearTimeout(reconnectTimer);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'reload') {
        console.log('🔄 Reloading extension...');
        chrome.runtime.reload();
      }
    };
    
    ws.onclose = () => {
      console.log('📡 Disconnected from reload server, attempting to reconnect...');
      // Reconnect after 2 seconds
      reconnectTimer = setTimeout(connectToReloadServer, 2000);
    };
    
    ws.onerror = (error) => {
      console.log('❌ Reload server connection error:', error);
    };
  }
  
  // Connect to the reload server
  connectToReloadServer();
}