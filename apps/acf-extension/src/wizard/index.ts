import { ERecordMethod, WIZARD } from '../common/constant';
import { Action } from './action';
import { Auto } from './auto';
import { Config } from './config';
import { IndividualField } from './individual-field';
import { SidePanel } from './side-panel';

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.messenger === WIZARD) {
    if (msg.methodName === ERecordMethod.StartRecording) {
      await Config.setup();
      Action.setup();
      SidePanel.setup();
    } else if (msg.methodName === ERecordMethod.StopRecording) {
      Config.disconnect();
      Action.disconnect();
      SidePanel.disconnect();
    } else if (msg.methodName === ERecordMethod.AutoGenerateConfig) {
      Auto.generate();
    }
  }
});

IndividualField.setup();
