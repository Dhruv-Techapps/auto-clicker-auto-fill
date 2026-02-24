import { download } from '@acf-options-page/_helpers';
import { addConfig, configSelector, removeConfigs } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { addToast } from '@acf-options-page/store/toast.slice';
import { ROUTES } from '@acf-options-page/util';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router';
import { AutomationsImport } from './automations/automations-import';
import { AutomationsListItem } from './automations/automations-list-item';

export const Automations = () => {
  const { configs } = useAppSelector(configSelector);
  const { t } = useTranslation();
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConfigs, setSelectedConfigs] = useState<Array<TRandomUUID>>([]);
  const toggleConfigSelection = (id: TRandomUUID) => {
    setSelectedConfigs((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((configId) => configId !== id) : [...prevSelected, id]));
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onAddConfig = () => {
    const action = dispatch(addConfig());
    navigate(ROUTES.AUTOMATION(action.payload.id));
  };

  const onExport = () => {
    if (selectedConfigs.length === 0) {
      return;
    }
    const configsToExport = configs.filter((config) => selectedConfigs.includes(config.id));
    download(t('automations.title'), configsToExport);
    dispatch(addToast({ header: t('automations.toast.header'), body: t('automations.toast.export', { count: selectedConfigs.length }) }));
  };

  const onDelete = () => {
    if (selectedConfigs.length === 0) {
      return;
    }
    dispatch(removeConfigs(selectedConfigs));
    setSelectedConfigs([]);
  };

  return (
    <Container className='p-4'>
      <h4 className='my-4 d-flex justify-content-between align-items-center'>
        {t('automations.title')}
        <Button variant='primary' size='sm' className='ms-auto' onClick={onAddConfig}>
          <i className='bi bi-plus-lg me-2 fs-6' /> {t('automations.add')}
        </Button>
        <AutomationsImport />
      </h4>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Control size='lg' type='search' placeholder={t('automations.search')} value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />
        <div className='mt-3 ms-3 d-flex align-items-center gap-3'>
          {selectionMode ? (
            <>
              <Form.Check
                label={t('automations.selected', { count: selectedConfigs.length })}
                id='config-all'
                title={t('automations.selectAll')}
                className='text-body-tertiary'
                onChange={() => setSelectedConfigs(selectedConfigs.length === configs.length ? [] : configs.map((config) => config.id))}
              />
              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} onClick={onExport} className='text-body-emphasis' title={t('automations.exportSelected')}>
                <i className='bi bi-upload' />
              </Button>
              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} onClick={onDelete} className='text-body-emphasis' title={t('automations.deleteSelected')}>
                <i className='bi bi-trash3' />
              </Button>
              <Button variant='link' size='sm' className='ms-auto' onClick={() => setSelectionMode(false)} title={t('automations.cancelSelection')}>
                <i className='bi bi-x-lg' />
              </Button>
            </>
          ) : (
            <>
              <span className='text-body-tertiary'>{t('automations.automationsWithinExtension', { count: configs.length })}</span>
              <Button variant='link' size='sm' onClick={() => setSelectionMode(true)} title={t('automations.selectAutomations')}>
                {t('automations.select')}
              </Button>
            </>
          )}
        </div>
        <ListGroup className='mt-2' variant='flush'>
          {configs
            .filter((config) => config.name?.toLowerCase().includes(searchTerm.toLowerCase()) || config.url?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((config) => (
              <ListGroup.Item key={config.id} className='d-flex gap-3' action={!selectionMode}>
                {selectionMode ? (
                  <Form.Check type='checkbox' className='w-100'>
                    <Form.Check.Input type='checkbox' checked={selectedConfigs.includes(config.id)} onChange={() => toggleConfigSelection(config.id)} id={`config-${config.id}`} />
                    <Form.Check.Label className='w-100' htmlFor={`config-${config.id}`}>
                      <AutomationsListItem config={config} />
                    </Form.Check.Label>
                  </Form.Check>
                ) : (
                  <NavLink to={ROUTES.AUTOMATION(config.id)} className='text-decoration-none w-100'>
                    <AutomationsListItem config={config} />
                  </NavLink>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Form>
    </Container>
  );
};
