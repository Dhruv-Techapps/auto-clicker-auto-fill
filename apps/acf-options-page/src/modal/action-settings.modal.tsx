import { ChangeEvent, FormEvent, useEffect } from 'react';

import { ERetryOptions } from '@dhruv-techapps/acf-common';
import { Alert, Button, Card, Col, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useTimeout } from '../_hooks/message.hooks';
import {
  actionSettingsSelector,
  selectedConfigSelector,
  setActionSettingsMessage,
  switchActionSettingsModal,
  syncActionSettings,
  updateActionSettings,
  updateActionSettingsGoto
} from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { REGEX } from '../util';
import { getFieldNameValue, updateForm } from '../util/element';

const FORM_ID = 'action-settings';

const ActionSettingsModal = () => {
  const { t } = useTranslation();
  const { message, visible, settings, error } = useAppSelector(actionSettingsSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setActionSettingsMessage());
  }, message);

  useEffect(() => {
    updateForm(FORM_ID, settings);
  }, [settings]);

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, settings);
    if (update) {
      dispatch(updateActionSettings(update));
      if (update.name === 'retryOption' && update.value === ERetryOptions.GOTO) {
        dispatch(updateActionSettingsGoto(actions[0].id));
      }
    }
  };

  const onReset = () => {
    dispatch(syncActionSettings());
    onHide();
  };

  const onHide = () => {
    dispatch(switchActionSettingsModal());
  };

  const onUpdateGoto = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActionSettingsGoto(e.currentTarget.value as TRandomUUID));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.checkValidity();
    if (Object.keys(settings).length !== 0) {
      dispatch(syncActionSettings(settings));
    }
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

  return (
    <Modal show={visible} size='lg' onHide={onHide} data-testid='action-settings-modal'>
      <Form id={FORM_ID} onSubmit={onSubmit} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionSettings.info')}</p>
          <Card>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' name='iframeFirst' checked={settings.iframeFirst || false} onChange={onUpdate} label={t('modal.actionSettings.iframeFirst')} />
                  <small className='text-muted'>{t('modal.actionSettings.iframeFirstHint')}</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card bg='warning-subtle' text='warning-emphasis' className='mt-3'>
            <Card.Body>
              <Row className='mb-2 mb-md-0'>
                <Col md={6} sm={12}>
                  <InputGroup>
                    <InputGroup.Text>{t('modal.actionSettings.retry.title')}</InputGroup.Text>
                    <FormControl placeholder={t('modal.actionSettings.retry.title')} name='retry' type='number' onBlur={onUpdate} defaultValue={settings.retry} pattern={REGEX.NUMBER} list='retry' />
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                  <InputGroup>
                    <InputGroup.Text>
                      {t('modal.actionSettings.retry.interval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={`${t('modal.actionSettings.retry.interval')} (${t('common.sec')})`}
                      list='interval'
                      onBlur={onUpdate}
                      name='retryInterval'
                      defaultValue={settings.retryInterval}
                      pattern={REGEX.INTERVAL}
                    />
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card bg='danger-subtle' text='danger-subtle' className='mt-3'>
            <Card.Body>
              <Row>
                <Col xs={12} className='mb-2'>
                  {t('modal.actionSettings.retry.hint')}
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={ERetryOptions.STOP}
                    checked={settings.retryOption === ERetryOptions.STOP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.stop')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={ERetryOptions.SKIP}
                    checked={settings.retryOption === ERetryOptions.SKIP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.skip')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={ERetryOptions.RELOAD}
                    checked={settings.retryOption === ERetryOptions.RELOAD}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.refresh')}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type='radio'
                    value={ERetryOptions.GOTO}
                    checked={settings.retryOption === ERetryOptions.GOTO}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.goto')}
                  />
                </Col>
                {settings.retryOption === ERetryOptions.GOTO && (
                  <Col xs={{ span: 3, offset: 9 }}>
                    <Form.Select value={settings.retryGoto} onChange={onUpdateGoto} name='goto' required>
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
          <Button type='reset' variant='outline-primary' className='px-5' data-testid='action-settings-reset'>
            {t('common.clear')}
          </Button>{' '}
          <Button type='submit' variant='primary' className='px-5' data-testid='action-settings-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export { ActionSettingsModal };
