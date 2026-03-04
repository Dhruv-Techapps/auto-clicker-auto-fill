import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { InputBounded } from '@acf-options-page/form/input-bounded';
import { InputInterval } from '@acf-options-page/form/input-interval';
import { syncBatch, useAppDispatch } from '@acf-options-page/store';
import { IBatch } from '@dhruv-techapps/acf-common';
import { Button, Col, Form, Offcanvas, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationLoopOffcanvasProps {
  show: boolean;
}

export const AutomationLoopOffcanvas = ({ show }: AutomationLoopOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();

  const form = useForm<IBatch>({
    mode: 'onChange',
    defaultValues: config?.batch
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isDirty, isValid }
  } = form;

  if (!config) {
    return null;
  }

  const handleClose = () => navigate(-1);

  const refresh = watch('refresh');

  const onSubmit = (batch: IBatch) => {
    dispatch(syncBatch({ configId: config.id, batch }));
    navigate(-1);
  };

  const onReset = () => {
    dispatch(syncBatch({ configId: config.id, batch: {} }));
    navigate(-1);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('loop.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1'>
          <Row>
            <Col md='12' sm='12'>
              <Form.Check type='switch' id='batch-refresh' label={t('loop.refresh')} {...register('refresh')} />
              <Form.Text className='text-body-tertiary'>
                <Trans i18nKey='loop.refreshHint' components={{ b: <b /> }} />
              </Form.Text>
            </Col>
            {!refresh && (
              <>
                <hr className='my-3' />
                <Col md='6' sm='12'>
                  <InputBounded title={'loop.repeat'} name='repeat' form={form} />
                </Col>
                <Col md='6' sm='12'>
                  <InputInterval title={'loop.repeatIntervalRange'} name='repeatInterval' rangeName='repeatIntervalTo' form={form} />
                </Col>
                <Form.Text className='text-body-tertiary'>
                  <Trans i18nKey='loop.repeatHint' components={{ b: <b /> }} />
                </Form.Text>
              </>
            )}
          </Row>
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='config-batch-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-batch-save' disabled={!isDirty || !isValid}>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
