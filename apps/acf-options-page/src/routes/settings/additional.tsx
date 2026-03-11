import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettings } from '@acf-options-page/store/settings';
import { ISettings } from '@dhruv-techapps/acf-common';
import { STATUS_BAR_LOCATION_ENUM } from '@dhruv-techapps/shared-status-bar/service';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AdditionalFormValues = Pick<ISettings, 'checkiFrames' | 'reloadOnError' | 'statusBar'>;

export const AdditionalSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector(settingsSelector);

  const form = useForm<AdditionalFormValues>({
    defaultValues: {
      checkiFrames: settings.checkiFrames,
      reloadOnError: settings.reloadOnError,
      statusBar: settings.statusBar
    },
    mode: 'onChange'
  });

  const { register, handleSubmit, reset, formState } = form;
  const { isDirty } = formState;

  useEffect(() => {
    reset({
      checkiFrames: settings.checkiFrames,
      reloadOnError: settings.reloadOnError,
      statusBar: settings.statusBar
    });
  }, [settings, reset]);

  const onSubmit = (data: AdditionalFormValues) => {
    dispatch(updateSettings(data));
    reset(data);
  };

  const onCancel = () => {
    reset({
      checkiFrames: settings.checkiFrames,
      reloadOnError: settings.reloadOnError,
      statusBar: settings.statusBar
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onCancel} data-testid='settings-additional-form'>
      <ul>
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 me-auto' htmlFor='settings-checkiFrames'>
            <div className='fw-bold'>{t('checkIFrames.title')}</div>
            <small className='text-body-tertiary'>{t('checkIFrames.hint')}</small>
          </Form.Label>
          <Form.Check type='switch' id='settings-checkiFrames' data-testid='settings-additional-checkiFrames' {...register('checkiFrames')} />
        </li>
        <hr />
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 me-auto' htmlFor='settings-reload-onerror'>
            <div className='fw-bold'>{t('reloadOnError.title')}</div>
            <small className='text-body-tertiary'>{t('reloadOnError.hint')}</small> <br />
            <small className='text-danger-emphasis'>{t('reloadOnError.contextInvalidated')}</small>
          </Form.Label>
          <Form.Check type='switch' id='settings-reloadOnError' data-testid='settings-additional-reloadOnError' {...register('reloadOnError')} />
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
              id={`settings-statusBar-${location}`}
              label={t(`statusBar.positions.${location}`)}
              data-testid={`settings-additional-statusBar-${location}`}
              {...register('statusBar')}
            />
          ))}
        </li>
      </ul>
      <div className='d-flex justify-content-end gap-2 mt-3'>
        <Button variant='outline-secondary' type='reset' data-testid='settings-additional-cancel'>
          {t('common.cancel')}
        </Button>
        <Button type='submit' variant='primary' disabled={!isDirty} data-testid='settings-additional-save'>
          {t('common.save')}
        </Button>
      </div>
    </Form>
  );
};
