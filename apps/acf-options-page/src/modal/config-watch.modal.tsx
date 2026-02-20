import { IWatchSettings, defaultWatchSettings } from '@dhruv-techapps/acf-common';
import { Alert, Badge, Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTimeout } from '../_hooks/message.hooks';
import { setWatchMessage, switchWatchModal, syncWatch, watchSelector } from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { LifecycleStopConditions, WatchSettings } from './config-watch';

const WatchModal = () => {
  const { t } = useTranslation();
  const { visible, error, message, watch: watchStore } = useAppSelector(watchSelector) as any;
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setWatchMessage(undefined));
  }, message);

  const { register, handleSubmit, watch, reset } = useForm<IWatchSettings>({
    defaultValues: watchStore ?? { ...defaultWatchSettings }
  });

  const watchEnabled = watch('watchEnabled');

  const onHide = () => dispatch(switchWatchModal());

  const onSubmit = (data: IWatchSettings) => {
    const watchAttributes = data.watchAttributes;
    const normalized: IWatchSettings = {
      ...data,
      watchAttributes:
        typeof watchAttributes === 'string'
          ? (watchAttributes as string)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : watchAttributes
    };
    dispatch(syncWatch(normalized));
    onHide();
  };

  const onReset = () => {
    reset({ ...defaultWatchSettings });
    dispatch(syncWatch(undefined));
    onHide();
  };

  return (
    <Modal show={visible} size='lg' onHide={onHide} data-testid='watch-modal'>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>
            {t('modal.watch.title', 'Watch Settings')} <Badge>Beta</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WatchSettings register={register} watchEnabled={watchEnabled} />
          <LifecycleStopConditions register={register} watchEnabled={watchEnabled} />
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
          <Button type='reset' variant='outline-primary' className='px-5'>
            {t('common.clear', 'Clear')}
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
