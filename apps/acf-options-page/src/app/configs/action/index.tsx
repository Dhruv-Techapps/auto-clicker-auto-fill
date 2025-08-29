import { useTimeout } from '@acf-options-page/_hooks/message.hooks';
import { addAction, addUserscript, openWatchModalAPI, selectedConfigSelector, switchBatchModal } from '@acf-options-page/store/config';
import { actionSelector, setActionMessage } from '@acf-options-page/store/config/action/action.slice';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ActionSettingsModal, ActionStatementModal, AddonModal } from '../../../modal';
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

  const onAddUserscript = () => {
    dispatch(addUserscript());
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
                <i className='bi bi-repeat me-2' /> {t('batch.title')}
              </Button>
              <Button size='sm' variant='outline-primary px-3 ms-3' onClick={() => dispatch(openWatchModalAPI())} id='watch-model'>
                <i className='bi bi-eye-fill me-2' /> {t('watch.title', 'Watch')}
              </Button>
              <Button size='sm' variant='outline-primary px-3 ms-3' onClick={onAddAction} id='add-action'>
                <i className='bi bi-plus-lg me-2' /> {t('action.add')}
              </Button>
              <Button size='sm' variant='outline-primary px-3 ms-3' onClick={onAddUserscript} id='add-userscript'>
                <i className='bi bi-plus-lg me-2' /> {t('userscript.add')}
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
