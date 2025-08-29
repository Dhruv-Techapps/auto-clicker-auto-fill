export const defaultWatchSettings: IWatchSettings = {
  watchEnabled: false,
  watchRootSelector: 'body',
  debounce: 1,
  lifecycleStopConditions: {
    timeout: 30, // 30 minutes
    urlChange: true
  }
};

// Configuration-level Watch Settings
export interface IWatchSettings {
  watchEnabled?: boolean; // Enable DOM watching for this action
  watchRootSelector?: string; // Container to observe (default: 'body')
  watchAttributes?: string[]; // Attributes to observe (default: ['style', 'class', 'hidden'])
  debounce?: number; // Debounce delay in seconds (default: 1)
  lifecycleStopConditions?: {
    // Auto-stop conditions
    timeout?: number; // Stop after N seconds
    maxProcessed?: number; // Stop after N elements processed
    urlChange?: boolean; // Stop on URL change (default: true)
  };
}
