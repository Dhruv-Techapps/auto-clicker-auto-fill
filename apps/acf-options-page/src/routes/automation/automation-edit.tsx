import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { updateConfig, useAppDispatch } from '@acf-options-page/store';
import { REGEX } from '@acf-options-page/util';
import { APP_LINK } from '@acf-options-page/util/constants';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { Button, Col, Container, Form, FormControl, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AutomationEditFormValues = Pick<IConfiguration, 'url' | 'initWait'>;

interface AutomationEditProps {
  onDone: () => void;
}

export const AutomationEdit = ({ onDone }: AutomationEditProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<AutomationEditFormValues>({
    defaultValues: {
      url: config?.url,
      initWait: config?.initWait
    }
  });

  if (!config) {
    return null;
  }

  const onSubmit = (data: AutomationEditFormValues) => {
    if (data.url !== config.url) {
      dispatch(updateConfig({ configId: config.id, name: 'url', value: data.url }));
    }
    if (data.initWait !== config.initWait) {
      dispatch(updateConfig({ configId: config.id, name: 'initWait', value: data.initWait }));
    }
    onDone();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container fluid className='border-bottom p-2 mb-1'>
        <Row className='align-items-end'>
          <Col xs='auto'>
            <Form.Label>
              {t('automation.initWait')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
            </Form.Label>
            <FormControl
              autoComplete='off'
              list='interval'
              size='sm'
              placeholder='0'
              isInvalid={!!errors.initWait}
              {...register('initWait', { pattern: { value: new RegExp(REGEX.INTERVAL), message: t('error.initWait') } })}
            />
            <Form.Control.Feedback type='invalid'>{errors.initWait?.message}</Form.Control.Feedback>
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
