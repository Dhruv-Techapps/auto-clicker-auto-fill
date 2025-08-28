import { updateForm } from '@acf-options-page/util';
import { FormEvent, useEffect } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import { setWatchMessage, switchWatchModal, syncWatch, watchSelector } from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { LifecycleStopConditions, WatchSettings } from './config-watch';

const FORM_ID = 'watch-settings';

const WatchModal = () => {
  const { t } = useTranslation();
  const { visible, error, message, watch } = useAppSelector(watchSelector) as any;
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setWatchMessage(undefined));
  }, message);

  const onHide = () => dispatch(switchWatchModal());

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    if (Object.keys(watch).length !== 0) {
      dispatch(syncWatch(watch));
    }
  };

  const onReset = () => {
    dispatch(syncWatch());
    onHide();
  };

  useEffect(() => {
    updateForm(FORM_ID, { ...watch, ...watch.lifecycleStopConditions });
  }, [watch]);

  return (
    <Modal show={visible} size='lg' onHide={onHide} data-testid='watch-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.watch.title', 'Watch Settings')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WatchSettings />
          <LifecycleStopConditions />
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

export { WatchModal };
