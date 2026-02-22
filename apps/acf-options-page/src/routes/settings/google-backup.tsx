import { useConfirmationModalContext } from '@acf-options-page/_providers/confirm.provider';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { EAutoBackup } from '@dhruv-techapps/shared-google-drive/service';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth/service';
import { useEffect } from 'react';
import { Accordion, Button, Card, ListGroup, NavDropdown } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import { ErrorAlert } from '@acf-options-page/components';
import { firebaseSelector, switchFirebaseLoginModal } from '@acf-options-page/store/firebase';
import { googleDriveSelector, googleHasAccessAPI, googleLoginAPI, googleSelector } from '@acf-options-page/store/google';
import {
  googleDriveAutoBackupAPI,
  googleDriveBackupAPI,
  googleDriveDeleteAPI,
  googleDriveListWithContentAPI,
  googleDriveRestoreAPI
} from '@acf-options-page/store/google/google-drive/google-drive.api';
import { settingsSelector } from '@acf-options-page/store/settings/settings.slice';

export function SettingsGoogleBackup() {
  const { t } = useTranslation();
  const modalContext = useConfirmationModalContext();
  const {
    settings: { backup }
  } = useAppSelector(settingsSelector);
  const { user } = useAppSelector(firebaseSelector);
  const { grantedScopes, googleLoading } = useAppSelector(googleSelector);
  const { files, filesLoading, error } = useAppSelector(googleDriveSelector);

  const scope = GOOGLE_SCOPES.DRIVE;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI([scope]));
  };

  useEffect(() => {
    if ((!files || files.length === 0) && !filesLoading) {
      if (user) {
        if (grantedScopes.includes(scope)) {
          dispatch(googleDriveListWithContentAPI());
        } else {
          dispatch(googleHasAccessAPI([scope]));
        }
      }
    }
  }, [user, grantedScopes, scope, dispatch]);

  const onBackup = async (autoBackup?: EAutoBackup) => {
    if (autoBackup) {
      dispatch(googleDriveAutoBackupAPI(autoBackup));
    } else {
      dispatch(googleDriveBackupAPI());
    }
  };

  const restore = async (id: string, name: string) => {
    const result = await modalContext.showConfirmation({
      title: t('backup.confirm.restore.title'),
      message: t('backup.confirm.restore.message'),
      headerClass: 'text-danger'
    });
    result && dispatch(googleDriveRestoreAPI({ id, name }));
  };

  const deleteFile = async (id: string, name: string) => {
    dispatch(googleDriveDeleteAPI({ id, name }));
  };

  if (!user) {
    return (
      <p>
        <Trans i18nKey='backup.loginRequired'>
          Please
          <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
            Login
          </Button>
          to your account before connecting with Google Drive.
        </Trans>
      </p>
    );
  }

  if (googleLoading) {
    return (
      <div className='d-flex align-items-center justify-content-center'>
        <span className='spinner-border me-3' aria-hidden='true'></span>
        <span>{t('backup.checkingAccess')}</span>
      </div>
    );
  }

  if (!grantedScopes?.includes(scope)) {
    return (
      <div className='d-flex flex-column align-items-start'>
        <Button variant='link' onClick={connect} data-testid='google-backup-connect'>
          {t('backup.connect')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        {error && <ErrorAlert error={error} />}
        <b className='text-muted d-block mb-2'>{t('backup.connected')}</b>
      </div>
      <hr />
      <ol className='list-group'>
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-now' title={t('backup.now')} onClick={() => onBackup()}>
            <i className='bi bi-cloud-arrow-up-fill me-2' />
            {t('backup.now')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <h6 className='mt-4'>{t('backup.auto-backup')}</h6>
      <ol className='list-group'>
        <ListGroup.Item as='li' active={backup?.autoBackup === EAutoBackup.DAILY}>
          <NavDropdown.Item href='#backup-daily' title={t('backup.daily')} onClick={() => onBackup(EAutoBackup.DAILY)}>
            {t('backup.daily')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === EAutoBackup.WEEKLY}>
          <NavDropdown.Item href='#backup-weekly' title={t('backup.weekly')} onClick={() => onBackup(EAutoBackup.WEEKLY)}>
            {t('backup.weekly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === EAutoBackup.MONTHLY}>
          <NavDropdown.Item href='#backup-monthly' title={t('backup.monthly')} onClick={() => onBackup(EAutoBackup.MONTHLY)}>
            {t('backup.monthly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={!backup?.autoBackup || backup?.autoBackup === EAutoBackup.OFF}>
          <NavDropdown.Item href='#backup-off' title={t('backup.off')} onClick={() => onBackup(EAutoBackup.OFF)}>
            {t('backup.off')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <hr />
      <h6 className='mt-4'>{t('backup.restore')}</h6>
      {filesLoading ? (
        <div className='d-flex align-items-center '>
          <span className='spinner-border me-3' aria-hidden='true'></span>
          <span>{t('backup.loadingFiles')}</span>
        </div>
      ) : (
        <div>
          {files?.length !== 0 ? (
            <Accordion defaultActiveKey='0'>
              {files?.map((file) => (
                <Accordion.Item eventKey={file.id} key={file.id}>
                  <Accordion.Header>
                    {file.name} <small className='ms-2'>{new Date(file.modifiedTime).toLocaleString()}</small>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Button onClick={() => restore(file.id, file.name)} variant='link' type='button' size='sm' className='text-danger'>
                      <i className='bi bi-cloud-arrow-down-fill me-2' />
                      {t('backup.restoreAction')}
                    </Button>
                    <Button onClick={() => deleteFile(file.id, file.name)} variant='link' type='button' size='sm' className='text-danger'>
                      <i className='bi bi-trash me-2' />
                      {t('backup.delete')}
                    </Button>
                    <Card>
                      <pre>{JSON.stringify(file.content, null, 2)}</pre>
                    </Card>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <div>{t('backup.noBackup')}</div>
          )}
        </div>
      )}
    </>
  );
}
