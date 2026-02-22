import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettingsNotification } from '@acf-options-page/store/settings/settings.slice';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SettingDiscord } from './discord';

function SettingNotifications() {
  const { t } = useTranslation();

  const { notifications } = useAppSelector(settingsSelector).settings;

  const dispatch = useAppDispatch();
  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue<boolean>(e, notifications);
    if (update) {
      dispatch(updateSettingsNotification(update));
    }
  };

  return (
    <>
      <h5>{t('notification.title')}</h5>
      <ol className='list-group' data-testid='settings-notifications'>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='notifications.onError'>
            <div className='fw-bold'>{t('notification.error')}</div>
          </Form.Label>
          <Form.Check type='switch' name='onError' checked={notifications?.onError || false} onChange={onUpdate} id='notifications.onError' />
        </li>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='notifications.onStep'>
            <div className='fw-bold'>{t('notification.action')} </div>
          </Form.Label>
          <Form.Check type='switch' name='onAction' checked={notifications?.onAction || false} onChange={onUpdate} id='notifications.onStep' />
        </li>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='notifications.onLoop'>
            <div className='fw-bold'>{t('notification.loop')}</div>
          </Form.Label>
          <Form.Check type='switch' name='onBatch' checked={notifications?.onBatch || false} onChange={onUpdate} id='notifications.onLoop' />
        </li>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='notifications.onAutomation'>
            <div className='fw-bold'>{t('notification.automation')}</div>
          </Form.Label>
          <Form.Check type='switch' name='onConfig' checked={notifications?.onConfig || false} onChange={onUpdate} id='notifications.onAutomation' />
        </li>
      </ol>
      <hr />
      <ol className='list-group'>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='notifications.sound'>
            <div className='fw-bold'>
              {t('notification.sound')} <span>{notifications?.sound ? <i className='bi bi-volume-up' /> : <i className='bi bi-volume-mute' />}</span>
            </div>
          </Form.Label>
          <Form.Check type='switch' onChange={onUpdate} name='sound' checked={notifications?.sound || false} id='notifications.sound' />
        </li>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <SettingDiscord onChange={onUpdate} checked={notifications?.discord || false} />
        </li>
      </ol>
    </>
  );
}

export { SettingNotifications };
