import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { useStepId } from '@acf-options-page/_hooks/useStepId';
import { InputBounded } from '@acf-options-page/form/input-bounded';
import { InputInterval } from '@acf-options-page/form/input-interval';
import { syncActionSettings, useAppDispatch } from '@acf-options-page/store';
import { EErrorOptions, IActionSettings } from '@dhruv-techapps/acf-common';
import { Button, Card, Col, Form, Offcanvas, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationStepSettingsOffcanvasProps {
  show: boolean;
}

export const AutomationStepSettingsOffcanvas = ({ show }: AutomationStepSettingsOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();
  const stepId = useStepId();

  const action = config?.actions.find((a) => a.id === stepId);

  const form = useForm<IActionSettings>({
    defaultValues: action?.settings ?? {},
    mode: 'onChange'
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isDirty, isValid, errors }
  } = form;

  if (!config || !action) {
    return null;
  }

  const handleClose = () => navigate(-1);
  const retryOption = watch('retryOption');

  const onSubmit = (data: IActionSettings) => {
    dispatch(syncActionSettings({ configId: config.id, actionId: stepId, settings: Object.keys(data).length !== 0 ? data : undefined }));
    navigate(-1);
  };

  const onReset = () => {
    dispatch(syncActionSettings({ configId: config.id, actionId: stepId, settings: undefined }));
    navigate(-1);
  };

  const { actions } = config;

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('stepSettings.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <p className='text-muted'>{t('stepSettings.info')}</p>
          <Card>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' label={t('stepSettings.iframeFirst')} {...register('iframeFirst')} />
                  <small className='text-muted'>{t('stepSettings.iframeFirstHint')}</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card bg='warning-subtle' text='warning-emphasis' className='mt-3'>
            <Card.Body>
              <Row className='mb-2 mb-md-0'>
                <Col md={6} sm={12}>
                  <InputBounded title={'retry.title'} name='retry' form={form} />
                </Col>
                <Col md={6} sm={12}>
                  <InputInterval title={'retry.intervalRange'} name='retryInterval' rangeName='retryIntervalTo' form={form} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
            <Card.Body>
              <Row>
                <Col xs={12} className='mb-2'>
                  {t('retry.hint')}
                </Col>
                <Col>
                  <Form.Check type='radio' value={EErrorOptions.STOP} label={t('retry.stop')} {...register('retryOption')} />
                </Col>
                <Col>
                  <Form.Check type='radio' value={EErrorOptions.SKIP} label={t('retry.skip')} {...register('retryOption')} />
                </Col>
                <Col>
                  <Form.Check type='radio' value={EErrorOptions.RELOAD} label={t('retry.refresh')} {...register('retryOption')} />
                </Col>
                <Col>
                  <Form.Check type='radio' value={EErrorOptions.GOTO} label={t('retry.goto')} {...register('retryOption')} />
                </Col>
                {retryOption === EErrorOptions.GOTO && (
                  <Col xs={{ span: 3, offset: 9 }}>
                    <Form.Select {...register('retryGoto')} required>
                      {actions.map((_action, index) => (
                        <option key={_action.id} value={_action.id}>
                          {index + 1} . {_action.name ?? 'Action or Userscript'}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
        <div className='p-3 border-top d-flex justify-content-between'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='action-settings-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='action-settings-save' disabled={!isDirty || !isValid}>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
