import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { InputInterval } from '@acf-options-page/form/input-interval';
import { updateConfig, useAppDispatch } from '@acf-options-page/store';
import { APP_LINK } from '@acf-options-page/util/constants';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { Button, Col, Container, Form, FormControl, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AutomationEditFormValues = Pick<IConfiguration, 'url' | 'initWait' | 'initWaitTo'>;

interface AutomationEditProps {
  onDone: () => void;
}

export const AutomationEdit = ({ onDone }: AutomationEditProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();

  const form = useForm<AutomationEditFormValues>({
    defaultValues: {
      url: config?.url,
      initWait: config?.initWait,
      initWaitTo: config?.initWaitTo
    },
    mode: 'onChange'
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = form;

  if (!config) {
    return null;
  }

  const onSubmit = (data: AutomationEditFormValues) => {
    dispatch(updateConfig({ configId: config.id, ...data }));
    onDone();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container fluid className='border-bottom p-2'>
        <Row className='align-items-end p-1'>
          <Col xs='auto'>
            <InputInterval title='automation.initWait' name='initWait' rangeName='initWaitTo' form={form} />
          </Col>
          <Col>
            <Form.Label>
              {t('automation.url')}&nbsp;<small className='text-danger'>*</small>
            </Form.Label>
            <FormControl autoComplete='off' size='sm' placeholder={APP_LINK.TEST} isInvalid={!!errors.url} {...register('url', { required: t('error.url') })} />
            <Form.Control.Feedback type='invalid'>{errors.url?.message}</Form.Control.Feedback>
          </Col>
          {isDirty && (
            <Col xs='auto'>
              <Button type='button' variant='outline-secondary' size='sm' onClick={() => onDone()} className='me-2'>
                {t('common.close')}
              </Button>
              <Button type='submit' variant='primary' size='sm' disabled={!isValid}>
                {t('common.save')}
              </Button>
            </Col>
          )}
        </Row>
      </Container>
    </Form>
  );
};
