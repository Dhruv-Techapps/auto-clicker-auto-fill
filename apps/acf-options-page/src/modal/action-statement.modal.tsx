import { FormEvent } from 'react';

import { ACTION_CONDITION_OPR, getDefaultActionCondition } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import {
  actionStatementSelector,
  addActionStatementCondition,
  selectedConfigSelector,
  setActionStatementError,
  setActionStatementMessage,
  switchActionStatementModal,
  syncActionStatement,
  updateActionStatementCondition,
} from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Plus } from '../util/svg';
import { ActionStatementCondition } from './action-statement/action-statement-condition';
import { ActionStatementRetry } from './action-statement/action-statement-retry';

const FORM_ID = 'actionCondition';

const ActionStatementModal = () => {
  const { t } = useTranslation();
  const { message, visible, statement, error } = useAppSelector(actionStatementSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionStatementMessage());
  }, message);

  const onReset = () => {
    dispatch(syncActionStatement());
    onHide();
  };

  const addCondition = (actionId: RANDOM_UUID, operator?: ACTION_CONDITION_OPR) => {
    dispatch(addActionStatementCondition(getDefaultActionCondition(actionId, operator)));
  };

  const onHide = () => {
    dispatch(switchActionStatementModal());
  };

  const onShow = () => {
    //:TODO
  };

  const verifyConditions = (conditions) => {
    conditions = conditions.map((condition) => {
      if (config !== undefined && condition.actionId === undefined && condition.actionIndex !== undefined) {
        const actionId = config.actions[condition.actionIndex].id;
        dispatch(updateActionStatementCondition({ name: 'actionId', value: actionId, id: condition.id }));
        return { ...condition, actionId };
      }
      return condition;
    });
    return conditions;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    if (!statement.conditions || !statement.then) {
      dispatch(setActionStatementError(t('error.condition')));
      return;
    }
    const conditions = verifyConditions(statement.conditions);
    const then = statement.then;
    dispatch(syncActionStatement({ ...statement, then, conditions }));
  };

  if (!config) {
    return null;
  }

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
                  <Button type='button' variant='link' className='mt-2 p-0' aria-label='Add' onClick={() => addCondition(config.actions[0].id, ACTION_CONDITION_OPR.AND)}>
                    <Plus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {statement.conditions?.map((condition, index) => (
                <ActionStatementCondition key={condition.id} index={index} condition={condition} />
              ))}
            </tbody>
          </Table>
          {statement.conditions ? (
            <ActionStatementRetry then={statement.then} goto={statement.goto} />
          ) : (
            <div className='p-5 d-flex justify-content-center'>
              <Button type='button' aria-label='Add' onClick={() => addCondition(config.actions[0].id)}>
                <Plus /> {t('modal.actionSettings.title')}
              </Button>
            </div>
          )}
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
          <Button type='submit' variant='primary' className='px-5 ml-3' data-testid='action-statement-save' disabled={statement.conditions === undefined}>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionStatementModal };
