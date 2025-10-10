import { ActionService } from '@dhruv-techapps/core-service';
import { Timer } from '@dhruv-techapps/shared-util';

export enum STATUS_BAR_TYPE {
  CONFIG_WAIT = 'Config wait',
  ACTION_WAIT = 'Action wait',
  BATCH_REPEAT = 'Batch repeat',
  ADDON_RECHECK = 'Addon recheck',
  ACTION_REPEAT = 'Action repeat'
}

export class StatusBar {
  private batch: string | number = '';
  private action: string = '';
  private totalActions: number = 0;
  private totalBatches: number = 0;

  public enable(totalActions: number, totalBatches?: number): void {
    this.batch = '';
    this.action = '';
    this.totalActions = totalActions;
    this.totalBatches = totalBatches || 0;
    ActionService.enable();
    ActionService.setBadgeText({ text: '⚡' });
    ActionService.setTitle({ title: 'Initializing setup...' });
  }

  public disable(): void {
    ActionService.disable();
  }

  public async wait(text?: number | string, _type?: STATUS_BAR_TYPE | string, current?: number): Promise<void> {
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      return;
    }
    const time = waitTime / 1000;
    let title = '';
    let icon = '🔄⏳';
    switch (_type) {
      case STATUS_BAR_TYPE.CONFIG_WAIT:
        icon = '▶️⏳';
        title = `Waiting ${time}s before starting configuration.`;
        break;
      case STATUS_BAR_TYPE.ACTION_WAIT:
        icon = '🔁⏳';
        title = `Waiting ${time}s before starting Action ${this.action} of ${this.totalActions}.`;
        break;
      case STATUS_BAR_TYPE.BATCH_REPEAT:
        icon = '📦⏳';
        title = `Waiting ${time}s before starting Batch ${this.batch} of ${this.totalBatches}.`;
        break;
      case STATUS_BAR_TYPE.ACTION_REPEAT:
        title = `Waiting ${time}s before repeating Action ${this.action} (${current} repeats left).`;
        break;
      case STATUS_BAR_TYPE.ADDON_RECHECK:
        icon = '✅⏳';
        title = `Condition not met. Rechecking in ${time}s... ${current} checks left (Action ${this.action}).`;
        break;
      default:
        icon = '👀⏳';
        title = `Element not found. Retrying in ${time}s... ${current} retries left (Action ${this.action}).`;
        break;
    }
    ActionService.setBadgeText({ text: icon });
    ActionService.setTitle({ title });
    await Timer.sleep(waitTime);
  }

  public batchUpdate(text: string | number): void {
    this.batch = text;
    this.action = '';
  }

  public actionUpdate(number: string): void {
    this.action = number;
  }

  public error = (error: string): void => {
    console.error('Error: %s', error);
    ActionService.setBadgeText({ text: '❌' });
    ActionService.setTitle({ title: error });
  };

  public done = (): void => {
    ActionService.setBadgeText({ text: '✅' });
    ActionService.setTitle({ title: 'Auto Clicker & Auto Fill' });
  };
}
