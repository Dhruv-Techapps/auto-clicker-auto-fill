import { LoggerService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { ActionService } from '@dhruv-techapps/core-service';
import { Timer } from '@dhruv-techapps/shared-util';
import { STATUS_BAR_LOCATION } from './status-bar.types';

export enum STATUS_BAR_TYPE {
  CONFIG_WAIT = 'Config wait',
  ACTION_WAIT = 'Action wait',
  BATCH_REPEAT = 'Batch repeat',
  ADDON_RECHECK = 'Addon recheck',
  ACTION_REPEAT = 'Action repeat'
}

export class StatusBar {
  private totalActions = 0;
  private totalBatches = '0';
  private currentBatch = 0;

  private readonly statusBar: HTMLDivElement = document.createElement('div');
  private readonly iconEle: HTMLSpanElement = document.createElement('span');
  private readonly textEle: HTMLSpanElement = document.createElement('span');
  private readonly batchEle: HTMLSpanElement = document.createElement('span');
  private readonly actionEle: HTMLSpanElement = document.createElement('span');
  private readonly remainingEle: HTMLSpanElement = document.createElement('span');
  private readonly issueEle: HTMLSpanElement = document.createElement('span');
  constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'hide';
    this.statusBar.id = 'auto-clicker-auto-fill-status';
    ['iconEle', 'batchEle', 'actionEle', 'issueEle', 'textEle', 'remainingEle'].forEach((el) => {
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

  public enable(totalActions: number, totalBatches: number | 'unlimited' = 0): void {
    this.totalActions = totalActions;
    this.totalBatches = totalBatches === 'unlimited' ? '∞' : totalBatches > 0 ? totalBatches.toString() : '∞';
    LoggerService.debug(`Status ACTION:${totalActions} BATCH:${this.totalBatches}`);
    ActionService.setBadgeText({ text: '⚡' });
  }

  /**
   * Log only for first batch and first or infinite first current action
   * @param current
   * @returns
   */
  public isLogAllowed(current: number | '∞'): boolean {
    return this.currentBatch === 1 && current === 1;
  }

  // New helper wait methods per type. Original `wait` is kept as backup.
  public async waitConfig(text?: number): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) return;
    const time = waitTime / 1000;
    const title = `⏳ ${time}s ▶️ Configuration.`;
    await this.renderAndSleep({ title, waitTime, logMessage: title, current: 0 });
  }

  public async waitAction(text?: number | string, current = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      this.actionUpdate(current);
      return;
    }
    const time = waitTime / 1000;
    const title = `⏳ ${time}s ▶️ Action.`;
    this.actionUpdate(current, title);
    await this.renderAndSleep({ title, waitTime, logMessage: this.actionEle.textContent + ` ${title}`, current });
  }

  public async waitBatchRepeat(text?: number | string, current = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      this.batchUpdate(current);
      return;
    }
    const time = waitTime / 1000;
    const title = `⏳ ${time}s 📦 Batch.`;
    this.batchUpdate(current, title);
    await this.renderAndSleep({ title, waitTime, logMessage: this.batchEle.textContent + ` ${title}`, current });
  }

  public async waitActionRepeat(text?: number | string, current: number | '∞' = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) return;
    const time = waitTime / 1000;

    const title = `⏳ ${time}s 🔁 Action.`;
    const remaining = current === '∞' ? 'unlimited repeats' : `${current} repeats left`;
    await this.renderAndSleep({ title, remaining, waitTime, logMessage: this.actionEle.textContent + ` ${title} > ${remaining}`, current });
  }

  public async waitAddonRecheck(text?: number | string, current: number | '∞' = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) return;
    const time = waitTime / 1000;
    const issue = '⚠️ Addon Condition not met.';
    const title = `⏳ ${time}s 🔁 Addon.`;
    const remaining = current === '∞' ? 'unlimited checks' : `${current} checks left`;
    await this.renderAndSleep({ title, issue, remaining, waitTime, logMessage: this.actionEle.textContent + ` ${title} > ${issue} > ${remaining}`, current });
  }

  public async waitDefault(text?: number | string, current: number | '∞' = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) return;
    const time = waitTime / 1000;
    const issue = '⚠️ Element not found.';
    const title = `⏳ ${time}s 🔁 Action.`;
    const remaining = current === '∞' ? 'unlimited retries' : `${current} retries left`;
    await this.renderAndSleep({ title, issue, remaining, waitTime, logMessage: this.actionEle.textContent + ` ${title} > ${issue} > ${remaining}`, current });
  }

  private logIfAllowed(message: string, current: number | '∞'): void {
    if (this.isLogAllowed(current)) LoggerService.debug(message);
  }

  private async renderAndSleep({
    title,
    issue,
    remaining,
    waitTime,
    logMessage,
    current = 0
  }: {
    title: string;
    issue?: string;
    remaining?: string;
    waitTime: number;
    logMessage?: string;
    current: number | '∞';
  }): Promise<void> {
    this.textEle.textContent = title;
    this.issueEle.textContent = issue || '';
    this.remainingEle.textContent = remaining || '';
    if (logMessage) this.logIfAllowed(logMessage, current);
    await Timer.sleep(waitTime);
  }

  public batchUpdate(text: number, title = ''): void {
    this.currentBatch = text;
    this.batchEle.textContent = `BATCH ${text}/${this.totalBatches}`;
    this.remainingEle.textContent = '';
    this.actionEle.textContent = '';
    this.issueEle.textContent = '';
    if (this.currentBatch === 1) LoggerService.debug(this.batchEle.textContent + ' ' + title);
  }

  private actionUpdate(number: number, title = ''): void {
    this.actionEle.textContent = `ACTION ${number}/${this.totalActions}`;
    this.remainingEle.textContent = '';
    this.issueEle.textContent = '';
    if (this.currentBatch === 1) LoggerService.debug(this.actionEle.textContent + ' ' + title);
  }

  public error = (error: string): void => {
    console.error('Error: %s', error);
    ActionService.setBadgeText({ text: '❌' });
    this.iconEle.textContent = '❌';
    this.textEle.textContent = error;
    LoggerService.debug(this.textEle.textContent);
  };

  public done = (): void => {
    ActionService.setBadgeText({ text: '✅' });
    this.batchEle.textContent = '';
    this.actionEle.textContent = '';
    this.remainingEle.textContent = '';
    this.issueEle.textContent = '';
    this.iconEle.textContent = '✅';
    this.textEle.textContent = 'Done';
    LoggerService.debug(this.textEle.textContent);
  };
}
