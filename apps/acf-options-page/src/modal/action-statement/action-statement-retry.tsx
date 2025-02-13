import { ActionStatement, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { ChangeEvent } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectedConfigSelector, updateActionStatementGoto, updateActionStatementThen } from '../../store/config';

type ActionStatementRetryProps = Partial<Pick<ActionStatement, 'then' | 'goto'>>;

export const ActionStatementRetry = (props: ActionStatementRetryProps) => {
  const { then, goto } = props;
  const config = useAppSelector(selectedConfigSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onUpdateThen = (then: RETRY_OPTIONS) => {
    dispatch(updateActionStatementThen(then));
    if (then === RETRY_OPTIONS.GOTO) {
      const actionId = config?.actions[0].id;
      if (actionId) {
        dispatch(updateActionStatementGoto(actionId));
      }
    }
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionStatementGoto(e.currentTarget.value as RANDOM_UUID));
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
      <Card.Body>
        <Row>
          <Col xs={12} className='mb-2'>
            {t('modal.actionCondition.hint')}
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={then === RETRY_OPTIONS.STOP}
              value={RETRY_OPTIONS.STOP}
              onChange={() => onUpdateThen(RETRY_OPTIONS.STOP)}
              name='then'
              label={t('modal.actionSettings.retry.stop')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={then === RETRY_OPTIONS.SKIP}
              value={RETRY_OPTIONS.SKIP}
              onChange={() => onUpdateThen(RETRY_OPTIONS.SKIP)}
              name='then'
              label={t('modal.actionSettings.retry.skip')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={then === RETRY_OPTIONS.RELOAD}
              value={RETRY_OPTIONS.RELOAD}
              onChange={() => onUpdateThen(RETRY_OPTIONS.RELOAD)}
              name='then'
              label={t('modal.actionSettings.retry.refresh')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={then === RETRY_OPTIONS.GOTO}
              value={RETRY_OPTIONS.GOTO}
              onChange={() => onUpdateThen(RETRY_OPTIONS.GOTO)}
              name='then'
              label={t('modal.actionSettings.retry.goto')}
            />
          </Col>
        </Row>
        {then === RETRY_OPTIONS.GOTO && (
          <Row>
            <Col xs={{ span: 4, offset: 8 }}>
              <Form.Select value={goto} onChange={onUpdateGoto} name='goto' required>
                {actions.map((_action, index) => (
                  <option key={_action.id} value={_action.id}>
                    {index + 1} . {_action.name ?? _action.elementFinder}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};
