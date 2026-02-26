import { importConfigs, useAppDispatch } from '@acf-options-page/store';
import { addToast } from '@acf-options-page/store/toast.slice';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { ChangeEvent, createRef } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const AutomationsImport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const importFiled = createRef<HTMLInputElement>();
  const onImportAll = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files || files.length <= 0) {
      return false;
    }
    const fr = new FileReader();
    fr.onload = function ({ target }) {
      try {
        if (target?.result === null) {
          dispatch(addToast({ header: t('common.file'), body: t('error.json'), variant: 'danger' }));
        } else {
          const importedConfigs: Array<IConfiguration> | IConfiguration = JSON.parse(target?.result as string);
          dispatch(importConfigs(!Array.isArray(importedConfigs) ? [importedConfigs] : importedConfigs));
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch(addToast({ header: t('common.file'), body: error.message, variant: 'danger' }));
        } else if (typeof error === 'string') {
          dispatch(addToast({ header: t('common.file'), body: error, variant: 'danger' }));
        } else {
          dispatch(addToast({ header: t('common.file'), body: JSON.stringify(error), variant: 'danger' }));
        }
      }
    };
    const file = files.item(0);
    if (file) {
      fr.readAsText(file);
    }
    return;
  };

  return (
    <>
      <Button variant='primary' size='sm' className='ms-3' onClick={() => importFiled.current?.click()}>
        <i className='bi bi-download me-2 fs-6' /> {t('automations.import')}
      </Button>
      <div className='custom-file d-none'>
        <label className='custom-file-label' htmlFor='import-automations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
          {t('automations.import')}
          <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-automations' onChange={onImportAll} />
        </label>
      </div>
    </>
  );
};
