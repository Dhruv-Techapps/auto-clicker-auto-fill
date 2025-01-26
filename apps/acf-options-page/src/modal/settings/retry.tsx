import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { Card, Form, FormControl } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { settingsSelector, updateSettings } from '../../store/settings/settings.slice';
import { REGEX } from '../../util';
import { getFieldNameValue } from '../../util/element';

function SettingRetry() {
  const { t } = useTranslation();
  const { settings } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();
  const onUpdate = (e) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateSettings(update));
    }
  };

  return (
    <>
      <Card bg='warning'>
        <Card.Body className='d-flex gap-3'>
          <Form.Group controlId='retry' className='w-100'>
            <Form.Label>{t('modal.settings.retry.title')}</Form.Label>
            <FormControl placeholder='5' autoComplete='off' name='retry' defaultValue={settings.retry} onBlur={onUpdate} type='number' pattern={REGEX.NUMBER} list='retry' />
            <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='retryInterval' className='w-100'>
            <Form.Label>
              {t('modal.settings.retry.interval')}&nbsp;<small>({t('common.sec')})</small>
            </Form.Label>
            <FormControl placeholder='1' autoComplete='off' name='retryInterval' defaultValue={settings.retryInterval} onBlur={onUpdate} pattern={REGEX.INTERVAL} list='interval' />
            <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
          </Form.Group>
        </Card.Body>
      </Card>
      <Card bg='danger' text='white' className='mt-3'>
        <Card.Body>
          <p>{t('modal.settings.retry.hint')}</p>
          <div className='d-flex justify-content-between mt-3'>
            <Form.Check type='radio' value={RETRY_OPTIONS.STOP} checked={settings.retryOption === RETRY_OPTIONS.STOP} onChange={onUpdate} name='retryOption' label={t('modal.settings.retry.stop')} />
            <Form.Check type='radio' value={RETRY_OPTIONS.SKIP} checked={settings.retryOption === RETRY_OPTIONS.SKIP} onChange={onUpdate} name='retryOption' label={t('modal.settings.retry.skip')} />
            <Form.Check
              type='radio'
              value={RETRY_OPTIONS.RELOAD}
              checked={settings.retryOption === RETRY_OPTIONS.RELOAD}
              onChange={onUpdate}
              name='retryOption'
              label={t('modal.settings.retry.refresh')}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
export { SettingRetry };
