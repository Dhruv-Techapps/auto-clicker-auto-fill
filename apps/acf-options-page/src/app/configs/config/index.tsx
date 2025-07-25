import { download } from '@acf-options-page/_helpers';
import { useTimeout } from '@acf-options-page/_hooks/message.hooks';
import {
  configSelector,
  duplicateConfig,
  importAll,
  importConfig,
  openScheduleModalAPI,
  selectedConfigSelector,
  setConfigMessage,
  switchConfigSettingsModal,
  updateConfig
} from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { addToast } from '@acf-options-page/store/toast.slice';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { ChangeEvent, createRef } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConfigBody from './config-body';

function Config() {
  const { message, error } = useAppSelector(configSelector);
  const config = useAppSelector(selectedConfigSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const importFiled = createRef<HTMLInputElement>();

  useTimeout(() => {
    dispatch(setConfigMessage());
  }, message);

  if (!config) {
    return <Alert variant='secondary'>Please select configuration from left</Alert>;
  }

  const onUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const update = getFieldNameValue(e, config);
    if (update) {
      dispatch(updateConfig(update));
    }
  };

  const onExportConfig = () => {
    const url = config.url.split('/')[2] || 'default';
    const name = config.name || url;
    download(name, config);
  };

  const onImportConfig = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files }
    } = e;

    if (!files || files.length <= 0) {
      return false;
    }
    const fr = new FileReader();
    fr.onload = function ({ target }) {
      try {
        if (target?.result === null) {
          dispatch(addToast({ header: 'File', body: t('error.json'), variant: 'danger' }));
        } else {
          const importedConfig: IConfiguration = JSON.parse(target?.result as string);
          if (Array.isArray(importedConfig)) {
            dispatch(importAll(importedConfig));
          } else {
            dispatch(importConfig(importedConfig));
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch(addToast({ header: 'File', body: error.message, variant: 'danger' }));
        } else if (typeof error === 'string') {
          dispatch(addToast({ header: 'File', body: error, variant: 'danger' }));
        } else {
          dispatch(addToast({ header: 'File', body: JSON.stringify(error), variant: 'danger' }));
        }
      }
    };
    const file = files.item(0);
    if (file !== null) {
      fr.readAsText(file);
    }
    return false;
  };

  const showSettings = () => {
    dispatch(switchConfigSettingsModal());
  };

  const onDuplicateConfig = () => {
    dispatch(duplicateConfig());
  };

  const showSchedule = () => {
    dispatch(openScheduleModalAPI());
  };

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Header as='h6'>
        <Row>
          <Col className='d-flex align-items-center'>
            {t('configuration.title')}
            <div className='d-flex align-items-center'>
              {config.enable ? (
                <Button variant='link' onClick={showSchedule}>
                  <i className='bi bi-stock-watch' />
                </Button>
              ) : (
                <Badge pill bg='secondary' className='ms-2 d-none d-md-block'>
                  {t('common.disabled')}
                </Badge>
              )}
            </div>
            <small className='text-danger ms-3'>{error}</small>
            <small className='text-success ms-3'>{message}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Form className='me-3'>
              <Form.Check type='switch' name='enable' id='config-enable' label={t('configuration.enable')} checked={config.enable} onChange={onUpdate} />
            </Form>
            <ButtonGroup>
              <Button variant='link' title={t('configuration.export')} onClick={onExportConfig} data-testid='export-configuration'>
                <i className='bi bi-upload fs-5' />
              </Button>
              <Button variant='link' title={t('configuration.import')} onClick={() => importFiled.current?.click()} data-testid='import-configuration'>
                <i className='bi bi-download fs-5' />
              </Button>
              <Button variant='link' title={t('configuration.duplicate')} onClick={onDuplicateConfig} data-testid='duplicate-configuration'>
                <i className='bi bi-copy fs-5' />
              </Button>
              <Button variant='link' title={t('configuration.settings')} onClick={showSettings} data-testid='configuration-settings'>
                <i className='bi bi-gear fs-5' />
              </Button>
            </ButtonGroup>
            <div className='custom-file d-none'>
              <label className='custom-file-label' htmlFor='import-configuration' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                {t('configuration.import')}
                <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configuration' onChange={onImportConfig} />
              </label>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <ConfigBody />
    </Card>
  );
}
export default Config;
