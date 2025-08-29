import { Timer } from '@dhruv-techapps/shared-util';
import { STATUS_BAR_LOCATION } from './status-bar.types';

export enum STATUS_BAR_TYPE {
  CONFIG_WAIT = 'Config wait',
  BATCH_WAIT = 'Batch wait',
  BATCH_REPEAT = 'Batch repeat',
  ACTION_WAIT = 'Action wait',
  ACTION_REPEAT = 'Action repeat',
  ADDON_RECHECK = 'Addon recheck'
}

export enum EStatusBarMode {
  HIDE = 'hide',
  MINIMAL = 'minimal',
  FULL = 'full'
}

interface IStatusBarState {
  batchText?: string | number;
  actionNumber?: number;
  actionText?: string;
  addonActive?: boolean;
  timerText?: string;
  statusText?: string;
  icon?: string;
}

interface IStatusBarConfig {
  enabled: boolean;
  mode: EStatusBarMode;
  location: STATUS_BAR_LOCATION;
}

export class EnhancedStatusBar {
  private config: IStatusBarConfig = {
    enabled: true,
    mode: EStatusBarMode.FULL,
    location: 'bottom-right'
  };
  
  private statusBar?: HTMLDivElement;
  private icon?: HTMLSpanElement;
  private batch?: HTMLSpanElement;
  private action?: HTMLSpanElement;
  private addon?: HTMLSpanElement;
  private timer?: HTMLSpanElement;
  private text?: HTMLSpanElement;
  
  private pendingState: IStatusBarState = {};
  private updatePending = false;
  private initialized = false;

  public configure(config: Partial<IStatusBarConfig>): void {
    this.config = { ...this.config, ...config };
    
    // If disabling, clean up DOM
    if (!this.config.enabled && this.statusBar) {
      this.cleanup();
    }
  }

  private initialize(): void {
    if (this.initialized || !this.config.enabled) {
      return;
    }

    this.statusBar = document.createElement('div');
    this.statusBar.id = 'auto-clicker-auto-fill-status';
    this.statusBar.className = this.config.location === 'hide' ? 'hide' : this.config.location;

    if (this.config.mode === EStatusBarMode.MINIMAL) {
      this.createMinimalUI();
    } else {
      this.createFullUI();
    }

    document.body.appendChild(this.statusBar);
    this.initialized = true;
  }

  private createMinimalUI(): void {
    if (!this.statusBar) return;
    
    // Minimal badge: small, fixed position, non-intrusive
    this.statusBar.style.cssText = `
      position: fixed !important;
      width: 40px !important;
      height: 20px !important;
      font-size: 10px !important;
      background: rgba(0,0,0,0.7) !important;
      color: white !important;
      border-radius: 10px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: none !important;
      z-index: 1000000000 !important;
    `;

    this.icon = document.createElement('span');
    this.icon.textContent = '⚡';
    this.statusBar.appendChild(this.icon);
  }

  private createFullUI(): void {
    if (!this.statusBar) return;

    ['icon', 'text', 'batch', 'action', 'addon', 'timer'].forEach((el) => {
      const element = document.createElement('span');
      element.className = el;
      (this as any)[el] = element;
      this.statusBar!.appendChild(element);
    });
  }

  private cleanup(): void {
    if (this.statusBar && this.statusBar.parentNode) {
      this.statusBar.parentNode.removeChild(this.statusBar);
    }
    this.statusBar = undefined;
    this.icon = undefined;
    this.batch = undefined;
    this.action = undefined;
    this.addon = undefined;
    this.timer = undefined;
    this.text = undefined;
    this.initialized = false;
  }

  private scheduleUpdate(): void {
    if (this.updatePending || !this.config.enabled) {
      return;
    }

    this.updatePending = true;
    requestAnimationFrame(() => {
      this.flushUpdates();
      this.updatePending = false;
    });
  }

  private flushUpdates(): void {
    if (!this.config.enabled) {
      return;
    }

    this.initialize();
    
    if (!this.statusBar) {
      return;
    }

    if (this.config.mode === EStatusBarMode.MINIMAL) {
      this.updateMinimalUI();
    } else {
      this.updateFullUI();
    }

    // Clear pending state
    this.pendingState = {};
  }

  private updateMinimalUI(): void {
    if (!this.icon) return;

    if (this.pendingState.icon) {
      this.icon.textContent = this.pendingState.icon;
    } else if (this.pendingState.actionNumber) {
      this.icon.textContent = `${this.pendingState.actionNumber}`;
    } else if (this.pendingState.batchText) {
      this.icon.textContent = 'B';
    }
  }

  private updateFullUI(): void {
    if (this.pendingState.icon && this.icon) {
      this.icon.textContent = this.pendingState.icon;
    }
    
    if (this.pendingState.batchText && this.batch) {
      this.batch.textContent = `🅱️${this.pendingState.batchText}`;
      this.batch.title = 'Batch';
    }
    
    if (this.pendingState.actionNumber !== undefined && this.action) {
      this.action.textContent = `🅰️${this.pendingState.actionNumber}`;
      this.action.title = this.pendingState.actionText ?? 'Action';
    }
    
    if (this.pendingState.addonActive && this.addon) {
      this.addon.textContent = '❓';
      this.addon.title = 'Addon';
    }
    
    if (this.pendingState.timerText && this.timer) {
      this.timer.textContent = this.pendingState.timerText;
    }
    
    if (this.pendingState.statusText && this.text) {
      this.text.textContent = this.pendingState.statusText;
    }

    // Clear sections when moving between states
    if (this.pendingState.actionNumber !== undefined && this.addon) {
      this.addon.textContent = '';
    }
    if (this.pendingState.batchText && this.action) {
      this.action.textContent = '';
    }
  }

  public setLocation = async (location: STATUS_BAR_LOCATION): Promise<void> => {
    this.config.location = location;
    if (this.statusBar) {
      this.statusBar.className = location === 'hide' ? 'hide' : location;
    }
  };

  public async wait(text?: number | string, type?: STATUS_BAR_TYPE, name?: string | number): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      return;
    }

    if (!this.config.enabled) {
      // Just wait without UI updates
      await Timer.sleep(waitTime);
      return;
    }

    // Update timer less frequently for minimal mode
    const updateInterval = this.config.mode === EStatusBarMode.MINIMAL ? 1000 : 100;
    let remaining = waitTime;

    while (remaining > 0) {
      this.pendingState.timerText = this.getTimerText(type, name, remaining);
      this.scheduleUpdate();
      
      const sleepTime = Math.min(updateInterval, remaining);
      await Timer.sleep(sleepTime);
      remaining -= sleepTime;
    }

    this.pendingState.timerText = '';
    this.scheduleUpdate();
  }

  private getTimerText(type?: STATUS_BAR_TYPE, name?: string | number, remaining?: number): string {
    if (!type || !remaining) return '';

    const seconds = Math.ceil(remaining / 1000);
    
    switch (type) {
      case STATUS_BAR_TYPE.CONFIG_WAIT:
        return this.config.mode === EStatusBarMode.MINIMAL ? `${seconds}s` : `Config 🕒${seconds}s`;
      case STATUS_BAR_TYPE.ADDON_RECHECK:
      case STATUS_BAR_TYPE.ACTION_REPEAT:
        return this.config.mode === EStatusBarMode.MINIMAL ? `${seconds}s` : `🔁${name} ~🕒${seconds}s`;
      default:
        return this.config.mode === EStatusBarMode.MINIMAL ? `${seconds}s` : `🔍${name} ~🕒${seconds}s`;
    }
  }

  public addonUpdate(): void {
    if (!this.config.enabled) return;
    
    this.pendingState.addonActive = true;
    this.pendingState.statusText = '';
    this.scheduleUpdate();
  }

  public actionUpdate(number: number, text: string | undefined): void {
    if (!this.config.enabled) return;
    
    this.pendingState.actionNumber = number;
    this.pendingState.actionText = text;
    this.pendingState.addonActive = false;
    this.scheduleUpdate();
  }

  public batchUpdate(text: string | number): void {
    if (!this.config.enabled) return;
    
    this.pendingState.batchText = text;
    this.pendingState.actionNumber = undefined;
    this.pendingState.addonActive = false;
    this.pendingState.statusText = '';
    this.scheduleUpdate();
  }

  public error = (text: string): void => {
    if (!this.config.enabled) return;
    
    this.pendingState.icon = '❌';
    this.pendingState.batchText = undefined;
    this.pendingState.actionNumber = undefined;
    this.pendingState.addonActive = false;
    this.pendingState.timerText = '';
    this.pendingState.statusText = text;
    this.scheduleUpdate();
  };

  public done = (): void => {
    if (!this.config.enabled) return;
    
    this.pendingState.icon = '✨';
    this.pendingState.batchText = undefined;
    this.pendingState.actionNumber = undefined;
    this.pendingState.addonActive = false;
    this.pendingState.timerText = '';
    this.pendingState.statusText = 'Done';
    this.scheduleUpdate();
  };
}

// Legacy StatusBar class for backward compatibility
export class StatusBar {
  private readonly statusBar: HTMLDivElement = document.createElement('div');
  private readonly icon: HTMLSpanElement = document.createElement('span');
  private readonly batch: HTMLSpanElement = document.createElement('span');
  private readonly action: HTMLSpanElement = document.createElement('span');
  private readonly addon: HTMLSpanElement = document.createElement('span');
  private readonly timer: HTMLSpanElement = document.createElement('span');
  private readonly text: HTMLSpanElement = document.createElement('span');

  constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'hide';
    this.statusBar.id = 'auto-clicker-auto-fill-status';
    ['icon', 'text', 'batch', 'action', 'addon', 'timer'].forEach((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[el].className = el;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.statusBar.appendChild((this as any)[el]);
    });
  }

  public setLocation = async (location: STATUS_BAR_LOCATION) => {
    this.statusBar.className = location;
    document.body.appendChild(this.statusBar);
  };

  public async wait(text?: number | string, type?: STATUS_BAR_TYPE, name?: string | number): Promise<void> {
    this.timer.textContent = '';
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      return;
    }
    switch (type) {
      case STATUS_BAR_TYPE.CONFIG_WAIT:
        this.text.textContent = 'Config';
        break;
      case STATUS_BAR_TYPE.BATCH_WAIT:
      case STATUS_BAR_TYPE.BATCH_REPEAT:
      case STATUS_BAR_TYPE.ACTION_WAIT:
        break;
      case STATUS_BAR_TYPE.ADDON_RECHECK:
        this.timer.textContent = `🔁${name} ~`;
        break;
      case STATUS_BAR_TYPE.ACTION_REPEAT:
        this.timer.textContent = `🔁${name} ~`;
        break;
      default:
        this.timer.textContent = `🔍${name} ~`;
        break;
    }

    this.timer.textContent += '🕒' + waitTime / 1000 + ' sec';
    await Timer.sleep(waitTime);
  }

  public addonUpdate(): void {
    this.addon.textContent = '❓';
    this.addon.title = 'Addon';
    this.text.textContent = '';
  }

  public actionUpdate(number: number, text: string | undefined): void {
    this.action.textContent = `🅰️${number}`;
    this.action.title = text ?? 'Action';
    this.addon.textContent = '';
  }

  public batchUpdate(text: string | number): void {
    this.batch.textContent = `🅱️${text}`;
    this.batch.title = 'Batch';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.text.textContent = '';
  }

  public error = (text: string): void => {
    this.icon.textContent = '❌';
    this.batch.textContent = '';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.timer.textContent = '';
    this.text.textContent = text;
  };

  public done = (): void => {
    this.icon.textContent = '✨';
    this.batch.textContent = '';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.timer.textContent = '';
    this.text.textContent = 'Done';
  };
}

export class ManualStatusBar {
  private static instance: ManualStatusBar;
  private readonly statusBar: HTMLDivElement;
  private readonly manualContainer: HTMLUListElement = document.createElement('ul');

  private constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.id = 'auto-clicker-auto-fill-manual';

    this.manualSetup();
    document.body.appendChild(this.statusBar);
  }

  public manual = (text: string): void => {
    if (!this.manualContainer.textContent) {
      const li = document.createElement('li');
      li.textContent = '👋';
      this.manualContainer.appendChild(li);
    }
    const li = document.createElement('li');
    li.textContent = text;
    this.manualContainer.appendChild(li);
  };

  private readonly manualSetup = (): void => {
    this.manualContainer.className = 'manual';
    this.statusBar.appendChild(this.manualContainer);
  };

  public static getInstance(): ManualStatusBar {
    if (!ManualStatusBar.instance) {
      ManualStatusBar.instance = new ManualStatusBar();
    }
    return ManualStatusBar.instance;
  }
}
