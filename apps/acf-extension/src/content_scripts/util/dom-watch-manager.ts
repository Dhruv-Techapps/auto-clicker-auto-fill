import { IAction, IActionWatchSettings, defaultActionWatchSettings, EActionWatchRestartMode } from '@dhruv-techapps/acf-common';
import ActionProcessor from '../action';
import Common from '../common';

interface WatchedAction {
  action: IAction;
  watchSettings: Required<IActionWatchSettings>;
  processedElements: WeakSet<HTMLElement>;
  processedCount: number;
  startTime: number;
  actionIndex: number;        // Index of this action in the sequence
  actionSequence: IAction[];  // The full action sequence
}

interface DomWatchState {
  isActive: boolean;
  observer: MutationObserver | null;
  watchedActions: Map<string, WatchedAction>;
  debounceTimeouts: Map<string, number>;
  currentUrl: string;
  sequenceRestartCallback?: (startIndex: number, actions: IAction[]) => Promise<void>;
}

const DomWatchManager = (() => {
  const state: DomWatchState = {
    isActive: false,
    observer: null,
    watchedActions: new Map(),
    debounceTimeouts: new Map(),
    currentUrl: window.location.href,
    sequenceRestartCallback: undefined
  };

  const PROCESSED_ATTRIBUTE_PREFIX = 'data-acf-processed-';

  // Check if element is visible in viewport
  const isElementVisible = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Check if element has already been processed for a specific action
  const isElementProcessed = (element: HTMLElement, actionId: string): boolean => {
    return element.hasAttribute(`${PROCESSED_ATTRIBUTE_PREFIX}${actionId}`);
  };

  // Mark element as processed for a specific action
  const markElementProcessed = (element: HTMLElement, actionId: string): void => {
    element.setAttribute(`${PROCESSED_ATTRIBUTE_PREFIX}${actionId}`, 'true');
  };

  // Check if element matches the action's element finder
  const doesElementMatch = async (element: HTMLElement, action: IAction): Promise<boolean> => {
    try {
      // Use the existing Common.getElements logic to check if element would be found
      const elementFinder = action.elementFinder;
      
      // Quick checks for simple selectors
      if (/^(id::|#)/gi.test(elementFinder)) {
        const id = elementFinder.replace(/^(id::|#)/gi, '');
        return element.id === id;
      } else if (/^ClassName::/gi.test(elementFinder)) {
        const className = elementFinder.replace(/^ClassName::/gi, '');
        return element.classList.contains(className);
      } else if (/^TagName::/gi.test(elementFinder)) {
        const tagName = elementFinder.replace(/^TagName::/gi, '');
        return element.tagName.toLowerCase() === tagName.toLowerCase();
      } else if (/^(Selector::|SelectorAll::)/gi.test(elementFinder)) {
        const selector = elementFinder.replace(/^(Selector::|SelectorAll::)/gi, '');
        return element.matches(selector);
      }
      
      // For XPath and complex selectors, fall back to querying
      const elements = await Common.getElements(element.ownerDocument, elementFinder, 0, 0);
      return elements?.includes(element) || false;
    } catch (error) {
      console.debug('DomWatchManager: Error checking element match:', error);
      return false;
    }
  };

  // Process a single element for a specific action
  const processElementForAction = async (element: HTMLElement, watchedAction: WatchedAction): Promise<void> => {
    const { action, watchSettings, processedElements, actionIndex, actionSequence } = watchedAction;

    // Check if already processed
    if (isElementProcessed(element, action.id)) {
      return;
    }

    // Check visibility if required
    if (watchSettings.visibilityCheck && !isElementVisible(element)) {
      return;
    }

    // Check if element matches the action's selector
    if (!(await doesElementMatch(element, action))) {
      return;
    }

    // Check max repeats per element
    if (processedElements.has(element) && watchSettings.maxRepeats <= 1) {
      return;
    }

    try {
      console.debug(`DomWatchManager: Processing element for action "${action.name || action.id}" with restart mode: ${watchSettings.restartMode}`);
      
      // Mark as processed before executing to prevent re-processing during execution
      markElementProcessed(element, action.id);
      processedElements.add(element);
      watchedAction.processedCount++;

      // Handle different restart modes
      if (watchSettings.restartMode === EActionWatchRestartMode.SINGLE) {
        // Default behavior: execute only this action on the specific element
        await executeActionOnElement(element, action);
      } else if (watchSettings.restartMode === EActionWatchRestartMode.SEQUENCE && state.sequenceRestartCallback) {
        // Restart from this action and continue through the sequence
        console.debug(`DomWatchManager: Restarting action sequence from index ${actionIndex}`);
        await state.sequenceRestartCallback(actionIndex, actionSequence);
      } else if (watchSettings.restartMode === EActionWatchRestartMode.FULL && state.sequenceRestartCallback) {
        // Restart the entire action sequence from the beginning
        console.debug(`DomWatchManager: Restarting full action sequence from beginning`);
        await state.sequenceRestartCallback(0, actionSequence);
      } else {
        // Fallback to single action execution
        await executeActionOnElement(element, action);
      }

    } catch (error) {
      console.error('DomWatchManager: Error processing element:', error);
      // Remove the processed marker if execution failed
      element.removeAttribute(`${PROCESSED_ATTRIBUTE_PREFIX}${action.id}`);
      processedElements.delete(element);
      watchedAction.processedCount--;
    }
  };

  // Execute action on a specific element (bypasses normal element finding)
  const executeActionOnElement = async (element: HTMLElement, action: IAction): Promise<void> => {
    // Set up the action context
    const previousCurrentAction = window.ext.__currentAction;
    const previousCurrentActionName = window.ext.__currentActionName;
    const previousActionRepeat = window.ext.__actionRepeat;

    try {
      window.ext.__currentActionName = action.name || `Watch-${action.id}`;
      window.ext.__actionRepeat = 1;

      // Import ACFEvents and ACFValue dynamically to avoid circular dependencies
      const { ACFEvents } = await import('./acf-events');
      const { ACFValue } = await import('./acf-value');

      // Get the action value
      const value = action.value ? await ACFValue.getValue(action.value, action.settings) : action.value;
      
      // Execute the event on the specific element
      await ACFEvents.check(action.elementFinder, [element], value);

    } finally {
      // Restore previous context
      window.ext.__currentAction = previousCurrentAction;
      window.ext.__currentActionName = previousCurrentActionName;
      window.ext.__actionRepeat = previousActionRepeat;
    }
  };

  // Debounced processing for an action
  const debounceProcessing = (actionId: string, processingFn: () => void, delay: number): void => {
    // Clear existing timeout
    const existingTimeout = state.debounceTimeouts.get(actionId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeoutId = window.setTimeout(() => {
      processingFn();
      state.debounceTimeouts.delete(actionId);
    }, delay);

    state.debounceTimeouts.set(actionId, timeoutId);
  };

  // Check lifecycle stop conditions for an action
  const shouldStopWatching = (watchedAction: WatchedAction): boolean => {
    const { watchSettings, processedCount, startTime } = watchedAction;
    const { lifecycleStopConditions } = watchSettings;

    if (!lifecycleStopConditions) return false;

    // Check timeout
    if (lifecycleStopConditions.timeout) {
      const elapsed = Date.now() - startTime;
      if (elapsed >= lifecycleStopConditions.timeout) {
        console.debug('DomWatchManager: Stopping due to timeout');
        return true;
      }
    }

    // Check max processed count
    if (lifecycleStopConditions.maxProcessed && processedCount >= lifecycleStopConditions.maxProcessed) {
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

  // Process added nodes for all watched actions
  const processAddedNodes = (addedNodes: NodeList): void => {
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

    // Process elements for each watched action
    state.watchedActions.forEach((watchedAction, actionId) => {
      // Check if we should stop watching this action
      if (shouldStopWatching(watchedAction)) {
        unregisterAction(actionId);
        return;
      }

      // Debounce processing for this action
      debounceProcessing(actionId, () => {
        elements.forEach(element => {
          processElementForAction(element, watchedAction).catch(error => {
            console.error('DomWatchManager: Error in debounced processing:', error);
          });
        });
      }, watchedAction.watchSettings.debounceMs);
    });
  };

  // Mutation observer callback
  const handleMutations = (mutations: MutationRecord[]): void => {
    if (!state.isActive || state.watchedActions.size === 0) {
      return;
    }

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        processAddedNodes(mutation.addedNodes);
      }
    }
  };

  // Initialize the mutation observer
  const initializeObserver = (): void => {
    if (state.observer) {
      return;
    }

    state.observer = new MutationObserver(handleMutations);
    state.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Register an action for DOM watching
  const registerAction = (action: IAction, actionIndex: number = 0, actionSequence: IAction[] = [action]): void => {
    if (!action.settings?.watch?.watchEnabled) {
      return;
    }

    const watchSettings: Required<IActionWatchSettings> = {
      ...defaultActionWatchSettings,
      ...action.settings.watch
    };

    const watchedAction: WatchedAction = {
      action,
      watchSettings,
      processedElements: new WeakSet(),
      processedCount: 0,
      startTime: Date.now(),
      actionIndex,
      actionSequence
    };

    state.watchedActions.set(action.id, watchedAction);
    
    if (!state.isActive) {
      start();
    }

    console.debug(`DomWatchManager: Registered action "${action.name || action.id}" for DOM watching (index: ${actionIndex}, restart mode: ${watchSettings.restartMode})`);
  };

  // Unregister an action from DOM watching
  const unregisterAction = (actionId: string): void => {
    const watchedAction = state.watchedActions.get(actionId);
    if (watchedAction) {
      state.watchedActions.delete(actionId);
      
      // Clear any pending debounce timeouts
      const timeoutId = state.debounceTimeouts.get(actionId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        state.debounceTimeouts.delete(actionId);
      }

      console.debug(`DomWatchManager: Unregistered action "${watchedAction.action.name || actionId}" from DOM watching`);
    }

    // Stop watching if no actions remain
    if (state.watchedActions.size === 0) {
      stop();
    }
  };

  // Start DOM watching
  const start = (): void => {
    if (state.isActive) {
      return;
    }

    state.isActive = true;
    state.currentUrl = window.location.href;
    initializeObserver();
    
    console.debug('DomWatchManager: Started DOM watching');
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

    // Clear all timeouts
    state.debounceTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    state.debounceTimeouts.clear();
    
    console.debug('DomWatchManager: Stopped DOM watching');
  };

  // Pause DOM watching (keep actions registered but stop observing)
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
    if (state.watchedActions.size > 0) {
      start();
      console.debug('DomWatchManager: Resumed DOM watching');
    }
  };

  // Get current watch status
  const getStatus = () => ({
    isActive: state.isActive,
    watchedActionsCount: state.watchedActions.size,
    watchedActions: Array.from(state.watchedActions.entries()).map(([id, watched]) => ({
      id,
      name: watched.action.name || id,
      processedCount: watched.processedCount,
      startTime: watched.startTime,
      settings: watched.watchSettings
    }))
  });

  // Set the callback function for sequence restart
  const setSequenceRestartCallback = (callback: (startIndex: number, actions: IAction[]) => Promise<void>): void => {
    state.sequenceRestartCallback = callback;
  };

  // Clear all actions and stop watching
  const clear = (): void => {
    state.watchedActions.clear();
    state.debounceTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    state.debounceTimeouts.clear();
    stop();
  };

  return {
    registerAction,
    unregisterAction,
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