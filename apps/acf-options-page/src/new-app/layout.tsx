'use client';

import { Loading } from '@acf-options-page/components/loading.components';
import { getManifest } from '@acf-options-page/store/app.api';
import { appSelector } from '@acf-options-page/store/app.slice';
import { firebaseIsLoginAPI } from '@acf-options-page/store/firebase/firebase-login.api';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { StorageService } from '@dhruv-techapps/core-service';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { ExtensionNotFoundAlert } from './alerts/extension-not-found-alert';
import { VersionAlert } from './alerts/version-alert';
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
    dispatch(getManifest());
    dispatch(firebaseIsLoginAPI());
  }, [dispatch]);

  return (
    <>
      <VersionAlert />
      <ExtensionNotFoundAlert />
      {loading && <Loading message='Connecting with extension...' className='m-5 p-5' />}
      <div className='d-flex flex-nowrap w-100 h-100'>
        <Sidebar />
        <main className='w-100 h-100 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </>
  );
};
