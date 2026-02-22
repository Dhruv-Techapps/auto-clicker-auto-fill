import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { syncBatch, useAppDispatch } from '@acf-options-page/store';
import { REGEX } from '@acf-options-page/util';
import { IBatch } from '@dhruv-techapps/acf-common';
import { Button, Col, Form, FormControl, Offcanvas, Row } from 'react-bootstrap';
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IBatch>({
    defaultValues: config?.batch
  });

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
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
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
                  <Form.Group controlId='batch-repeat'>
                    <Form.Label>{t('loop.repeat')}</Form.Label>
                    <FormControl
                      type='number'
                      autoComplete='off'
                      placeholder='0'
                      isInvalid={!!errors.repeat}
                      {...register('repeat', { pattern: { value: new RegExp(REGEX.NUMBER), message: t('error.number') } })}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.repeat?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md='6' sm='12'>
                  <Form.Group controlId='batch-repeat-interval'>
                    <Form.Label>
                      {t('loop.repeatInterval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                    </Form.Label>
                    <FormControl
                      autoComplete='off'
                      placeholder='0'
                      isInvalid={!!errors.repeatInterval}
                      {...register('repeatInterval', { pattern: { value: new RegExp(REGEX.INTERVAL), message: t('error.number') } })}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.repeatInterval?.message}</Form.Control.Feedback>
                  </Form.Group>
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
          <Button type='submit' variant='primary' className='px-5' data-testid='config-batch-save'>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
