import { defaultActionWatchSettings, IAction, IActionWatchSettings } from '@dhruv-techapps/acf-common';

describe('DOM Watcher Action Settings', () => {
  it('should have correct default watch settings', () => {
    expect(defaultActionWatchSettings.watchEnabled).toBe(false);
    expect(defaultActionWatchSettings.watchRootSelector).toBe('body');
    expect(defaultActionWatchSettings.debounceMs).toBe(500);
    expect(defaultActionWatchSettings.maxRepeats).toBe(1);
    expect(defaultActionWatchSettings.visibilityCheck).toBe(false);
    expect(defaultActionWatchSettings.lifecycleStopConditions?.timeout).toBe(30 * 60 * 1000); // 30 minutes
    expect(defaultActionWatchSettings.lifecycleStopConditions?.urlChange).toBe(true);
  });

  it('should allow creating action with watch settings', () => {
    const watchSettings: IActionWatchSettings = {
      watchEnabled: true,
      debounceMs: 1000,
      maxRepeats: 5,
      visibilityCheck: true
    };

    const action: IAction = {
      id: 'test-action',
      elementFinder: '.test-element',
      settings: {
        watch: watchSettings
      }
    };

    expect(action.settings?.watch?.watchEnabled).toBe(true);
    expect(action.settings?.watch?.debounceMs).toBe(1000);
    expect(action.settings?.watch?.maxRepeats).toBe(5);
    expect(action.settings?.watch?.visibilityCheck).toBe(true);
  });

  it('should merge watch settings with defaults', () => {
    const customSettings: IActionWatchSettings = {
      watchEnabled: true,
      debounceMs: 200
    };

    const mergedSettings = {
      ...defaultActionWatchSettings,
      ...customSettings
    };

    expect(mergedSettings.watchEnabled).toBe(true);
    expect(mergedSettings.debounceMs).toBe(200);
    expect(mergedSettings.watchRootSelector).toBe('body'); // from defaults
    expect(mergedSettings.maxRepeats).toBe(1); // from defaults
  });
});