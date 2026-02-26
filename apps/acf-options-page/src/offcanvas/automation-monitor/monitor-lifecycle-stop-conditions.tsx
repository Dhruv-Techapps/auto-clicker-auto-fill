import { REGEX } from '@acf-options-page/util';
import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface LifecycleStopConditionsProps {
  register: UseFormRegister<IWatchSettings>;
  watchEnabled: boolean | undefined;
  errors: FieldErrors<IWatchSettings>;
}

function LifecycleStopConditions({ register, watchEnabled, errors }: LifecycleStopConditionsProps) {
  const { t } = useTranslation();

  if (!watchEnabled) return null;

  return (
    <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
      <Card.Body>
        <Row className='mb-2'>
          <Col md={6} sm={12}>
            <InputGroup>
              <InputGroup.Text>
                {t('monitor.timeout')}&nbsp;
                <small className='text-muted'>({t('common.min')})</small>
              </InputGroup.Text>
              <FormControl
                type='number'
                min='1'
                max='180'
                isInvalid={!!errors.lifecycleStopConditions?.timeout}
                {...register('lifecycleStopConditions.timeout', { pattern: { value: REGEX.NUMBER, message: t('error.number') }, min: 1, max: 180 })}
              />
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </InputGroup>
            <small className='text-muted'>{t('monitor.timeoutHint')}</small>
          </Col>
          <Col md={6} sm={12}>
            <Form.Check type='switch' id='lifecycle-url-change' label={t('monitor.urlChange')} {...register('lifecycleStopConditions.urlChange')} />
            <small className='text-muted ms-2'>{t('monitor.urlChangeHint')}</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export { LifecycleStopConditions };
