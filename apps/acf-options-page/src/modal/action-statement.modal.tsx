import { ChangeEvent, FormEvent } from 'react';

import { ACTION_CONDITION_OPR, getDefaultActionCondition, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { Alert, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  actionStatementSelector,
  addActionStatementCondition,
  selectedConfigSelector,
  setActionStatementMessage,
  switchActionStatementModal,
  syncActionStatement,
  updateActionStatementGoto,
  updateActionStatementThen,
} from '../store/config';
import { Plus } from '../util/svg';
import { ActionStatementCondition } from './action-statement/action-statement-condition';

const FORM_ID = 'actionCondition';

const ActionStatementModal = () => {
  const { t } = useTranslation();
  const { message, visible, statement, error } = useAppSelector(actionStatementSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionStatementMessage());
  }, message);

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

  const onReset = () => {
    dispatch(syncActionStatement());
    onHide();
  };

  const addCondition = (actionId: RANDOM_UUID) => {
    dispatch(addActionStatementCondition(getDefaultActionCondition(actionId, ACTION_CONDITION_OPR.AND)));
  };

  const onHide = () => {
    dispatch(switchActionStatementModal());
  };

  const onShow = () => {
    //:TODO
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    dispatch(syncActionStatement(statement));
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <Modal show={visible} size='lg' onHide={onHide} onShow={onShow} data-testid='action-statement-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionCondition.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionCondition.info')}</p>
          <Table className='mb-0'>
            <thead>
              <tr>
                <th>OPR</th>
                <th>Action</th>
                <th>Status</th>
                <th>
                  <Button type='button' variant='link' className='mt-2 p-0' aria-label='Add' onClick={() => addCondition(config.actions[0].id)}>
                    <Plus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {statement.conditions.map((condition, index) => (
                <ActionStatementCondition key={condition.id} index={index} condition={condition} />
              ))}
            </tbody>
          </Table>
          <Card bg='danger' text='white' className='mt-3'>
            <Card.Body>
              <Row>
                <Col xs={12} className='mb-2'>
                  {t('modal.actionCondition.hint')}
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    checked={statement.then === RETRY_OPTIONS.STOP}
                    value={RETRY_OPTIONS.STOP}
                    onChange={() => onUpdateThen(RETRY_OPTIONS.STOP)}
                    name='then'
                    label={t('modal.actionSettings.retry.stop')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    checked={statement.then === RETRY_OPTIONS.SKIP}
                    value={RETRY_OPTIONS.SKIP}
                    onChange={() => onUpdateThen(RETRY_OPTIONS.SKIP)}
                    name='then'
                    label={t('modal.actionSettings.retry.skip')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    checked={statement.then === RETRY_OPTIONS.RELOAD}
                    value={RETRY_OPTIONS.RELOAD}
                    onChange={() => onUpdateThen(RETRY_OPTIONS.RELOAD)}
                    name='then'
                    label={t('modal.actionSettings.retry.refresh')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    checked={statement.then === RETRY_OPTIONS.GOTO}
                    value={RETRY_OPTIONS.GOTO}
                    onChange={() => onUpdateThen(RETRY_OPTIONS.GOTO)}
                    name='then'
                    label={t('modal.actionSettings.retry.goto')}
                  />
                </Col>
              </Row>
              {statement.then === RETRY_OPTIONS.GOTO && (
                <Row>
                  <Col xs={{ span: 4, offset: 8 }}>
                    <Form.Select value={statement.goto} onChange={onUpdateGoto} name='goto' required>
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
          {error && (
            <Alert className='mt-3' variant='danger'>
              {error}
            </Alert>
          )}
          {message && (
            <Alert className='mt-3' variant='success'>
              {message}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-primary px-5' data-testid='action-statement-reset'>
            {t('common.clear')}
          </Button>{' '}
          <Button type='submit' variant='primary' className='px-5 ml-3' data-testid='action-statement-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionStatementModal };
