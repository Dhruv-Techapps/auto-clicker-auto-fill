import { download } from '@acf-options-page/_helpers/download';
import { useAutomation } from '@acf-options-page/_hooks/useAutomation';
import { duplicateConfig, removeConfigs, updateConfig, useAppDispatch } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
import { APP_LINK } from '@acf-options-page/util/constants';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Dropdown, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';
import Step from './automation/step';

export const Automation = () => {
  const config = useAutomation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!config) {
    return null;
  }

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfig({ ...update, configId: config.id }));
    }
  };

  const onDuplicateConfig = () => {
    dispatch(duplicateConfig(config.id));
  };

  const onDeleteConfig = () => {
    dispatch(removeConfigs([config.id]));
    navigate(-1);
  };

  const onToggleEnable = () => {
    dispatch(updateConfig({ configId: config.id, name: 'enable', value: !config.enable }));
  };

  return (
    <>
      {config.url ? (
        <>
          <Container fluid>
            <Row className='p-2 align-items-center'>
              <Col xs='auto'>
                <Dropdown as={ButtonGroup} size='sm'>
                  <Button variant='outline-secondary'>{config.name || config.url || config.id}</Button>
                  <Dropdown.Toggle split id='config-dropdown' variant='outline-secondary'></Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <i className='bi bi-pencil me-2' /> {t('automation.edit')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => download(config.name || config.url, config)}>
                      <i className='bi bi-download me-2' /> {t('automation.export')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_SCHEDULE)}>
                      <i className='bi bi-stopwatch-fill me-2' /> {t('automation.schedule')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_LOOP)}>
                      <i className='bi bi-arrow-repeat me-2' /> {t('loop.title')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(ROUTES.AUTOMATION_MONITOR)}>
                      <i className='bi bi-eye-fill me-2' /> {t('monitor.title')}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onDuplicateConfig}>
                      <i className='bi bi-copy me-2' /> {t('automation.duplicate')}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onToggleEnable}>
                      <i className={`bi bi-toggle-${config.enable ? 'on' : 'off'} me-2`} /> {t(`automation.${config.enable ? 'disable' : 'enable'}`)}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={onDeleteConfig}>
                      <i className='bi bi-trash me-2' /> {t('automation.delete')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col className='text-center'>
                <small className='text-body-tertiary'>{config.url}</small>
              </Col>
              <Col xs='auto'>
                <Button variant='link' onClick={() => navigate(ROUTES.AUTOMATION_SETTINGS)}>
                  <i className='bi bi-gear' />
                </Button>
              </Col>
            </Row>
          </Container>
          <Step />
        </>
      ) : (
        <Container className='m-auto'>
          <Card>
            <Card.Body>
              <Form.Group controlId='config-url'>
                <Form.Label>
                  {t('automation.url')}&nbsp;<small className='text-danger'>*</small>
                </Form.Label>
                <FormControl name='url' required defaultValue={config.url} autoComplete='off' onBlur={onUpdate} placeholder={APP_LINK.TEST} />
                <Form.Control.Feedback type='invalid'>{t('error.url')}</Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>
        </Container>
      )}
      <Outlet />
    </>
  );
};
