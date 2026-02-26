import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettings } from '@acf-options-page/store/settings';
import { getFieldNameValue } from '@acf-options-page/util';
import { STATUS_BAR_LOCATION_ENUM } from '@dhruv-techapps/shared-status-bar/service';
import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const AdditionalSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector(settingsSelector);
  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateSettings(update));
    }
  };

  return (
    <ul>
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2 me-auto' htmlFor='settings-checkiFrames'>
          <div className='fw-bold'>{t('checkIFrames.title')}</div>
          <small className='text-body-tertiary'>{t('checkIFrames.hint')}</small>
        </Form.Label>
        <Form.Check type='switch' name='checkiFrames' onChange={onUpdate} id='settings-checkiFrames' checked={settings.checkiFrames || false} />
      </li>
      <hr />
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2 me-auto' htmlFor='settings-reload-onerror'>
          <div className='fw-bold'>{t('reloadOnError.title')}</div>
          <small className='text-body-tertiary'>{t('reloadOnError.hint')}</small> <br />
          <small className='text-danger-emphasis'>{t('reloadOnError.contextInvalidated')}</small>
        </Form.Label>
        <Form.Check type='switch' name='reloadOnError' onChange={onUpdate} id='settings-reloadOnError' checked={settings.reloadOnError || false} />
      </li>
      <hr />
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2' htmlFor='settings-statusBar'>
          <div className='fw-bold'>{t('statusBar.title')}</div>
          <small className='text-body-tertiary'>{t('statusBar.hint')}</small>
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
            label={t(`statusBar.positions.${location}`)}
          />
        ))}
      </li>
    </ul>
  );
};
