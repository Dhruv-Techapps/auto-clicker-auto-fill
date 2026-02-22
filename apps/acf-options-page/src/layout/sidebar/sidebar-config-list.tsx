import { configSelector, useAppSelector } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
import { useState } from 'react';
import { Form, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
export const SidebarConfigList = () => {
  const { t } = useTranslation();
  const { configs } = useAppSelector(configSelector);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSearchMode = () => {
    setSearchMode((prev) => !prev);
  };

  return (
    <div className='d-flex flex-column mt-2' style={{ minHeight: 0, flex: 1 }}>
      {!searchMode ? (
        <div className='ms-3 me-2 py-2 d-flex align-items-center justify-content-between'>
          <small className='text-body-tertiary'>{t('automations.count', { count: configs.length })}</small>
          <i className='bi bi-search' onClick={toggleSearchMode} />
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
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }} className='border-top'>
        <Nav className='flex-column mt-1' variant='pills'>
          {configs
            .filter(
              (config) =>
                config.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                config.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                config.id?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((config) => (
              <Nav.Item key={config.id} className='w-100 px-2'>
                <NavLink to={ROUTES.AUTOMATION(config.id)} className={({ isActive }) => (isActive ? 'active nav-link px-2 text-truncate' : 'text-body-secondary nav-link px-2 text-truncate')}>
                  {config.name || config.url || config.id}
                </NavLink>
              </Nav.Item>
            ))}
        </Nav>
      </div>
    </div>
  );
};
