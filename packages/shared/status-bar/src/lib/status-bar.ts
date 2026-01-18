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
  private totalBatches: string = '0';
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

  public enable(totalActions: number, totalBatches: number = 0): void {
    this.totalActions = totalActions;
    this.totalBatches = totalBatches > 0 ? totalBatches.toString() : '∞';
    LoggerService.debug(`Status ACTION:${totalActions} BATCH:${this.totalBatches}`);
    ActionService.setBadgeText({ text: '⚡' });
  }

  public async wait(text?: number | string, _type?: STATUS_BAR_TYPE | string, current: number = 0): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      if (_type === STATUS_BAR_TYPE.ACTION_WAIT) {
        this.actionUpdate(current ?? 0);
      } else if (_type === STATUS_BAR_TYPE.BATCH_REPEAT) {
        this.batchUpdate(current ?? 0);
      }
      return;
    }
    const time = waitTime / 1000;
    let title = '';
    let issue = '';
    let remaining = '';
    let currentLabel = current > 0 ? current : '∞';
    switch (_type) {
      case STATUS_BAR_TYPE.CONFIG_WAIT:
        title = `⏳ ${time}s ▶️ Configuration.`;
        LoggerService.debug(title);
        break;
      case STATUS_BAR_TYPE.ACTION_WAIT:
        title = `⏳ ${time}s ▶️ Action.`;
        this.actionUpdate(current, title);
        break;
      case STATUS_BAR_TYPE.BATCH_REPEAT:
        title = `⏳ ${time}s 📦 Batch.`;
        this.batchUpdate(current, title);
        break;
      case STATUS_BAR_TYPE.ACTION_REPEAT:
        title = `⏳ ${time}s 🔁 Action.`;
        remaining = `${currentLabel} repeats left`;
        if (this.currentBatch === 1 && (current === 1 || current === -2)) LoggerService.debug(this.actionEle.textContent + ` ${title} > ${remaining}`);
        break;
      case STATUS_BAR_TYPE.ADDON_RECHECK:
        issue = '⚠️ Addon Condition not met.';
        title = `⏳ ${time}s 🔁 Addon.`;
        remaining = `${currentLabel} checks left`;
        if (this.currentBatch === 1 && (current === 1 || current === -2)) LoggerService.debug(this.actionEle.textContent + ` ${title} > ${issue} > ${remaining}`);
        break;
      default:
        issue = '⚠️ Element not found.';
        title = `⏳ ${time}s 🔁 Action.`;
        remaining = `${currentLabel} retries left`;
        if (this.currentBatch === 1 && (current === 1 || current === -2)) LoggerService.debug(this.actionEle.textContent + ` ${title} > ${issue} > ${remaining}`);
        break;
    }
    this.textEle.textContent = title;
    this.issueEle.textContent = issue;
    this.remainingEle.textContent = remaining;
    await Timer.sleep(waitTime);
  }

  public batchUpdate(text: number, title: string = ''): void {
    this.currentBatch = text;
    this.batchEle.textContent = `BATCH ${text}/${this.totalBatches}`;
    this.remainingEle.textContent = '';
    this.actionEle.textContent = '';
    this.issueEle.textContent = '';
    if (this.currentBatch === 1) LoggerService.debug(this.batchEle.textContent + ' ' + title);
  }

  private actionUpdate(number: number, title: string = ''): void {
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
