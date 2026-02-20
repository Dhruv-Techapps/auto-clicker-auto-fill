import { download } from '@acf-options-page/_helpers';
import { addConfig, configSelector, setConfigs } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { addToast } from '@acf-options-page/store/toast.slice';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router';
import { ConfigurationsImport } from './configurations/configurations-import';
import { ConfigurationsListItem } from './configurations/configurations-list-item';

export const Configurations = () => {
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
    navigate(`/configurations/${action.payload.id}`);
  };

  const onExport = () => {
    if (selectedConfigs.length === 0) {
      return;
    }
    const configsToExport = configs.filter((config) => selectedConfigs.includes(config.id));
    download('selected-configs', configsToExport);
  };

  const onDelete = () => {
    if (selectedConfigs.length === 0) {
      return;
    }

    const remainingConfigs = configs.filter((config) => !selectedConfigs.includes(config.id));
    dispatch(setConfigs(remainingConfigs));
    dispatch(addToast({ header: t('toast.config.header'), body: t('toast.config.remove'), variant: 'success' }));
    setSelectedConfigs([]);
  };

  return (
    <Container className='p-4'>
      <h4 className='my-4 d-flex justify-content-between align-items-center'>
        {t('configurations.title')}
        <Button variant='primary' size='sm' className='ms-auto' onClick={onAddConfig}>
          <i className='bi bi-plus-lg me-2 fs-6' /> {t('configurations.newConfig')}
        </Button>
        <ConfigurationsImport />
      </h4>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Control size='lg' type='search' placeholder={t('configurations.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />
        <div className='mt-3 ms-3 d-flex align-items-center gap-3'>
          {selectionMode ? (
            <>
              <Form.Check
                label={`${selectedConfigs.length} ${t('configurations.selected')}`}
                id='config-all'
                title={t('configurations.selectAll')}
                className='text-body-tertiary'
                onChange={() => setSelectedConfigs(selectedConfigs.length === configs.length ? [] : configs.map((config) => config.id))}
              />
              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} onClick={onExport} className='text-body-emphasis' title={t('configurations.exportSelected')}>
                <i className='bi bi-upload' />
              </Button>
              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} onClick={onDelete} className='text-body-emphasis' title={t('configurations.deleteSelected')}>
                <i className='bi bi-trash3' />
              </Button>
              <Button variant='link' size='sm' className='ms-auto' onClick={() => setSelectionMode(false)} title={t('configurations.cancelSelection')}>
                <i className='bi bi-x-lg' />
              </Button>
            </>
          ) : (
            <>
              <span className='text-body-tertiary'>
                {configs.length} {t('configurations.configsWithinExtension')}
              </span>
              <Button variant='link' size='sm' onClick={() => setSelectionMode(true)} title={t('configurations.selectConfigs')}>
                {t('configurations.select')}
              </Button>
            </>
          )}
        </div>
        <ListGroup className='mt-2' variant='flush'>
          {configs
            .filter((config) => config.name?.toLowerCase().includes(searchTerm.toLowerCase()) || config.url?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((config) => (
              <ListGroup.Item key={config.id} className='d-flex gap-3'>
                {selectionMode ? (
                  <Form.Check type='checkbox' className='w-100'>
                    <Form.Check.Input type='checkbox' checked={selectedConfigs.includes(config.id)} onChange={() => toggleConfigSelection(config.id)} id={`config-${config.id}`} />
                    <Form.Check.Label className='w-100' htmlFor={`config-${config.id}`}>
                      <ConfigurationsListItem config={config} />
                    </Form.Check.Label>
                  </Form.Check>
                ) : (
                  <NavLink to={`/configurations/${config.id}`} className='text-decoration-none w-100'>
                    <ConfigurationsListItem config={config} />
                  </NavLink>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Form>
    </Container>
  );
};
