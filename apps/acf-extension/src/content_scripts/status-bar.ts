import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { EnhancedStatusBar, StatusBar, EStatusBarMode } from '@dhruv-techapps/shared-status-bar';

class StatusBarFactory {
  private static instance: StatusBarFactory;
  private statusBar?: EnhancedStatusBar | StatusBar;
  private initialized = false;

  private constructor() {}

  public static getInstance(): StatusBarFactory {
    if (!StatusBarFactory.instance) {
      StatusBarFactory.instance = new StatusBarFactory();
    }
    return StatusBarFactory.instance;
  }

  public async getStatusBar(): Promise<EnhancedStatusBar | StatusBar> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.statusBar!;
  }

  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const settings = await new SettingsStorage().getSettings();
      
      // Use enhanced status bar with settings integration
      const enhancedStatusBar = new EnhancedStatusBar();
      
      // Configure based on settings
      const statusBarMode = settings.statusBarMode ?? EStatusBarMode.FULL;
      const enableStatusBar = settings.enableStatusBar ?? true;
      const location = settings.statusBar === 'hide' ? 'hide' : settings.statusBar;

      enhancedStatusBar.configure({
        enabled: enableStatusBar && location !== 'hide',
        mode: statusBarMode,
        location
      });

      // Set location for backward compatibility
      if (enableStatusBar && location !== 'hide') {
        await enhancedStatusBar.setLocation(location);
      }

      this.statusBar = enhancedStatusBar;
      this.initialized = true;
    } catch (error) {
      // Fallback to legacy status bar
      console.warn('Failed to load status bar settings, using legacy:', error);
      this.statusBar = new StatusBar();
      this.initialized = true;
    }
  }
}

// Create proxy to maintain existing API
const factory = StatusBarFactory.getInstance();

export const statusBar = new Proxy({} as EnhancedStatusBar | StatusBar, {
  get(target, prop) {
    return async (...args: any[]) => {
      const instance = await factory.getStatusBar();
      const method = (instance as any)[prop];
      if (typeof method === 'function') {
        return method.apply(instance, args);
      }
      return method;
    };
  }
});
