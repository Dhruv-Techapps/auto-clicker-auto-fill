import { useTimeout } from '@apps/acf-options-page/src/_hooks/message.hooks';
import { useAppDispatch, useAppSelector } from '@apps/acf-options-page/src/hooks';
import { addAction, selectedConfigSelector, switchBatchModal } from '@apps/acf-options-page/src/store/config';
import { actionSelector, setActionMessage } from '@apps/acf-options-page/src/store/config/action/action.slice';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ActionSettingsModal, ActionStatementModal, AddonModal } from '../../../modal';
import { Plus, Repeat } from '../../../util';
import ActionTable from './action-table';

function Action() {
  const { t } = useTranslation();
  const { message, error } = useAppSelector(actionSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionMessage());
  }, message);

  const onAddAction = () => {
    dispatch(addAction());
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <>
      <Card className='mb-3 shadow-sm'>
        <Card.Header as='h6'>
          <Row>
            <Col className='d-flex align-items-center'>
              {t('action.title')}
              <small className='text-success ms-3'>{message}</small>
              <small className='text-danger ms-3'>{error}</small>
            </Col>
            <Col xs='auto' className='d-flex align-items-center'>
              <Button size='sm' variant='outline-primary px-3' onClick={() => dispatch(switchBatchModal())} id='batch-model'>
                <Repeat className='me-2' /> {t('batch.title')}
              </Button>
              <Button size='sm' variant='outline-primary px-3 mx-3' onClick={onAddAction} id='add-action'>
                <Plus className='me-2' /> {t('action.add')}
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className='p-0'>
          <ActionTable actions={actions} />
        </Card.Body>
      </Card>
      <AddonModal />
      <ActionSettingsModal />
      <ActionStatementModal />
    </>
  );
}
export default Action;
