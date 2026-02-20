import { useConfig } from '@acf-options-page/_hooks/useConfig';
import { syncSchedule, useAppDispatch } from '@acf-options-page/store';
import { REGEX } from '@acf-options-page/util';
import { ISchedule } from '@dhruv-techapps/acf-common';
import { Button, Col, Form, FormControl, InputGroup, Offcanvas, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface ConfigurationScheduleOffcanvasProps {
  show: boolean;
}

export const ConfigurationScheduleOffcanvas = ({ show }: ConfigurationScheduleOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const config = useConfig();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISchedule>({
    defaultValues: config?.schedule
  });

  if (!config) {
    return null;
  }

  const handleClose = () => navigate(-1);

  const onSubmit = (data: ISchedule) => {
    dispatch(syncSchedule({ configId: config.id, schedule: data }));
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true} style={{ width: '800px' }}>
      <Form onSubmit={handleSubmit(onSubmit)} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('modal.schedule.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1'>
          <p className='text-muted'>{t('modal.schedule.info')}</p>
          <Row>
            <Col md='6' sm='12'>
              <InputGroup>
                <InputGroup.Text>{t('modal.schedule.date')}</InputGroup.Text>
                <FormControl
                  {...register('date', {
                    required: t('error.scheduleDate'),
                    pattern: { value: new RegExp(REGEX.SCHEDULE_DATE), message: t('error.scheduleDate') }
                  })}
                  placeholder='YYYY-MM-DD'
                  autoComplete='off'
                  list='schedule-date'
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type='invalid'>{errors.date?.message}</Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col md='6' sm='12'>
              <InputGroup>
                <InputGroup.Text>{t('modal.schedule.time')}</InputGroup.Text>
                <FormControl
                  {...register('time', {
                    required: t('error.scheduleTime'),
                    pattern: { value: new RegExp(REGEX.SCHEDULE_TIME), message: t('error.scheduleTime') }
                  })}
                  placeholder='HH:mm:ss.sss'
                  autoComplete='off'
                  list='schedule-time'
                  isInvalid={!!errors.time}
                />
                <Form.Control.Feedback type='invalid'>{errors.time?.message}</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col md='12' sm='12'>
              <InputGroup>
                <InputGroup.Text>{t('modal.schedule.repeat')}</InputGroup.Text>
                <FormControl
                  {...register('repeat', {
                    required: t('error.scheduleRepeat'),
                    pattern: { value: new RegExp(REGEX.SCHEDULE_REPEAT), message: t('error.scheduleRepeat') }
                  })}
                  placeholder='60'
                  autoComplete='off'
                  list='schedule-repeat'
                  isInvalid={!!errors.repeat}
                />
                <InputGroup.Text>{t('common.min')}</InputGroup.Text>
                <Form.Control.Feedback type='invalid'>{errors.repeat?.message}</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='config-schedule-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-schedule-save'>
            {t('common.save')}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};
