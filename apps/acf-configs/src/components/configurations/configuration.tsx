import { Configuration as ConfigurationType } from '@dhruv-techapps/acf-common';
import React, { useEffect } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { ConfigType, getConfig } from '../../database';
import { downloadFile } from '../../storage';
import { download } from '../../util/common';
import { EXTENSIONS } from '../../util/constant';

export const Configuration: React.FC<{ configId?: string }> = ({ configId }) => {
  let { id } = useParams();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = React.useState<ConfigType>();
  const [file, setFile] = React.useState<ConfigurationType>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [extensionError, setExtensionError] = React.useState<string | null>(null);
  const [extensionMessage, setExtensionMessage] = React.useState<string | null>(null);

  if (configId) {
    id = configId;
  }

  useEffect(() => {
    // Fetch the configuration
    if (id) {
      getConfig(id)
        .then(async (_config) => {
          setConfig(_config);
          const configuration = await downloadFile(`users/${_config?.userId}/${id}.json`);
          setFile(configuration);
        })
        .catch((error) => {
          setError('Error while fetching configuration');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onExtensionClick = (extensionId: string) => {
    chrome.runtime
      .sendMessage(extensionId, { messenger: 'configs', methodName: 'exists', message: id })
      .then(({ result, error }) => {
        if (error) {
          setExtensionError('Error while checking configuration');
          return;
        }
        if (!result) {
          chrome.runtime
            .sendMessage(extensionId, { messenger: 'configs', methodName: 'install', message: file })
            .then(({ result }) => {
              if (result === 'done') {
                setExtensionMessage('Configuration installed successfully');
              }
            })
            .catch(console.error);
        } else {
          setExtensionError('Configuration already exists in this extension');
        }
      })
      .catch(console.error);
  };

  const onDownloadClick = () => {
    if (file && id) {
      download(file, id, searchParams.get('queryID'));
    }
  };

  if (!id) {
    return <h1>Configuration not found</h1>;
  }

  return (
    <div>
      <main className='container-fluid m-auto'>
        <div className='d-flex justify-content-center m-5'>
          {loading && <h1>Loading Configuration...</h1>}
          {!loading && error && <h1>{error}</h1>}
          {!loading && config && (
            <div>
              <h1>{config.name ?? 'Configuration'}</h1>
              <input type='hidden' value={config.userId} name='locationId' />
              <input type='hidden' value={id} name='fileId' />
              {file && (
                <table className='table table-bordered'>
                  <tbody>
                    <tr>
                      <th scope='col'>URL:</th>
                      <td>{config.url}</td>
                    </tr>
                    <tr>
                      <th scope='col'>User:</th>
                      <td>{config.userName}</td>
                    </tr>
                    <tr>
                      <th scope='col'>Load Type:</th>
                      <td>{file.loadType}</td>
                    </tr>
                    <tr>
                      <th scope='col'>Start Type:</th>
                      <td>{file.startType}</td>
                    </tr>
                    {file.startType === 'manual' && (
                      <tr>
                        <th scope='col'>Hot Key:</th>
                        <td>
                          {file.hotkey?.split('+').map((key, index) => (
                            <>
                              {index !== 0 && <b>+</b>}
                              <code key={key}>{key}</code>
                            </>
                          ))}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th scope='col'>Initial Wait:</th>
                      <td>{file.initWait ?? 0} sec</td>
                    </tr>
                    <tr>
                      <th scope='col'>Actions:</th>
                      <td>{file.actions.length}</td>
                    </tr>
                    {file.batch && (
                      <tr>
                        <th scope='col'>Batch:</th>
                        <td>{file.batch?.refresh ? 'on refresh' : `${file.batch?.repeat} repeat with ${file.batch?.repeatInterval} sec interval`}</td>
                      </tr>
                    )}
                    {file.actions.filter((action) => action.value?.includes('GoogleSheets')).length > 0 && (
                      <tr>
                        <th scope='col'>Google Sheets:</th>
                        <td>Require value from google sheets</td>
                      </tr>
                    )}
                    {config.created && (
                      <tr>
                        <th scope='col'>Created:</th>
                        <td>{config.created?.toDate().toDateString()}</td>
                      </tr>
                    )}
                    {config.updated && (
                      <tr>
                        <th scope='col'>Updated:</th>
                        <td>{config.updated?.toDate().toDateString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {config.tags && (
                <div className='mb-4'>
                  Tags:
                  {config.tags.map((tag) => (
                    <Badge bg='secondary' key={tag} className='ms-2'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {file && (
                <>
                  <div className='d-flex justify-content-start my-2'>
                    <Button variant='success' onClick={onDownloadClick}>
                      Download JSON
                    </Button>
                    {EXTENSIONS.filter((extension) => extension.version).map(({ id, name }) => (
                      <Button key={id} variant='primary' className='mx-2' onClick={() => onExtensionClick(id)}>
                        {name}
                      </Button>
                    ))}
                  </div>
                  <div>
                    {extensionError && (
                      <Alert variant='danger' dismissible>
                        {extensionError}
                      </Alert>
                    )}
                  </div>
                  <div>
                    {extensionMessage && (
                      <Alert variant='success' dismissible>
                        {extensionMessage}
                      </Alert>
                    )}
                  </div>
                  <JsonView src={file} enableClipboard={false} style={{ minWidth: '1300px' }} />
                </>
              )}
            </div>
          )}
          {!loading && !config && <h1>Configuration not found</h1>}
        </div>
      </main>
    </div>
  );
};
