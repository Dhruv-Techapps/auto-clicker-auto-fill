'use client';

import { ExtensionNotFoundAlert } from '@acf-options-page/alerts/extension-not-found-alert';
import { VersionAlert } from '@acf-options-page/alerts/version-alert';
import { LoadingBar } from '@acf-options-page/components';
import { DataList } from '@acf-options-page/components/data-list.components';
import { ToastHandler } from '@acf-options-page/components/toast-handler.component';
import { LoginModal } from '@acf-options-page/modal/login.modal';
import { getManifest } from '@acf-options-page/store/app.api';
import { appSelector } from '@acf-options-page/store/app.slice';
import { configGetAllAPI } from '@acf-options-page/store/config/config.api';
import { firebaseIsLoginAPI } from '@acf-options-page/store/firebase/firebase-login.api';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { StorageService } from '@dhruv-techapps/core-service';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './sidebar';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(appSelector);

  useEffect(() => {
    StorageService.get<string>('device_info').then(({ device_info: { id: deviceId } }) => {
      window.dataLayer.push({ device_id: deviceId });
    });
  }, []);

  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(configGetAllAPI());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getManifest());
    dispatch(firebaseIsLoginAPI());
  }, [dispatch]);

  return (
    <>
      {loading && <LoadingBar />}
      <div className={`d-flex h-100 pt-${loading ? '1' : '0'}`}>
        <Sidebar />
        <main className='d-flex flex-column flex-grow-1 h-100'>
          <VersionAlert />
          <ExtensionNotFoundAlert />
          <Outlet />
        </main>
      </div>
      <LoginModal />
      <ToastHandler />
      <DataList />
    </>
  );
};
