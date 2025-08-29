import { defaultWatchSettings, IConfiguration, IWatchSettings } from '@dhruv-techapps/acf-common';
import { generateUUID } from '@dhruv-techapps/core-common';

describe('DOM Watcher Configuration Settings', () => {
  it('should have correct default watch settings', () => {
    expect(defaultWatchSettings.watchEnabled).toBe(false);
    expect(defaultWatchSettings.watchRootSelector).toBe('body');
    expect(defaultWatchSettings.debounce).toBe(1);
    expect(defaultWatchSettings.lifecycleStopConditions?.timeout).toBe(30); // 30 minutes
    expect(defaultWatchSettings.lifecycleStopConditions?.urlChange).toBe(true);
  });

  it('should allow creating configuration with watch settings', () => {
    const watchSettings: IWatchSettings = {
      watchEnabled: true,
      debounce: 2,
      watchRootSelector: '#app',
      lifecycleStopConditions: {
        timeout: 60,
        maxProcessed: 100,
        urlChange: false
      }
    };

    const config: IConfiguration = {
      id: generateUUID(),
      url: 'https://example.com',
      enable: true,
      startType: 'auto' as any,
      loadType: 'window' as any,
      actions: [],
      watch: watchSettings
    };

    expect(config.watch?.watchEnabled).toBe(true);
    expect(config.watch?.debounce).toBe(2);
    expect(config.watch?.watchRootSelector).toBe('#app');
    expect(config.watch?.lifecycleStopConditions?.timeout).toBe(60);
    expect(config.watch?.lifecycleStopConditions?.maxProcessed).toBe(100);
    expect(config.watch?.lifecycleStopConditions?.urlChange).toBe(false);
  });

  it('should merge watch settings with defaults', () => {
    const customSettings: IWatchSettings = {
      watchEnabled: true,
      debounce: 0.5
    };

    const mergedSettings = {
      ...defaultWatchSettings,
      ...customSettings
    };

    expect(mergedSettings.watchEnabled).toBe(true);
    expect(mergedSettings.debounce).toBe(0.5);
    expect(mergedSettings.watchRootSelector).toBe('body'); // from defaults
    expect(mergedSettings.lifecycleStopConditions?.timeout).toBe(30); // from defaults
  });
});
