import { IAction, IUserScript, IWatchSettings, defaultWatchSettings } from '@dhruv-techapps/acf-common';
import ActionProcessor from '../action';
import Common from '../common';

interface DomWatchState {
  isActive: boolean;
  observer: MutationObserver | null;
  watchSettings: Required<IWatchSettings> | null;
  actions: Array<IAction | IUserScript>;
  debounceTimeout: number | null;
  currentUrl: string;
  processedElements: WeakSet<HTMLElement>;
  processedCount: number;
  startTime: number;
  sequenceRestartCallback?: () => Promise<void>;
}

const DomWatchManager = (() => {
  const state: DomWatchState = {
    isActive: false,
    observer: null,
    watchSettings: null,
    actions: [],
    debounceTimeout: null,
    currentUrl: window.location.href,
    processedElements: new WeakSet(),
    processedCount: 0,
    startTime: 0,
    sequenceRestartCallback: undefined
  };

  const PROCESSED_ATTRIBUTE = 'data-acf-processed';

  // Check if element has already been processed
  const isElementProcessed = (element: HTMLElement): boolean => {
    return element.hasAttribute(PROCESSED_ATTRIBUTE);
  };

  // Mark element as processed
  const markElementProcessed = (element: HTMLElement): void => {
    element.setAttribute(PROCESSED_ATTRIBUTE, 'true');
  };

  // Check if element matches any action in the configuration
  const findMatchingActions = async (element: HTMLElement): Promise<IAction[]> => {
    const matchingActions: IAction[] = [];
    
    for (const action of state.actions) {
      // Skip userscripts as they don't operate on DOM elements
      if (!action.elementFinder || action.type === 'userscript') {
        continue;
      }

      try {
        // Check if this element matches the action's element finder
        const elementFinder = action.elementFinder;
        
        // Quick checks for simple selectors
        let matches = false;
        if (/^(id::|#)/gi.test(elementFinder)) {
          const id = elementFinder.replace(/^(id::|#)/gi, '');
          matches = element.id === id;
        } else if (/^ClassName::/gi.test(elementFinder)) {
          const className = elementFinder.replace(/^ClassName::/gi, '');
          matches = element.classList.contains(className);
        } else if (/^TagName::/gi.test(elementFinder)) {
          const tagName = elementFinder.replace(/^TagName::/gi, '');
          matches = element.tagName.toLowerCase() === tagName.toLowerCase();
        } else if (/^(Selector::|SelectorAll::)/gi.test(elementFinder)) {
          const selector = elementFinder.replace(/^(Selector::|SelectorAll::)/gi, '');
          matches = element.matches(selector);
        } else {
          // For XPath and complex selectors, fall back to querying
          const elements = await Common.getElements(element.ownerDocument, elementFinder, 0, 0);
          matches = elements?.includes(element) || false;
        }

        if (matches) {
          matchingActions.push(action as IAction);
        }
      } catch (error) {
        console.debug('DomWatchManager: Error checking element match:', error);
      }
    }
    
    return matchingActions;
  };

  // Process added nodes and check if any match actions
  const processAddedNodes = async (addedNodes: NodeList): Promise<void> => {
    if (!state.watchSettings || !state.sequenceRestartCallback) {
      return;
    }

    const elements: HTMLElement[] = [];
    
    // Collect all HTML elements from added nodes
    addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        elements.push(element);
        
        // Also get all descendant elements
        const descendants = element.querySelectorAll('*');
        descendants.forEach(desc => {
          if (desc instanceof HTMLElement) {
            elements.push(desc);
          }
        });
      }
    });

    // Check if any new elements match our actions and are not already processed
    let shouldRestart = false;
    for (const element of elements) {
      if (!isElementProcessed(element)) {
        const matchingActions = await findMatchingActions(element);
        if (matchingActions.length > 0) {
          console.debug('DomWatchManager: Found new matching element, triggering action sequence restart');
          markElementProcessed(element);
          state.processedCount++;
          shouldRestart = true;
          break; // Only need to find one matching element to trigger restart
        }
      }
    }

    if (shouldRestart) {
      console.debug('DomWatchManager: Restarting action sequence due to DOM changes');
      await state.sequenceRestartCallback();
    }
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
      if (elapsed >= lifecycleStopConditions.timeout * 1000) { // Convert seconds to milliseconds
        console.debug('DomWatchManager: Stopping due to timeout');
        return true;
      }
    }

    // Check max processed count
    if (lifecycleStopConditions.maxProcessed && state.processedCount >= lifecycleStopConditions.maxProcessed) {
      console.debug('DomWatchManager: Stopping due to max processed count');
      return true;
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
      stop();
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
    const rootElement = document.querySelector(watchRoot) || document.body;

    state.observer = new MutationObserver(handleMutations);
    state.observer.observe(rootElement, {
      childList: true,
      subtree: true
    });

    console.debug(`DomWatchManager: Initialized observer on ${watchRoot}`);
  };

  // Register configuration-level DOM watching
  const registerConfiguration = (actions: Array<IAction | IUserScript>, watchSettings: IWatchSettings): void => {
    if (!watchSettings.watchEnabled) {
      return;
    }

    const mergedSettings: Required<IWatchSettings> = {
      ...defaultWatchSettings,
      ...watchSettings
    };

    state.watchSettings = mergedSettings;
    state.actions = actions;
    state.processedElements = new WeakSet();
    state.processedCount = 0;
    state.startTime = Date.now();
    
    if (!state.isActive) {
      start();
    }

    console.debug(`DomWatchManager: Registered configuration-level DOM watching with ${actions.length} actions`);
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

  // Stop DOM watching
  const stop = (): void => {
    if (!state.isActive) {
      return;
    }

    state.isActive = false;
    
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    // Clear timeout
    if (state.debounceTimeout) {
      clearTimeout(state.debounceTimeout);
      state.debounceTimeout = null;
    }
    
    console.debug('DomWatchManager: Stopped DOM watching');
  };

  // Pause DOM watching (keep settings but stop observing)
  const pause = (): void => {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    state.isActive = false;
    console.debug('DomWatchManager: Paused DOM watching');
  };

  // Resume DOM watching
  const resume = (): void => {
    if (state.watchSettings) {
      start();
      console.debug('DomWatchManager: Resumed DOM watching');
    }
  };

  // Get current watch status
  const getStatus = () => ({
    isActive: state.isActive,
    watchEnabled: state.watchSettings?.watchEnabled || false,
    processedCount: state.processedCount,
    startTime: state.startTime,
    actionsCount: state.actions.length,
    settings: state.watchSettings
  });

  // Set the callback function for sequence restart
  const setSequenceRestartCallback = (callback: () => Promise<void>): void => {
    state.sequenceRestartCallback = callback;
  };

  // Clear all state and stop watching
  const clear = (): void => {
    state.watchSettings = null;
    state.actions = [];
    state.processedElements = new WeakSet();
    state.processedCount = 0;
    state.startTime = 0;
    
    if (state.debounceTimeout) {
      clearTimeout(state.debounceTimeout);
      state.debounceTimeout = null;
    }
    
    stop();
  };

  return {
    registerConfiguration,
    setSequenceRestartCallback,
    start,
    stop,
    pause,
    resume,
    clear,
    getStatus
  };
})();

export default DomWatchManager;