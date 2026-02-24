import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { useStepId } from '@acf-options-page/_hooks/useStepId';
import { syncActionAddon, useAppDispatch } from '@acf-options-page/store';
import { EAddonConditions, IAddon, defaultAddon } from '@dhruv-techapps/acf-common';
import { Button, Col, Form, InputGroup, Offcanvas, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValueExtractorPopover } from '../popover';
import { PreCheckRecheck } from './step-page-guard/recheck';
import { PreCheckValueExtractorFlags } from './step-page-guard/value-extractor-flags';

interface PageGuardOffcanvasProps {
  show: boolean;
}

export const PageGuardOffcanvas = ({ show }: PageGuardOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();
  const navigate = useNavigate();
  const stepId = useStepId();

  const action = config?.actions.find((a) => a.id === stepId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<IAddon>({
    defaultValues: action?.addon ?? { ...defaultAddon }
  });

  if (!config || !action) {
    return null;
  }

  const handleClose = () => navigate(-1);

  const valueExtractor = watch('valueExtractor');
  const elementFinder = watch('elementFinder');
  const condition = watch('condition');
  const value = watch('value');

  const onSubmit = (data: IAddon) => {
    dispatch(syncActionAddon({ configId: config.id, actionId: stepId, addon: data }));
    navigate(-1);
  };

  const onReset = () => {
    dispatch(syncActionAddon({ configId: config.id, actionId: stepId, addon: undefined }));
    navigate(-1);
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('pageGuard.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <p className='text-muted'>{t('pageGuard.info')}</p>
          <Row className='mb-3'>
            <Col md={6} sm={12}>
              <Form.Group controlId='addon-element'>
                <Form.Label>
                  {t('pageGuard.elementFinder')} <small className='text-danger'>*</small>
                </Form.Label>
                <Form.Control type='text' placeholder='Element Finder' list='elementFinder' isInvalid={!!errors.elementFinder} {...register('elementFinder', { required: t('error.elementFinder') })} />
                <Form.Control.Feedback type='invalid'>{errors.elementFinder?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} sm={12}>
              <Form.Group controlId='addon-condition'>
                <Form.Label>
                  {t('pageGuard.condition')} <small className='text-danger'>*</small>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.condition}
                  {...register('condition', {
                    required: t('error.condition'),
                    validate: (v) => v !== EAddonConditions['~~ Select Condition ~~'] || t('error.condition')
                  })}
                >
                  {Object.entries(EAddonConditions).map(([label, val]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.condition?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col md sm={12}>
              <Form.Group controlId='addon-value'>
                <Form.Label>
                  {t('pageGuard.value')} <small className='text-danger'>*</small>
                </Form.Label>
                <Form.Control type='text' placeholder='Value' list='value' isInvalid={!!errors.value} {...register('value', { required: t('error.value') })} />
                <Form.Control.Feedback type='invalid'>{errors.value?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md sm={12}>
              <Form.Group controlId='addon-value-extractor' className='addon-value-extractor'>
                <Form.Label>{t('pageGuard.valueExtractor')}</Form.Label>
                <InputGroup>
                  <Form.Control type='text' placeholder='Value Extractor' list='valueExtractor' {...register('valueExtractor')} />
                  {valueExtractor ? (
                    <PreCheckValueExtractorFlags watch={watch} setValue={setValue} />
                  ) : (
                    <InputGroup.Text>
                      <ValueExtractorPopover />
                    </InputGroup.Text>
                  )}
                </InputGroup>
                <Form.Control.Feedback type='invalid'>{t('error.valueExtractor')}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {elementFinder && condition && value && <PreCheckRecheck register={register} watch={watch} setValue={setValue} actions={config.actions} />}
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='config-addon-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-addon-save'>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
