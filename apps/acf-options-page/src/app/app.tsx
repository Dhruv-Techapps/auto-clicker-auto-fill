import ConfirmationModalContextProvider from '@acf-options-page/_providers/confirm.provider';
import { StorageService } from '@dhruv-techapps/core-service';
import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { DataList, Loading, ToastHandler } from '../components';
import { BlogModal, ExtensionNotFoundModal } from '../modal';
import { LoginModal } from '../modal/login.modal';
import { SubscribeModal } from '../modal/subscribe.modal';
import { getManifest } from '../store/app.api';
import { appSelector } from '../store/app.slice';
import { firebaseIsLoginAPI, firebaseSelector } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Configs from './configs/configs';
import Header from './header';

function App() {
  const { loading, error, errorButton } = useAppSelector(appSelector);
  const [show, setShow] = useState(localStorage.getItem('login') !== 'true');
  const { user } = useAppSelector(firebaseSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    StorageService.get<string>('device_info').then(({ device_info: { id: deviceId } }) => {
      Sentry.setContext('device_info', { device_id: deviceId });
      window.dataLayer.push({ device_id: deviceId });
    });
  }, []);

  useEffect(() => {
    dispatch(getManifest());
    dispatch(firebaseIsLoginAPI());
    Sentry.setContext('screen_resolution', {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    });
  }, [dispatch]);

  const onCloseAlert = () => {
    setShow(false);
    localStorage.setItem('login', 'true');
  };

  return (
    <>
      <ConfirmationModalContextProvider>
        <Header />
        {show && !user && (
          <Alert variant='warning' onClose={onCloseAlert} dismissible>
            Please log in to Auto Clicker Auto Fill to access Discord and Google Sheets features.
          </Alert>
        )}
        {loading && <Loading message='Connecting with extension...' className='m-5 p-5' />}
        <Configs error={error} errorButton={errorButton} />
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
