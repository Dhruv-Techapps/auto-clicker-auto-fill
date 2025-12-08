import { useEffect, useState } from 'preact/hooks';
import { Footer } from './footer';
import { Header } from './header';
import { List } from './list';

export const App = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    let port: chrome.runtime.Port | null = null;
    chrome.runtime.onConnect.addListener((_port) => {
      console.log('App port connected', _port.name);
      if (_port.name !== 'SidePanel') return;
      port = _port;
      port?.onMessage.addListener((msg) => {
        console.log('App port message received', msg);
        if (msg.messenger === 'SidePanelMessenger') {
          if (msg.message === null || msg.message === undefined) {
            setUrl('');
            return;
          }
          setUrl(new URL(msg.message).hostname);
        }
      });
    });
    return () => {
      port?.disconnect();
      console.log('App port disconnected');
    };
  }, []);
  console.log('Rendering App with url:', url);
  return (
    <>
      <Header query={query} setQuery={setQuery} />
      <List query={query} url={url} />
      <Footer />
    </>
  );
};
