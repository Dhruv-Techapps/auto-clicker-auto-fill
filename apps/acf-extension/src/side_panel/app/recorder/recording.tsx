import { IConfiguration } from '@dhruv-techapps/acf-common';
import { ERecordMethod, WIZARD } from '../../../common/constant';

interface IRecordProps {
  tabId: number;
  config: IConfiguration | null;
  setTabId: (tabId: number | null) => void;
  setConfig: (config: IConfiguration | null) => void;
}
export const Recording = ({ config, tabId, setTabId, setConfig }: IRecordProps) => {
  const autoGenerateConfig = () => {
    chrome.tabs.sendMessage(tabId, { messenger: WIZARD, methodName: ERecordMethod.AutoGenerateConfig });
  };

  const stopRecording = () => {
    chrome.tabs.sendMessage(tabId, { messenger: WIZARD, methodName: ERecordMethod.StopRecording });
    setTabId(null);
    setConfig(null);
  };

  return (
    <div>
      <div className='d-grid'>
        <button type='button' className='btn btn-lg btn-danger mb-3' onClick={stopRecording}>
          Stop Recording
        </button>
      </div>
      {!config ? (
        <div className='card w-100'>
          <div className='card-body'>
            <h5 className='card-title mb-3 text-primary'>Start filling form...</h5>
            <hr />
            <h6 className='card-subtitle mb-2 text-muted'>If you have already filled form</h6>
            <button type='button' className='btn btn-outline-secondary' onClick={autoGenerateConfig}>
              Already Filled ?
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className='mt-3'>{config.name || config.url}</h3>
          <ul className='list-group list-group-numbered'>
            {config.actions.map((action) => {
              if (action.type !== 'userscript') {
                return (
                  <li className='list-group-item d-flex justify-content-between align-items-start' key={action.id}>
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold text-truncate d-inline-block' style={{ width: 'calc(100vw - 136px)' }} title={action.name || ('elementFinder' in action ? action.elementFinder : '')}>
                        {action.name || ('elementFinder' in action ? action.elementFinder : '')}
                      </div>
                      <small className='text-truncate d-inline-block' style={{ width: 'calc(100vw - 136px)' }} title={action.value}>
                        {action.value ?? 'click'}
                      </small>
                    </div>
                    <span className='badge text-bg-primary rounded-pill'>{action.elementType}</span>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </>
      )}
    </div>
  );
};
