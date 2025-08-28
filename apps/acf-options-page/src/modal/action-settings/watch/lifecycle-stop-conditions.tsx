import { ChangeEvent } from 'react';
import { Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { actionWatchSelector, updateActionWatchLifecycleStopConditions } from '../../../store/config/action/watch';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { REGEX } from '../../../util';
import { getFieldNameValue } from '../../../util/element';

function LifecycleStopConditions() {
  const { t } = useTranslation();
  const { watch } = useAppSelector(actionWatchSelector);
  const dispatch = useAppDispatch();

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const update = getFieldNameValue(e, watch?.lifecycleStopConditions);
    if (update) {
      let value: any = update.value;
      if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
        value = Number(value);
      }
      dispatch(updateActionWatchLifecycleStopConditions({ name: update.name, value }));
    }
  };

  if (!watch?.watchEnabled) return null;

  return (
    <Row className='mb-2'>
      <Col md={6} sm={12}>
        <InputGroup>
          <InputGroup.Text>
            {t('modal.actionSettings.watch.timeout', 'Timeout')}&nbsp;
            <small className='text-muted'>({t('common.min', 'min')})</small>
          </InputGroup.Text>
          <FormControl
            placeholder={t('modal.actionSettings.watch.timeout', 'Timeout')}
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
        <small className='text-muted'>{t('modal.actionSettings.watch.timeoutHint', 'Auto-stop after N minutes (1-180)')}</small>
      </Col>
      <Col md={6} sm={12}>
        <Form.Check
          type='switch'
          name='urlChange'
          checked={watch?.lifecycleStopConditions?.urlChange !== false}
          onChange={onUpdate}
          label={t('modal.actionSettings.watch.urlChange', 'Stop on URL Change')}
        />
        <small className='text-muted ms-2'>{t('modal.actionSettings.watch.urlChangeHint', 'Automatically stop watching when page URL changes')}</small>
      </Col>
    </Row>
  );
}

export { LifecycleStopConditions };
