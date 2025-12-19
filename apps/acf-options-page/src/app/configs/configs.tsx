import { download } from '@acf-options-page/_helpers';
import { Ads } from '@acf-options-page/components';
import { importAll, importConfig } from '@acf-options-page/store/config';
import { configGetAllAPI } from '@acf-options-page/store/config/config.api';
import { useAppDispatch } from '@acf-options-page/store/hooks';
import { addToast } from '@acf-options-page/store/toast.slice';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { ChangeEvent, createRef, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BatchModal, ConfigSettingsModal, RemoveConfigsModal, ReorderConfigsModal, ScheduleModal, WatchModal } from '../../modal';
import Footer from '../footer';
import Action from './action';
import Config from './config';
import { ConfigDropdown } from './config/config-dropdown';
import { ConfigSidebar } from './config/config-sidebar';

function Configs() {
  const { t } = useTranslation();
  const importFiled = createRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(configGetAllAPI());
    }
  }, [dispatch]);

  const onExportAll = (configs: Array<IConfiguration>) => {
    download('All Configurations', configs);
  };

  const onImportAll = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files || files.length <= 0) {
      return false;
    }
    const fr = new FileReader();
    fr.onload = function ({ target }) {
      try {
        if (target?.result === null) {
          dispatch(addToast({ header: 'File', body: t('error.json'), variant: 'danger' }));
        } else {
          const importedConfigs: Array<IConfiguration> | IConfiguration = JSON.parse(target?.result as string);
          if (!Array.isArray(importedConfigs)) {
            dispatch(importConfig(importedConfigs));
          } else {
            dispatch(importAll(importedConfigs));
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
    if (file) {
      fr.readAsText(file);
    }
    return false;
  };

  return (
    <Container fluid id='main'>
      <Row>
        <Col lg='3' className='pt-3 d-none d-lg-block'>
          <ConfigSidebar importFiled={importFiled} onExportAll={onExportAll} />
        </Col>
        <Col sm='auto' lg='9' className='pt-3'>
          <div>
            <ConfigDropdown importFiled={importFiled} onExportAll={onExportAll} />
            <main>
              <Config />
              <Action />
              <Ads />
              <Footer />
              <ConfigSettingsModal />
              <BatchModal />
              <WatchModal />
              <ReorderConfigsModal />
              <RemoveConfigsModal />
              <ScheduleModal />
            </main>
          </div>
        </Col>
      </Row>
      <div className='custom-file d-none'>
        <label className='custom-file-label' htmlFor='import-configurations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
          {t('configuration.importAll')}
          <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configurations' onChange={onImportAll} />
        </label>
      </div>
    </Container>
  );
}
export default Configs;
