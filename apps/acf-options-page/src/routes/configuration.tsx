import { download } from '@acf-options-page/_helpers/download';
import { configByIdSelector, updateConfig, useAppDispatch, useAppSelector } from '@acf-options-page/store';
import { APP_LINK } from '@acf-options-page/util/constants';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Card, Col, Container, Dropdown, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router';

export const Configuration = () => {
  const { configId } = useParams<{ configId: TRandomUUID }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfig({ ...update, selectedConfigId: configId } as any));
    }
  };
  if (!configId) {
    return <div>Configuration ID is missing</div>;
  }
  const config = useAppSelector((state) => configByIdSelector(state, configId));
  if (!config) {
    return <div>Configuration not found</div>;
  }

  return (
    <div className='d-flex h-100 p-3'>
      {config.url ? (
        <Container fluid>
          <Row className='align-items-center'>
            <Col>
              <Dropdown as={ButtonGroup} size='sm'>
                <Button>{config.name || config.url || config.id}</Button>
                <Dropdown.Toggle split id='config-dropdown'></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <i className='bi bi-pencil me-2' /> Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => download(config.name || config.url, config)}>
                    <i className='bi bi-download me-2' /> Export
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => window.open(config.url, '_blank')}>
                    <i className='bi bi-stopwatch-fill me-2' /> Schedule
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => window.open(config.url, '_blank')}>
                    <i className='bi bi-copy me-2' /> Duplicate
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => window.open(config.url, '_blank')}>
                    <i className='bi bi-trash me-2' /> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
