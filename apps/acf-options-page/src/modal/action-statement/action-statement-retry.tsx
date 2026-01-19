import { EErrorOptions, IActionStatement } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { ChangeEvent } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { selectedConfigSelector, updateActionStatementGoto, updateActionStatementOption } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

type ActionStatementRetryProps = Partial<Pick<IActionStatement, 'option' | 'goto'>>;

export const ActionStatementRetry = (props: ActionStatementRetryProps) => {
  const { option, goto } = props;
  const config = useAppSelector(selectedConfigSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onUpdateThen = (option: EErrorOptions) => {
    dispatch(updateActionStatementOption(option));
    if (option === EErrorOptions.GOTO) {
      const actionId = config?.actions[0].id;
      if (actionId) {
        dispatch(updateActionStatementGoto(actionId));
      }
    }
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionStatementGoto(e.currentTarget.value as TRandomUUID));
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
              checked={option === EErrorOptions.STOP}
              value={EErrorOptions.STOP}
              onChange={() => onUpdateThen(EErrorOptions.STOP)}
              name='then'
              label={t('modal.actionSettings.retry.stop')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={option === EErrorOptions.SKIP}
              value={EErrorOptions.SKIP}
              onChange={() => onUpdateThen(EErrorOptions.SKIP)}
              name='then'
              label={t('modal.actionSettings.retry.skip')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={option === EErrorOptions.RELOAD}
              value={EErrorOptions.RELOAD}
              onChange={() => onUpdateThen(EErrorOptions.RELOAD)}
              name='then'
              label={t('modal.actionSettings.retry.refresh')}
            />
          </Col>
          <Col>
            <Form.Check
              type='radio'
              required
              checked={option === EErrorOptions.GOTO}
              value={EErrorOptions.GOTO}
              onChange={() => onUpdateThen(EErrorOptions.GOTO)}
              name='then'
              label={t('modal.actionSettings.retry.goto')}
            />
          </Col>
        </Row>
        {option === EErrorOptions.GOTO && (
          <Row>
            <Col xs={{ span: 4, offset: 8 }}>
              <Form.Select value={goto} onChange={onUpdateGoto} name='goto' required>
                {actions.map((_action, index) => (
                  <option key={_action.id} value={_action.id}>
                    {index + 1} . {_action.name ?? 'Action or Userscript'}
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
