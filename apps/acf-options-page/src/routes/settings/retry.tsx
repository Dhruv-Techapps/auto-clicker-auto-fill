import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector, updateSettings } from '@acf-options-page/store/settings/settings.slice';
import { REGEX } from '@acf-options-page/util';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { EErrorOptions } from '@dhruv-techapps/acf-common';
import { ChangeEvent } from 'react';
import { Card, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function SettingRetry() {
  const { t } = useTranslation();
  const { settings } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();
  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateSettings(update));
    }
  };

  return (
    <>
      <Card bg='warning-subtle' text='warning-emphasis'>
        <Card.Body className='d-flex gap-3'>
          <InputGroup>
            <InputGroup.Text>{t('retry.title')}</InputGroup.Text>
            <FormControl placeholder='5' autoComplete='off' name='retry' value={settings.retry} onBlur={onUpdate} type='number' pattern={REGEX.NUMBER.source} list='retry' />
            <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>
              {t('retry.interval')}&nbsp;<small>({t('common.sec')})</small>
            </InputGroup.Text>
            <FormControl placeholder='1' autoComplete='off' name='retryInterval' value={settings.retryInterval} onBlur={onUpdate} pattern={REGEX.INTERVAL.source} list='interval' />
            <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
          </InputGroup>
        </Card.Body>
      </Card>
      <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
        <Card.Body>
          <p>{t('retry.hint')}</p>
          <div className='d-flex justify-content-between mt-3'>
            <Form.Check type='radio' value={EErrorOptions.STOP} checked={settings.retryOption === EErrorOptions.STOP} onChange={onUpdate} name='retryOption' label={t('retry.stop')} />
            <Form.Check type='radio' value={EErrorOptions.SKIP} checked={settings.retryOption === EErrorOptions.SKIP} onChange={onUpdate} name='retryOption' label={t('retry.skip')} />
            <Form.Check type='radio' value={EErrorOptions.RELOAD} checked={settings.retryOption === EErrorOptions.RELOAD} onChange={onUpdate} name='retryOption' label={t('retry.refresh')} />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
export { SettingRetry };
