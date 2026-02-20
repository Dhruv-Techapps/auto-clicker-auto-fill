import { REGEX } from '@acf-options-page/util';
import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface LifecycleStopConditionsProps {
  register: UseFormRegister<IWatchSettings>;
  watchEnabled: boolean | undefined;
}

function LifecycleStopConditions({ register, watchEnabled }: LifecycleStopConditionsProps) {
  const { t } = useTranslation();

  if (!watchEnabled) return null;

  return (
    <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
      <Card.Body>
        <Row className='mb-2'>
          <Col md={6} sm={12}>
            <InputGroup>
              <InputGroup.Text>
                {t('modal.watch.timeout', 'Timeout')}&nbsp;
                <small className='text-muted'>({t('common.min', 'min')})</small>
              </InputGroup.Text>
              <FormControl
                type='number'
                min='1'
                max='180'
                {...register('lifecycleStopConditions.timeout', { pattern: { value: new RegExp(REGEX.NUMBER), message: t('error.number') }, min: 1, max: 180 })}
              />
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </InputGroup>
            <small className='text-muted'>{t('modal.watch.timeoutHint', 'Auto-stop after N minutes (1-180)')}</small>
          </Col>
          <Col md={6} sm={12}>
            <Form.Check type='switch' id='lifecycle-url-change' label={t('modal.watch.urlChange', 'Stop on URL Change')} {...register('lifecycleStopConditions.urlChange')} />
            <small className='text-muted ms-2'>{t('modal.watch.urlChangeHint', 'Automatically stop watching when page URL changes')}</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export { LifecycleStopConditions };
