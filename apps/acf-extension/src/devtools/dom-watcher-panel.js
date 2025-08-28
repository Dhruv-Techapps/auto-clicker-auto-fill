// DevTools panel for DOM Watcher monitoring and control

let port = null;
let watcherStatus = null;
let logEntries = [];

// Initialize the panel
function initPanel() {
  // Connect to the background script
  port = chrome.runtime.connect({ name: 'dom-watcher-devtools' });

  // Listen for messages from background/content scripts
  port.onMessage.addListener(handleMessage);

  // Request initial status
  requestWatcherStatus();

  // Set up periodic status updates
  setInterval(requestWatcherStatus, 2000);

  addLogEntry('DevTools panel initialized', 'info');
}

// Handle messages from background/content scripts
function handleMessage(message) {
  switch (message.type) {
    case 'WATCHER_STATUS':
      updateWatcherStatus(message.data);
      break;
    case 'WATCHER_LOG':
      addLogEntry(message.data.message, message.data.level);
      break;
    default:
      addLogEntry(`Unknown message type: ${message.type}`, 'warning');
  }
}

// Request current watcher status
function requestWatcherStatus() {
  if (port) {
    port.postMessage({ type: 'GET_WATCHER_STATUS' });
  }
}

// Update the UI with watcher status
function updateWatcherStatus(status) {
  watcherStatus = status;

  const statusElement = document.getElementById('watcherStatus');
  const actionCountElement = document.getElementById('actionCount');
  const watchedActionsElement = document.getElementById('watchedActions');

  // Update status indicator
  if (status.isActive) {
    statusElement.innerHTML = `
            <span class="status-indicator status-active"></span>
            <span>Active - Watching ${status.watchedActionsCount} action(s)</span>
        `;
  } else if (status.watchedActionsCount > 0) {
    statusElement.innerHTML = `
            <span class="status-indicator status-paused"></span>
            <span>Paused - ${status.watchedActionsCount} action(s) registered</span>
        `;
  } else {
    statusElement.innerHTML = `
            <span class="status-indicator status-inactive"></span>
            <span>Inactive - No actions being watched</span>
        `;
  }

  // Update action count
  actionCountElement.textContent = status.watchedActionsCount || 0;

  // Update watched actions list
  if (status.watchedActions && status.watchedActions.length > 0) {
    watchedActionsElement.innerHTML = status.watchedActions
      .map(
        (action) => `
            <div class="watched-action">
                <div class="watched-action-header">${action.name}</div>
                <div class="watched-action-details">
                    ID: ${action.id}<br>
                    Processed: ${action.processedCount} elements<br>
                    Started: ${new Date(action.startTime).toLocaleTimeString()}<br>
                    Debounce: ${action.settings.debounceMs}ms | 
                    Max Repeats: ${action.settings.maxRepeats} | 
                    Visibility Check: ${action.settings.visibilityCheck ? 'Yes' : 'No'}
                </div>
            </div>
        `
      )
      .join('');
  } else {
    watchedActionsElement.innerHTML = '<div class="no-actions">No actions are currently being watched</div>';
  }

  // Update button states
  updateButtonStates(status);
}

// Update button enabled/disabled states
function updateButtonStates(status) {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const stopBtn = document.getElementById('stopBtn');
  const clearBtn = document.getElementById('clearBtn');

  if (status.watchedActionsCount === 0) {
    // No actions registered
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    clearBtn.disabled = true;
  } else if (status.isActive) {
    // Active watching
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    stopBtn.disabled = false;
    clearBtn.disabled = false;
  } else {
    // Paused or stopped
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    stopBtn.disabled = false;
    clearBtn.disabled = false;
  }
}

// Control functions
function startWatcher() {
  sendWatcherCommand('START');
  addLogEntry('Starting DOM watcher', 'info');
}

function pauseWatcher() {
  sendWatcherCommand('PAUSE');
  addLogEntry('Pausing DOM watcher', 'info');
}

function resumeWatcher() {
  sendWatcherCommand('RESUME');
  addLogEntry('Resuming DOM watcher', 'info');
}

function stopWatcher() {
  sendWatcherCommand('STOP');
  addLogEntry('Stopping DOM watcher', 'info');
}

function clearWatcher() {
  if (confirm('Are you sure you want to clear all watched actions? This will stop DOM watching.')) {
    sendWatcherCommand('CLEAR');
    addLogEntry('Cleared all watched actions', 'warning');
  }
}

// Send command to watcher
function sendWatcherCommand(command) {
  if (port) {
    port.postMessage({
      type: 'WATCHER_COMMAND',
      command: command
    });
  }
}

// Refresh status manually
function refreshStatus() {
  requestWatcherStatus();
  addLogEntry('Status refreshed manually', 'info');
}

// Add log entry to the debug log
function addLogEntry(message, level = 'debug') {
  const timestamp = new Date().toLocaleTimeString();
  const entry = {
    timestamp,
    message,
    level
  };

  logEntries.push(entry);

  // Keep only last 100 entries
  if (logEntries.length > 100) {
    logEntries = logEntries.slice(-100);
  }

  updateLogDisplay();
}

// Update the log display
function updateLogDisplay() {
  const logElement = document.getElementById('debugLog');

  logElement.innerHTML = logEntries
    .map(
      (entry) => `
        <div class="log-entry log-${entry.level}">
            [${entry.timestamp}] ${entry.message}
        </div>
    `
    )
    .join('');

  // Auto-scroll to bottom
  logElement.scrollTop = logElement.scrollHeight;
}

// Clear debug log
function clearLog() {
  logEntries = [];
  updateLogDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPanel);

// Handle panel disconnect
window.addEventListener('beforeunload', () => {
  if (port) {
    port.disconnect();
  }
});
