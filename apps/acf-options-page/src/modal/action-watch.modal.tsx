import { FormEvent } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import { actionWatchSelector, setActionWatchMessage, switchActionWatchModal } from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { WatchSettings } from './action-settings/watch-settings';

const FORM_ID = 'action-watch-settings';

const ActionWatchModal = () => {
  const { t } = useTranslation();
  const { visible, error, message } = useAppSelector(actionWatchSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionWatchMessage(undefined));
  }, message);

  const onHide = () => dispatch(switchActionWatchModal());
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onHide();
  };

  return (
    <Modal show={visible} size='lg' onHide={onHide} data-testid='action-watch-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionWatch.title', 'Action Watch Settings')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WatchSettings />
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
          <Button type='button' variant='outline-primary' onClick={onHide} className='px-5'>
            {t('common.close', 'Close')}
          </Button>
          <Button type='submit' variant='primary' className='px-5'>
            {t('common.save', 'Save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionWatchModal };
