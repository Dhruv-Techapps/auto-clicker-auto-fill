import { IConfiguration, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import type { MouseEvent } from 'react';

interface IItemProps extends IConfiguration {
  className?: string;
}

export const Item = (config: IItemProps) => {
  const onConfigRunClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.id) {
        sendRunConfigMessage(currentTab.id);
      }
    });
  };

  const sendRunConfigMessage = (tabId: number) => {
    chrome.tabs.sendMessage(Number(tabId), { configId: config.id, action: RUNTIME_MESSAGE_ACF.RUN_CONFIG });
  };

  const onConfigEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ messenger: RUNTIME_MESSAGE_ACF.TABS, methodName: 'openOptionsPage', message: { configId: config.id } }, console.log);
  };

  return (
    <a className={`list-group-item list-group-item-action rounded-3 border-1 ${config.enable ? '' : 'disabled'} ${config.className ?? ''}`} key={config.id} onClick={onConfigRunClick}>
      <div>
        {config.enable ? (
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-play-circle-fill me-2' viewBox='0 0 16 16'>
            <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z' />
          </svg>
        ) : (
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-ban me-2' viewBox='0 0 16 16'>
            <path d='M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0' />
          </svg>
        )}
        {config.name}
      </div>
      <button type='button' className='btn' onClick={onConfigEditClick} title='Edit Configuration'>
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-box-arrow-up-right' viewBox='0 0 16 16'>
          <path
            fill-rule='evenodd'
            d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5'
          />
          <path fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z' />
        </svg>
      </button>
    </a>
  );
};
