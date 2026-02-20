import { download } from '@acf-options-page/_helpers/download';
import { useConfig } from '@acf-options-page/_hooks/useConfig';
import { duplicateConfig, removeConfig, updateConfig, useAppDispatch } from '@acf-options-page/store';
import { APP_LINK } from '@acf-options-page/util/constants';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Dropdown, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router';
import Action from './configuration/action';

export const Configuration = () => {
  const config = useConfig();
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
    dispatch(removeConfig(config.id));
    navigate(-1);
  };

  return (
    <div className='d-flex h-100 p-3'>
      {config.url ? (
        <Container fluid>
          <Row className='align-items-center mb-3'>
            <Col>
              <Dropdown as={ButtonGroup} size='sm'>
                <Button>{config.name || config.url || config.id}</Button>
                <Dropdown.Toggle split id='config-dropdown'></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <i className='bi bi-pencil me-2' /> {t('configuration.edit')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => download(config.name || config.url, config)}>
                    <i className='bi bi-download me-2' /> {t('configuration.export')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate(`schedule`)}>
                    <i className='bi bi-stopwatch-fill me-2' /> {t('configuration.schedule')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate(`batch`)}>
                    <i className='bi bi-arrow-repeat me-2' /> {t('configuration.batch')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate(`watch`)}>
                    <i className='bi bi-eye-fill me-2' /> {t('configuration.watch')}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onDuplicateConfig}>
                    <i className='bi bi-copy me-2' /> {t('configuration.duplicate')}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onDeleteConfig}>
                    <i className='bi bi-trash me-2' /> {t('configuration.delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <small className='text-body-tertiary'>{config.url}</small>
            </Col>
            <Col xs='auto'>
              <Form.Check type='switch' name='enable' id='config-enable' label={t('configuration.enable')} checked={config.enable} onChange={onUpdate} />
            </Col>
            <Col xs='auto'>
              <Button variant='link' onClick={() => navigate(`settings`)}>
                <i className='bi bi-gear' />
              </Button>
            </Col>
          </Row>
          <Action />
        </Container>
      ) : (
        <Container className='m-auto'>
          <Card>
            <Card.Body>
              <Form.Group controlId='config-url'>
                <Form.Label>
                  {t('configuration.url')}&nbsp;<small className='text-danger'>*</small>
                </Form.Label>
                <FormControl name='url' required defaultValue={config.url} autoComplete='off' onBlur={onUpdate} placeholder={APP_LINK.TEST} />
                <Form.Control.Feedback type='invalid'>{t('error.url')}</Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>
        </Container>
      )}
      <Outlet />
    </div>
  );
};
