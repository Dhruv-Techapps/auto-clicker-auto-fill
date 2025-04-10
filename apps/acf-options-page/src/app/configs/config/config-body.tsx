import { selectedConfigSelector, updateConfig } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { REGEX } from '@acf-options-page/util';
import { APP_LINK } from '@acf-options-page/util/constants';
import { getFieldNameValue, updateForm } from '@acf-options-page/util/element';
import { useEffect, useState } from 'react';
import { Card, Col, Form, FormControl, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FORM_ID = 'config-body';

function ConfigBody() {
  const config = useAppSelector(selectedConfigSelector);
  const [isInvalid, setIsInvalid] = useState(true);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onUpdate = (e) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfig(update));
    }
  };

  const onKeyDown = (e) => {
    setIsInvalid(e.target.value !== '');
  };

  useEffect(() => {
    if (config && config.url) {
      setIsInvalid(false);
    }
    updateForm(FORM_ID, config);
  }, [config]);

  if (!config) {
    return null;
  }

  return (
    <Form id={FORM_ID}>
      <Card.Body>
        <Row>
          <Col md='2' sm='12'>
            <Form.Group controlId='config-name'>
              <Form.Label>{t('configuration.name')}</Form.Label>
              <FormControl name='name' autoComplete='off' defaultValue={config.name} onBlur={onUpdate} placeholder='getautoclicker.com' />
            </Form.Group>
          </Col>
          <Col md='8' xxl='9' sm='12'>
            <Form.Group controlId='config-url'>
              <Form.Label>
                {t('configuration.url')}&nbsp;<small className='text-danger'>*</small>
              </Form.Label>
              <FormControl name='url' required isInvalid={isInvalid} onKeyDown={onKeyDown} defaultValue={config.url} autoComplete='off' onBlur={onUpdate} placeholder={APP_LINK.TEST} />
              <Form.Control.Feedback type='invalid'>{t('error.url')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='2' xxl='1' sm='12'>
            <Form.Group controlId='config-init-wait'>
              <Form.Label>
                {t('configuration.initWait')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
              </Form.Label>
              <FormControl name='initWait' pattern={REGEX.INTERVAL} defaultValue={config.initWait} onBlur={onUpdate} autoComplete='off' list='interval' placeholder='0' />
              <Form.Control.Feedback type='invalid'>{t('error.initWait')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Form>
  );
}

export default ConfigBody;
