import { IWatchSettings, defaultWatchSettings } from '@dhruv-techapps/acf-common';

interface DomWatchState {
  isActive: boolean;
  observer: MutationObserver | null;
  watchSettings: IWatchSettings | null;
  debounceTimeout: number | null;
  currentUrl: string;
  startTime: number;
  sequenceRestartCallback?: () => Promise<void>;
}

const DomWatchManager = (() => {
  const state: DomWatchState = {
    isActive: false,
    observer: null,
    watchSettings: null,
    debounceTimeout: null,
    currentUrl: window.location.href,
    startTime: 0,
    sequenceRestartCallback: undefined
  };

  // Process added nodes and check if any match actions
  const processAddedNodes = async (addedNodes: NodeList): Promise<void> => {
    if (!state.watchSettings || !state.sequenceRestartCallback) {
      return;
    }

    console.debug('DomWatchManager: Restarting action sequence due to DOM changes');
    await state.sequenceRestartCallback();
  };

  // Debounced processing
  const debounceProcessing = (processingFn: () => Promise<void>, delay: number): void => {
    // Clear existing timeout
    if (state.debounceTimeout) {
      clearTimeout(state.debounceTimeout);
    }

    // Set new timeout
    state.debounceTimeout = window.setTimeout(async () => {
      try {
        await processingFn();
      } catch (error) {
        console.error('DomWatchManager: Error in debounced processing:', error);
      }
      state.debounceTimeout = null;
    }, delay);
  };

  // Check lifecycle stop conditions
  const shouldStopWatching = (): boolean => {
    if (!state.watchSettings?.lifecycleStopConditions) return false;

    const { lifecycleStopConditions } = state.watchSettings;

    // Check timeout
    if (lifecycleStopConditions.timeout) {
      const elapsed = Date.now() - state.startTime;
      if (elapsed >= lifecycleStopConditions.timeout * 60 * 1000) {
        // Convert mins to milliseconds
        console.debug('DomWatchManager: Stopping due to timeout');
        return true;
      }
    }

    // Check URL change
    if (lifecycleStopConditions.urlChange && state.currentUrl !== window.location.href) {
      console.debug('DomWatchManager: Stopping due to URL change');
      return true;
    }

    return false;
  };

  // Mutation observer callback
  const handleMutations = (mutations: MutationRecord[]): void => {
    if (!state.isActive || !state.watchSettings) {
      return;
    }

    // Check if we should stop watching
    if (shouldStopWatching()) {
      return;
    }

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Debounce the processing to avoid excessive restarts
        debounceProcessing(
          () => processAddedNodes(mutation.addedNodes),
          (state.watchSettings.debounce || 1) * 1000 // Convert seconds to milliseconds
        );
      }
    }
  };

  // Initialize the mutation observer
  const initializeObserver = (): void => {
    if (state.observer || !state.watchSettings) {
      return;
    }

    const watchRoot = state.watchSettings.watchRootSelector || 'body';
    const rootElements = document.querySelectorAll<HTMLElement>(watchRoot) || document.body;

    state.observer = new MutationObserver(handleMutations);
    rootElements.forEach((rootElement) => {
      state.observer?.observe(rootElement, {
        childList: true,
        subtree: true,
        attributes: !!state.watchSettings?.watchAttributes, // track attributes
        attributeFilter: state.watchSettings?.watchAttributes // optional optimization
      });
    });

    console.debug(`DomWatchManager: Initialized observer on ${watchRoot}`);
  };

  // Register configuration-level DOM watching
  const registerConfiguration = (watchSettings: IWatchSettings): void => {
    if (!watchSettings.watchEnabled) {
      return;
    }

    const mergedSettings: IWatchSettings = {
      ...defaultWatchSettings,
      ...watchSettings
    };

    state.watchSettings = mergedSettings;
    state.startTime = Date.now();
    if (!state.isActive) {
      start();
    }

    console.debug(`DomWatchManager: Registered configuration-level DOM watching`);
  };

  // Start DOM watching
  const start = (): void => {
    if (state.isActive || !state.watchSettings) {
      return;
    }

    state.isActive = true;
    state.currentUrl = window.location.href;
    initializeObserver();

    console.debug('DomWatchManager: Started configuration-level DOM watching');
  };

  // Get current watch status
  const getStatus = () => ({
    isActive: state.isActive,
    watchEnabled: state.watchSettings?.watchEnabled || false,
    startTime: state.startTime,
    settings: state.watchSettings
  });

  // Set the callback function for sequence restart
  const setSequenceRestartCallback = (callback: () => Promise<void>): void => {
    state.sequenceRestartCallback = callback;
  };

  return {
    registerConfiguration,
    setSequenceRestartCallback,
    start,
    getStatus
  };
})();

export default DomWatchManager;
