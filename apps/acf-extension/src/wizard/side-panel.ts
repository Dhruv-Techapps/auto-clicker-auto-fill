import { PortService } from '@dhruv-techapps/core-service';
import { store } from './store';

export const SidePanel = (() => {
  let unsubscribe: () => void;
  const setup = async () => {
    const config = store.getState().wizard;
    setTimeout(() => {
      PortService.getInstance('SidePanel').message({ messenger: 'SidePanelMessenger', methodName: 'onRecordSync', message: config });
    }, 500);
    unsubscribe = store.subscribe(async () => {
      const config = store.getState().wizard;
      PortService.getInstance('SidePanel').message({ messenger: 'SidePanelMessenger', methodName: 'onRecordSync', message: config });
    });
  };

  const disconnect = () => {
    unsubscribe?.();
  };
  return { setup, disconnect };
})();
