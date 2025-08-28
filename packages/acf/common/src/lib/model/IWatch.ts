export enum EWatchRestartMode {
  SINGLE = 'single', // Re-execute only this action (default)
  SEQUENCE = 'sequence', // Restart from this action and continue sequence
  FULL = 'full' // Restart entire action sequence from beginning
}

export const defaultWatchSettings: IWatchSettings = {
  watchEnabled: false,
  watchRootSelector: 'body',
  debounce: 1,
  maxRepeats: 1,
  visibilityCheck: false,
  restartMode: EWatchRestartMode.SINGLE,
  lifecycleStopConditions: {
    timeout: 30 * 1000, // 30 minutes
    urlChange: true
  }
};

// Action Watch Settings
export interface IWatchSettings {
  watchEnabled?: boolean; // Enable DOM watching for this action
  watchRootSelector?: string; // Container to observe (default: 'body')
  debounce?: number; // Debounce delay in seconds (default: 1)
  maxRepeats?: number; // Max times to process same element (default: 1)
  visibilityCheck?: boolean; // Only process visible elements (default: false)
  restartMode?: EWatchRestartMode; // How to restart when triggered (default: SINGLE)
  lifecycleStopConditions?: {
    // Auto-stop conditions
    timeout?: number; // Stop after N seconds
    maxProcessed?: number; // Stop after N elements processed
    urlChange?: boolean; // Stop on URL change (default: true)
  };
}
