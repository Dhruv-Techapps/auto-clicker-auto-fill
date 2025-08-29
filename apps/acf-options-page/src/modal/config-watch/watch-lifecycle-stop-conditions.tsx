import { ChangeEvent } from 'react';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { updateWatchLifecycleStopConditions, watchSelector } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getFieldNameValue, REGEX } from '../../util';

function LifecycleStopConditions() {
  const { t } = useTranslation();
  const { watch } = useAppSelector(watchSelector);
  const dispatch = useAppDispatch();

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const update = getFieldNameValue(e, watch?.lifecycleStopConditions);
    if (update) {
      dispatch(updateWatchLifecycleStopConditions(update));
    }
  };

  if (!watch?.watchEnabled) return null;

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
                placeholder={t('modal.watch.timeout', 'Timeout')}
                name='timeout'
                type='number'
                onBlur={onUpdate}
                defaultValue={watch?.lifecycleStopConditions?.timeout ?? 30}
                pattern={REGEX.NUMBER}
                min='1'
                max='180'
              />
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </InputGroup>
            <small className='text-muted'>{t('modal.watch.timeoutHint', 'Auto-stop after N minutes (1-180)')}</small>
          </Col>
          <Col md={6} sm={12}>
            <Form.Check type='switch' name='urlChange' checked={watch?.lifecycleStopConditions?.urlChange !== false} onChange={onUpdate} label={t('modal.watch.urlChange', 'Stop on URL Change')} />
            <small className='text-muted ms-2'>{t('modal.watch.urlChangeHint', 'Automatically stop watching when page URL changes')}</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export { LifecycleStopConditions };
