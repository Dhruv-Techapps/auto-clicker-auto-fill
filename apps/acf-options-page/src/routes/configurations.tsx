import { addConfig, configSelector } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router';
import { ConfigurationsListItem } from './configurations/configurations-list-item';

export const Configurations = () => {
  const { configs } = useAppSelector(configSelector);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConfigs, setSelectedConfigs] = useState<Array<TRandomUUID>>([]);
  const toggleConfigSelection = (id: TRandomUUID) => {
    setSelectionMode(true);
    setSelectedConfigs((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((configId) => configId !== id) : [...prevSelected, id]));
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onAddConfig = () => {
    const action = dispatch(addConfig());
    navigate(`/configurations/${action.payload.id}`);
  };

  return (
    <Container className='p-4'>
      <h4 className='my-4 d-flex justify-content-between align-items-center'>
        Configurations
        <Button variant='primary' size='sm' className='ms-auto' onClick={onAddConfig}>
          <i className='bi bi-plus-lg me-2 fs-6' /> New config
        </Button>
        <Button variant='primary' size='sm' className='ms-3'>
          <i className='bi bi-download me-2 fs-6' /> Import
        </Button>
      </h4>
      <Form>
        <Form.Control size='lg' type='search' placeholder='Search your configurations...' value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />
        <div className='mt-3 ms-3 d-flex align-items-center gap-3'>
          {selectionMode ? (
            <>
              <Form.Check
                label={`${selectedConfigs.length} selected`}
                id='config-all'
                title='select all'
                className='text-body-tertiary'
                onChange={() => setSelectedConfigs(selectedConfigs.length === configs.length ? [] : configs.map((config) => config.id))}
              />

              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} className='text-body-emphasis'>
                <i className='bi bi-upload' />
              </Button>
              <Button variant='link' size='sm' disabled={selectedConfigs.length === 0} className='text-body-emphasis'>
                <i className='bi bi-trash3' />
              </Button>
              <Button variant='link' size='sm' className='ms-auto' onClick={() => setSelectionMode(false)}>
                <i className='bi bi-x-lg' />
              </Button>
            </>
          ) : (
            <>
              <span className='text-body-tertiary'>{configs.length} configs within extension</span>
              <Button variant='link' size='sm' onClick={() => setSelectionMode(true)}>
                Select
              </Button>
            </>
          )}
        </div>
        <ListGroup className='mt-2' variant='flush'>
          {configs
            .filter((config) => config.name?.toLowerCase().includes(searchTerm.toLowerCase()) || config.url?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((config) => (
              <ListGroup.Item key={config.id} className='d-flex gap-3' action>
                {selectionMode ? (
                  <Form.Check id={`config-${config.id}`} checked={selectedConfigs.includes(config.id)} onChange={() => toggleConfigSelection(config.id)} className='w-100'>
                    <Form.Check.Input type='checkbox' />
                    <Form.Check.Label className='w-100'>
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
