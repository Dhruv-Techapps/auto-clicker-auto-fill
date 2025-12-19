import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useState } from 'preact/hooks';
import { Recording } from './recording';
import { StartRecording } from './start-recording';

interface IRecordProps {
  config: IConfiguration | null;
  setConfig: (config: IConfiguration | null) => void;
}

export const Recorder = ({ config, setConfig }: IRecordProps) => {
  const [tabId, setTabId] = useState<number | null>(null);
  return tabId === null ? <StartRecording setTabId={setTabId} /> : <Recording config={config} setConfig={setConfig} tabId={tabId} setTabId={setTabId} />;
};
