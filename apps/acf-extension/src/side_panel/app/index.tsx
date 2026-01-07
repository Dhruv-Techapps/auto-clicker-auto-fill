import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useEffect, useState } from 'preact/hooks';
import { Footer } from './footer';
import { Header, TPage } from './header';
import { List } from './list';
import { Recorder } from './recorder';

export const App = () => {
  const [url, setUrl] = useState('');
  const [page, setPage] = useState<TPage>('list');
  const [config, setConfig] = useState<IConfiguration | null>(null);

  const process = (msg: { methodName: string; message: unknown; messenger: string }) => {
    switch (msg.methodName) {
      case 'onRecordSync':
        setConfig(msg.message as IConfiguration);
        return;
      default:
        if (msg.message === null || msg.message === undefined) {
          setUrl('');
          return;
        }
        setUrl(new URL(msg.message as string).hostname);
        break;
    }
  };

  useEffect(() => {
    let port: chrome.runtime.Port | null = null;
    chrome.runtime.onConnect.addListener((_port) => {
      if (_port.name !== 'SidePanel') return;
      port = _port;
      port?.onMessage.addListener((msg) => {
        if (msg.messenger === 'SidePanelMessenger') {
          process(msg);
        }
      });
    });
    return () => {
      port?.disconnect();
    };
  }, []);

  return (
    <>
      <Header page={page} setPage={setPage} />
      <main className='container-fluid p-3'>{page === 'list' ? <List url={url} /> : <Recorder config={config} setConfig={setConfig} />}</main>
      <Footer />
    </>
  );
};
