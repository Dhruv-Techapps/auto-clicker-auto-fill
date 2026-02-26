import { REGEX } from '@acf-options-page/util';
import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { Fragment } from 'react';
import { Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface MonitorSettingsProps {
  register: UseFormRegister<IWatchSettings>;
  watchEnabled: boolean | undefined;
  errors: FieldErrors<IWatchSettings>;
}

// Monitor (DOM observer) settings block split out of action-settings modal
function MonitorSettings({ register, watchEnabled, errors }: MonitorSettingsProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Row className='mb-3'>
        <Col md={12} sm={12}>
          <Form.Check type='switch' id='watch-enabled' label={t('monitor.enabled')} {...register('watchEnabled')} />
          <small className='text-muted'>{t('monitor.enabledHint')}</small>
        </Col>
      </Row>
      {watchEnabled && (
        <Fragment>
          <hr className='my-3' />
          <Row className='mb-3'>
            <Col md={12} sm={12} className='mb-3'>
              <InputGroup>
                <InputGroup.Text>{t('monitor.rootSelector')}</InputGroup.Text>
                <FormControl placeholder={t('monitor.rootSelectorPlaceholder')} {...register('watchRootSelector', { required: t('error.required') })} isInvalid={!!errors.watchRootSelector} />
                <Form.Control.Feedback type='invalid'>{errors.watchRootSelector?.message}</Form.Control.Feedback>
              </InputGroup>
              <small className='text-muted'>{t('monitor.rootSelectorHint')}</small>
            </Col>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>{t('monitor.watchAttributes')}</InputGroup.Text>
                <FormControl placeholder={t('monitor.attributesPlaceholder')} {...register('watchAttributes')} isInvalid={!!errors.watchAttributes} />
                <Form.Control.Feedback type='invalid'>{errors.watchAttributes?.message}</Form.Control.Feedback>
              </InputGroup>
              <small className='text-muted'>{t('monitor.attributesHint')}</small>
            </Col>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>
                  {t('monitor.debounce')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                </InputGroup.Text>
                <FormControl
                  type='number'
                  min='1'
                  max='5'
                  isInvalid={!!errors.debounce}
                  {...register('debounce', { required: t('error.required'), pattern: { value: REGEX.NUMBER, message: t('error.number') }, min: 1, max: 5 })}
                />
                <Form.Control.Feedback type='invalid'>{errors.debounce?.message}</Form.Control.Feedback>
              </InputGroup>
              <small className='text-muted'>{t('monitor.debounceHint')}</small>
            </Col>
          </Row>
        </Fragment>
      )}
    </div>
  );
}

export { MonitorSettings };
