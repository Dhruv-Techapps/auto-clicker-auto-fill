import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettings } from '@acf-options-page/store/settings';
import { getFieldNameValue } from '@acf-options-page/utils';
import { STATUS_BAR_LOCATION_ENUM } from '@dhruv-techapps/shared-status-bar';
import { t } from 'i18next';
import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

export const CommonSettings = () => {
  const { settings } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();
  const onUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateSettings(update));
    }
  };

  return (
    <ol className='list-group' data-testid='settings-common'>
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2 me-auto' htmlFor='settings-checkiFrames'>
          <div className='fw-bold'>{t('modal.settings.checkIFrames')}</div>
          {t('modal.settings.checkIFramesHint')}
        </Form.Label>
        <FormCheck type='switch' name='checkiFrames' onChange={onUpdate} id='settings-checkiFrames' checked={settings.checkiFrames || false} />
      </li>
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2 me-auto' htmlFor='settings-reload-onerror'>
          <div className='fw-bold'>{t('modal.settings.reloadOnError')}</div>
          {t('modal.settings.reloadOnErrorHint')} <br />
          <small className='text-danger'>Extension context invalidated.</small>
        </Form.Label>
        <FormCheck type='switch' name='reloadOnError' onChange={onUpdate} id='settings-reloadOnError' checked={settings.reloadOnError || false} />
      </li>
      <li className='list-group-item d-flex justify-content-between align-items-center'>
        <Form.Label className='ms-2' htmlFor='settings-statusBar'>
          <div className='fw-bold'>{t('modal.settings.statusBar.title')}</div>
          {t('modal.settings.statusBar.hint')}
        </Form.Label>
        {Object.values(STATUS_BAR_LOCATION_ENUM).map((location) => (
          <input
            className='form-check-input'
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
  );
};
