import { useConfig } from '@acf-options-page/_hooks/useConfig';
import { syncWatch, useAppDispatch } from '@acf-options-page/store';
import { IWatchSettings, defaultWatchSettings } from '@dhruv-techapps/acf-common';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { LifecycleStopConditions, WatchSettings } from '../routes/configuration/configuration-watch';

interface ConfigurationWatchOffcanvasProps {
  show: boolean;
}

export const ConfigurationWatchOffcanvas = ({ show }: ConfigurationWatchOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useConfig();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, reset } = useForm<IWatchSettings>({
    defaultValues: config?.watch ?? { ...defaultWatchSettings }
  });

  if (!config) {
    return null;
  }

  const handleClose = () => navigate(-1);

  const watchEnabled = watch('watchEnabled');

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
    dispatch(syncWatch({ configId: config.id, watch: normalized }));
    navigate(-1);
  };

  const onReset = () => {
    reset({ ...defaultWatchSettings });
    dispatch(syncWatch({ configId: config.id, watch: undefined }));
    navigate(-1);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('modal.watch.title', 'Watch Settings')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <WatchSettings register={register} watchEnabled={watchEnabled} />
          <LifecycleStopConditions register={register} watchEnabled={watchEnabled} />
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='config-watch-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-watch-save'>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
