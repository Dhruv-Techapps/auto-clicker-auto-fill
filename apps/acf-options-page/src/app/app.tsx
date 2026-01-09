import ConfirmationModalContextProvider from '@acf-options-page/_providers/confirm.provider';
import { CHROME_WEB_STORE } from '@acf-options-page/util/constants';
import { StorageService } from '@dhruv-techapps/core-service';

import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { DataList, Loading, ToastHandler } from '../components';
import { BlogModal, ExtensionNotFoundModal } from '../modal';
import { LoginModal } from '../modal/login.modal';
import { SubscribeModal } from '../modal/subscribe.modal';
import { getManifest } from '../store/app.api';
import { appSelector } from '../store/app.slice';
import { firebaseIsLoginAPI } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Configs from './configs/configs';
import Header from './header';

function App() {
  const { loading, error, errorButton } = useAppSelector(appSelector);
  const dispatch = useAppDispatch();
  const { manifest } = useAppSelector(appSelector);
  useEffect(() => {
    StorageService.get<string>('device_info').then(({ device_info: { id: deviceId } }) => {
      window.dataLayer.push({ device_id: deviceId });
    });
  }, []);

  useEffect(() => {
    dispatch(getManifest());
    dispatch(firebaseIsLoginAPI());
  }, [dispatch]);

  function compareVersions(a: string, b: string): number {
    const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
    const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const da = pa[i] ?? 0;
      const db = pb[i] ?? 0;
      if (da > db) return 1;
      if (da < db) return -1;
    }
    return 0;
  }

  return (
    <>
      <ConfirmationModalContextProvider>
        {manifest?.version && compareVersions(manifest.version, '4.1.9') < 0 && (
          <Alert variant='warning' className='mb-0 text-center p-1 rounded-0'>
            <strong>Security Update Required:</strong> A newer version of <strong>Auto Clicker & Auto Fill</strong> is available and includes fixes for recently identified security vulnerabilities.
            <a href='https://github.com/advisories/GHSA-wphj-fx3q-84ch' target='_blank' rel='noopener noreferrer' className='alert-link ms-1'>
              Learn more
            </a>
            .<span className='d-inline-block ms-1'>Please update to the latest version to stay protected.</span>
          </Alert>
        )}
        {error && (
          <Alert variant='danger' className='mb-0 text-center p-1 rounded-0'>
            <p className='m-0'>
              {error}
              {errorButton && (
                <Alert.Link href={`${CHROME_WEB_STORE}${import.meta.env.VITE_PUBLIC_CHROME_EXTENSION_ID}`} target='_blank' className='ms-2'>
                  download
                </Alert.Link>
              )}
            </p>
          </Alert>
        )}
        <Header />
        {loading && <Loading message='Connecting with extension...' className='m-5 p-5' />}
        <Configs />
        <ToastHandler />
        <BlogModal />
        <SubscribeModal />
        <LoginModal />
        <ExtensionNotFoundModal />
      </ConfirmationModalContextProvider>
      <DataList />
    </>
  );
}

export default App;
