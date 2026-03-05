import { configSelector, useAppSelector } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
import { useState } from 'react';
import { Button, Dropdown, Form, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
export const SidebarConfigList = () => {
  const { t } = useTranslation();
  const { configs } = useAppSelector(configSelector);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const toggleSearchMode = () => {
    setSearchMode((prev) => !prev);
  };

  return (
    <>
      {!searchMode ? (
        <div className='ms-3 me-2 py-2 d-flex align-items-center justify-content-between'>
          <small className='text-body-tertiary'>{t('automations.count', { count: configs.length })}</small>
          <div className='d-inline-flex gap-3'>
            <Button variant='link' size='sm' className='p-0' onClick={toggleSearchMode} aria-label='Search Automations'>
              <i className='bi bi-search' />
            </Button>
            <Dropdown>
              <Dropdown.Toggle as={Button} variant='link' size='sm' className='p-0' aria-label='Filter Automations'>
                <i className='bi bi-funnel' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilter('all')} active={filter === 'all'}>
                  {t('automations.filter.all')}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('enabled')} active={filter === 'enabled'}>
                  {t('automations.filter.enabled')}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('disabled')} active={filter === 'disabled'}>
                  {t('automations.filter.disabled')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ) : (
        <Form.Control
          type='search'
          placeholder={t('automations.search')}
          className='rounded-0 py-2'
          size='sm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => setSearchMode(false)}
        />
      )}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <Nav className='flex-column mt-1' variant='pills'>
          {configs
            .filter(
              (config) =>
                (filter === 'all' || (filter === 'enabled' && config.enable !== false) || (filter === 'disabled' && config.enable === false)) &&
                (config.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  config.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  config.id?.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((config) => (
              <Nav.Item key={config.id} className='w-100 px-2'>
                <NavLink to={ROUTES.AUTOMATION(config.id)} className={({ isActive }) => (isActive ? 'active nav-link px-2 text-truncate' : 'text-body-secondary nav-link px-2 text-truncate')}>
                  {config.enable === false && <i className='bi bi-slash-circle me-1' title={t('automation.disabled')} />}
                  {config.name || config.url || config.id}
                </NavLink>
              </Nav.Item>
            ))}
        </Nav>
      </div>
    </>
  );
};
