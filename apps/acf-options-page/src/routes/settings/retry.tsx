import { InputBounded } from '@acf-options-page/form/input-bounded';
import { InputInterval } from '@acf-options-page/form/input-interval';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettings } from '@acf-options-page/store/settings/settings.slice';
import { EErrorOptions, ISettings } from '@dhruv-techapps/acf-common';
import { Button, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type RetryFormValues = Pick<ISettings, 'retry' | 'retryInterval' | 'retryOption' | 'retryIntervalTo'>;

function SettingRetry() {
  const { t } = useTranslation();
  const { settings } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();

  const form = useForm<RetryFormValues>({
    defaultValues: {
      retry: settings.retry,
      retryInterval: settings.retryInterval,
      retryIntervalTo: settings.retryIntervalTo,
      retryOption: settings.retryOption
    },
    mode: 'onChange'
  });

  const { register, handleSubmit, reset, formState } = form;
  const { isValid, isDirty } = formState;

  const onSubmit = (data: RetryFormValues) => {
    dispatch(updateSettings(data));
    reset(data);
  };

  const onCancel = () => {
    reset({
      retry: settings.retry,
      retryInterval: settings.retryInterval,
      retryOption: settings.retryOption,
      retryIntervalTo: settings.retryIntervalTo
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onCancel} data-testid='settings-retry-form'>
      <Card bg='warning-subtle' text='warning-emphasis'>
        <Card.Body className='d-flex gap-3'>
          <InputBounded title={'retry.title'} name='retry' form={form} dataTestId='settings-retry-retry' />
          <InputInterval title={'retry.interval'} name='retryInterval' rangeName='retryIntervalTo' form={form} dataTestId='settings-retry-interval' />
        </Card.Body>
      </Card>
      <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
        <Card.Body>
          <p>{t('retry.hint')}</p>
          <div className='d-flex justify-content-between mt-3'>
            <Form.Check type='radio' value={EErrorOptions.STOP} label={t('retry.stop')} data-testid='settings-retry-option-stop' {...register('retryOption')} />
            <Form.Check type='radio' value={EErrorOptions.SKIP} label={t('retry.skip')} data-testid='settings-retry-option-skip' {...register('retryOption')} />
            <Form.Check type='radio' value={EErrorOptions.RELOAD} label={t('retry.refresh')} data-testid='settings-retry-option-reload' {...register('retryOption')} />
          </div>
        </Card.Body>
      </Card>
      <div className='d-flex justify-content-end gap-2 mt-3'>
        <Button variant='outline-secondary' type='reset' data-testid='settings-retry-cancel'>
          {t('common.cancel')}
        </Button>
        <Button type='submit' variant='primary' disabled={!isDirty || !isValid} data-testid='settings-retry-save'>
          {t('common.save')}
        </Button>
      </div>
    </Form>
  );
}
export { SettingRetry };
