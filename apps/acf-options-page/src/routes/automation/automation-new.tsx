import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { updateConfig, useAppDispatch } from '@acf-options-page/store';
import { APP_LINK } from '@acf-options-page/util/constants';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { Card, Container, Form, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AutomationNewFormValues = Pick<IConfiguration, 'url'>;

export const AutomationNew = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useAutomation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AutomationNewFormValues>({
    defaultValues: { url: config?.url }
  });

  if (!config) {
    return null;
  }

  const onSubmit = (data: AutomationNewFormValues) => {
    dispatch(updateConfig({ configId: config.id, name: 'url', value: data.url }));
  };

  return (
    <Container className='m-auto'>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId='config-url'>
              <Form.Label>
                {t('automation.url')}&nbsp;<small className='text-danger'>*</small>
              </Form.Label>
              <FormControl autoComplete='off' placeholder={APP_LINK.TEST} isInvalid={!!errors.url} {...register('url', { required: t('error.url') })} />
              <Form.Control.Feedback type='invalid'>{errors.url?.message}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
