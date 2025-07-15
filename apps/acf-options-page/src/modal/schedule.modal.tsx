import { Alert, Button, Card, Col, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ChangeEvent, FormEvent, useEffect } from 'react';
import { useTimeout } from '../_hooks/message.hooks';
import { syncSchedule } from '../store/config';
import { scheduleSelector, setScheduleMessage, switchScheduleModal, updateSchedule } from '../store/config/schedule';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { REGEX } from '../util';
import { getFieldNameValue, updateForm } from '../util/element';

const FORM_ID = 'schedule';

export const ScheduleModal = () => {
  const { t } = useTranslation();
  const { visible, message, error, schedule } = useAppSelector(scheduleSelector);

  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setScheduleMessage());
  }, message);

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, schedule);
    if (update) {
      dispatch(updateSchedule(update));
    }
  };

  useEffect(() => {
    updateForm(FORM_ID, schedule);
  }, [schedule]);

  const onReset = () => {
    dispatch(syncSchedule());
    onHide();
  };

  const onHide = () => {
    dispatch(switchScheduleModal());
  };

  const onShow = () => {
    //:TODO
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    dispatch(syncSchedule(schedule));
  };

  return (
    <Modal show={visible} size='lg' onHide={onHide} onShow={onShow} data-testid='addon-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.schedule.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.schedule.info')}</p>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md='6' sm='12'>
                  <InputGroup>
                    <InputGroup.Text>{t('modal.schedule.date')}</InputGroup.Text>
                    <FormControl name='date' pattern={REGEX.SCHEDULE_DATE} autoComplete='off' defaultValue={schedule.date} onBlur={onUpdate} placeholder='YYYY-MM-DD' list='schedule-date' required />
                    <Form.Control.Feedback type='invalid'>{t('error.scheduleDate')}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
                <Col md='6' sm='12'>
                  <InputGroup>
                    <InputGroup.Text>{t('modal.schedule.time')}</InputGroup.Text>
                    <FormControl name='time' pattern={REGEX.SCHEDULE_TIME} autoComplete='off' defaultValue={schedule.time} onBlur={onUpdate} placeholder='HH:mm:ss.sss' list='schedule-time' required />
                    <Form.Control.Feedback type='invalid'>{t('error.scheduleTime')}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md='12' sm='12'>
                  <InputGroup>
                    <InputGroup.Text>{t('modal.schedule.repeat')}</InputGroup.Text>
                    <FormControl name='repeat' pattern={REGEX.SCHEDULE_REPEAT} autoComplete='off' defaultValue={schedule.repeat} onBlur={onUpdate} placeholder='60' list='schedule-repeat' required />
                    <InputGroup.Text>{t('common.min')}</InputGroup.Text>
                    <Form.Control.Feedback type='invalid'>{t('error.scheduleRepeat')}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='config-schedule-reset'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='config-schedule-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
