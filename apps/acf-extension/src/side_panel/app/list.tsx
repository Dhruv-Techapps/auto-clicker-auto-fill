import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useEffect, useState } from 'preact/hooks';
import { Item } from './item';

interface IListProps {
  query: string;
  url?: string;
}

export const List = (props: IListProps) => {
  const { query, url } = props;
  const [list, setList] = useState<IConfiguration[]>([]);
  const [matchedConfigs, setMatchedConfigs] = useState<IConfiguration[]>([]);
  const [unMatchedConfigs, setUnMatchedConfigs] = useState<IConfiguration[]>([]);

  useEffect(() => {
    chrome.storage.local.get<{ configs: IConfiguration[] }>(['configs'], (result) => {
      if (result.configs) {
        setList(result.configs);
      }
    });
  }, []);

  useEffect(() => {
    const matched: IConfiguration[] = [];
    const unMatched: IConfiguration[] = [];
    list.forEach((config) => {
      if (url && config.url.includes(url)) {
        matched.push(config);
      } else {
        unMatched.push(config);
      }
    });
    setMatchedConfigs(matched);
    setUnMatchedConfigs(unMatched);
  }, [url, list]);

  return (
    <main>
      {matchedConfigs.length > 0 && (
        <>
          <h3>
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-check-circle-fill me-2' viewBox='0 0 16 16'>
              <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z' />
            </svg>{' '}
            Matched
          </h3>
          <div className='list-group d-grid gap-2'>
            {matchedConfigs
              .filter((config) => config.name?.includes(query) || config.url.includes(query))
              .map((config) => (
                <Item key={config.id} {...config} className='list-group-item-primary' />
              ))}
          </div>
        </>
      )}
      {unMatchedConfigs.length > 0 && (
        <>
          <h3 className='mt-3'>Other</h3>
          <div className='list-group d-grid gap-2'>
            {unMatchedConfigs
              .filter((config) => config.name?.includes(query) || config.url.includes(query))
              .map((config) => (
                <Item key={config.id} {...config} className='list-group-item-secondary' />
              ))}
          </div>
        </>
      )}
    </main>
  );
};
