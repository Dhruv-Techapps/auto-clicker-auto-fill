'use client';

import { ExtensionNotFoundAlert } from '@acf-options-page/alerts/extension-not-found-alert';
import { VersionAlert } from '@acf-options-page/alerts/version-alert';
import { Loading } from '@acf-options-page/components/loading.components';
import { LoginModal } from '@acf-options-page/modal/login.modal';
import { getManifest } from '@acf-options-page/store/app.api';
import { appSelector } from '@acf-options-page/store/app.slice';
import { firebaseIsLoginAPI } from '@acf-options-page/store/firebase/firebase-login.api';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { StorageService } from '@dhruv-techapps/core-service';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Sidebar } from './sidebar';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(appSelector);
  const { t } = useTranslation();

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
      {loading && <Loading message={t('status.connecting')} className='text-secondary' />}
      <div className='d-flex flex-nowrap w-100 h-100'>
        <Sidebar />
        <main className='w-100 h-100 overflow-auto'>
          <VersionAlert />
          <ExtensionNotFoundAlert />
          <Outlet />
        </main>
        <LoginModal />
      </div>
    </>
  );
};
