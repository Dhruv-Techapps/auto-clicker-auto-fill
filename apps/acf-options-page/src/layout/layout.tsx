'use client';

import { ExtensionNotFoundAlert, VersionAlert } from '@acf-options-page/alerts';
import { DataList, LoadingBar, ToastHandler } from '@acf-options-page/components';
import { LoginModal } from '@acf-options-page/modal';
import { appSelector, configGetAllAPI, firebaseIsLoginAPI, getManifest, useAppDispatch, useAppSelector } from '@acf-options-page/store';
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
