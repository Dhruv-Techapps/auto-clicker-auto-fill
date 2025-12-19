import { ERecordMethod, WIZARD } from '../../../common/constant';

interface IStartRecordingProps {
  setTabId: (tabId: number) => void;
}

export const StartRecording = (props: IStartRecordingProps) => {
  const startRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.id) {
        props.setTabId(currentTab.id);
        chrome.tabs.sendMessage(currentTab.id, { messenger: WIZARD, methodName: ERecordMethod.StartRecording });
      }
    });
  };

  return (
    <div className='d-grid'>
      <button type='button' className='btn btn-lg btn-primary mb-3' onClick={startRecording}>
        Start Recording
      </button>
    </div>
  );
};
