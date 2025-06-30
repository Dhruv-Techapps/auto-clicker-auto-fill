import { STATUS_BAR_LOCATION_ENUM } from '@dhruv-techapps/shared-status-bar';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorAlert, Loading } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { settingsGetAPI } from '../store/settings/settings.api';
import { settingsSelector, switchSettingsModal, updateSettings } from '../store/settings/settings.slice';
import { themeSelector } from '../store/theme.slice';
import { getFieldNameValue } from '../util/element';
import { SettingsGoogleBackup } from './settings/google-backup';
import { SettingGoogleSheets } from './settings/google-sheets';
import { SettingMessage } from './settings/message';
import { SettingNotifications } from './settings/notifications';
import { SettingRetry } from './settings/retry';
enum SETTINGS_PAGE {
  NOTIFICATION = 'Show Notification',
  RETRY = 'Retry',
  BACKUP = 'Backup',
  SHEETS = 'Google Sheets'
}

export const SettingsModal = () => {
  const { t } = useTranslation();
  const theme = useAppSelector(themeSelector);
  const [page, setPage] = useState<SETTINGS_PAGE>();
  const { error, settings, visible, loading } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(switchSettingsModal());
  };

  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(settingsGetAPI());
      //dispatch(googleGetAPI());
    }
  }, [dispatch]);

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateSettings(update));
    }
  };

  const onShow = () => {
    //:TODO
  };

  return (
    <Modal show={visible} onHide={handleClose} size='lg' onShow={onShow} data-testid='settings-modal'>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>
            {page ? (
              <Button onClick={() => setPage(undefined)} data-testid='settings-back-button' variant='link' className='me-2 p-0 d-inline-flex align-items-center'>
                <i className='bi bi-chevron-left' />
              </Button>
            ) : (
              <>{t('modal.settings.title')}</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorAlert error={error} />
          {loading && <Loading />}
          {!page && (
            <ol className='list-group'>
              <li className='list-group-item'>
                <Button onClick={() => setPage(SETTINGS_PAGE.NOTIFICATION)} variant={theme} className='d-flex align-items-center justify-content-between w-100' data-testid='settings-notification'>
                  <div className='fw-bold'>
                    <i className='bi bi-bell-fill me-2' />
                    {t('modal.settings.notification.title')}
                  </div>
                  <i className='bi bi-chevron-right' />
                </Button>
              </li>
              <li className='list-group-item'>
                <Button onClick={() => setPage(SETTINGS_PAGE.RETRY)} variant={theme} className='d-flex align-items-center justify-content-between w-100' data-testid='settings-retry'>
                  <div className='fw-bold'>
                    <i className='bi bi-arrow-repeat me-2' />
                    {t('modal.settings.retry.title')}
                  </div>
                  <i className='bi bi-chevron-right' />
                </Button>
              </li>
              <li className='list-group-item'>
                <Button onClick={() => setPage(SETTINGS_PAGE.BACKUP)} variant={theme} className='d-flex align-items-center justify-content-between w-100' data-testid='settings-backup'>
                  <div className='fw-bold'>
                    <i className='bi bi-cloud-arrow-up-fill me-2' />
                    Backup
                  </div>
                  <i className='bi bi-chevron-right' />
                </Button>
              </li>
              <li className='list-group-item'>
                <Button onClick={() => setPage(SETTINGS_PAGE.SHEETS)} variant={theme} className='d-flex align-items-center justify-content-between w-100' data-testid='settings-backup'>
                  <div className='fw-bold'>
                    <i className='bi bi-file-spreadsheet-fill me-2' />
                    Google Sheets
                  </div>
                  <i className='bi bi-chevron-right' />
                </Button>
              </li>
              <li className='list-group-item d-flex justify-content-between align-items-center'>
                <Form.Label className='ms-2 me-auto' htmlFor='settings-checkiFrames'>
                  <div className='fw-bold'>{t('modal.settings.checkIFrames')}</div>
                  {t('modal.settings.checkIFramesHint')}
                </Form.Label>
                <Form.Check type='switch' name='checkiFrames' onChange={onUpdate} id='settings-checkiFrames' checked={settings.checkiFrames || false} />
              </li>
              <li className='list-group-item d-flex justify-content-between align-items-center'>
                <Form.Label className='ms-2 me-auto' htmlFor='settings-reload-onerror'>
                  <div className='fw-bold'>{t('modal.settings.reloadOnError')}</div>
                  {t('modal.settings.reloadOnErrorHint')} <br />
                  <small className='text-danger'>Extension context invalidated.</small>
                </Form.Label>
                <Form.Check type='switch' name='reloadOnError' onChange={onUpdate} id='settings-reloadOnError' checked={settings.reloadOnError || false} />
              </li>
              <li className='list-group-item d-flex justify-content-between align-items-center'>
                <Form.Label className='ms-2' htmlFor='settings-statusBar'>
                  <div className='fw-bold'>{t('modal.settings.statusBar.title')}</div>
                  {t('modal.settings.statusBar.hint')}
                </Form.Label>
                {Object.values(STATUS_BAR_LOCATION_ENUM).map((location) => (
                  <Form.Check
                    key={location}
                    type='radio'
                    value={location}
                    name='statusBar'
                    onChange={onUpdate}
                    id={`settings-statusBar-${location}`}
                    checked={settings.statusBar === location}
                    label={t(`modal.settings.statusBar.${location}`)}
                  />
                ))}
              </li>
            </ol>
          )}
          {page === SETTINGS_PAGE.NOTIFICATION && <SettingNotifications />}
          {page === SETTINGS_PAGE.RETRY && <SettingRetry />}
          {page === SETTINGS_PAGE.BACKUP && <SettingsGoogleBackup />}
          {page === SETTINGS_PAGE.SHEETS && <SettingGoogleSheets />}
        </Modal.Body>
        <SettingMessage />
      </Form>
    </Modal>
  );
};
