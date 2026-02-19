import { configSelector, useAppSelector } from '@acf-options-page/store';
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
    <Nav className='flex-column mt-4' variant='pills'>
      <Nav.Item className='mx-2 d-flex align-items-center justify-content-between'>
        <small className='text-body-tertiary'>{t('sidebar.configurationsCount', { count: configs.length })}</small>
        <i className='bi bi-search' onClick={toggleSearchMode} />
      </Nav.Item>
      <Nav.Item className='mx-2 mt-2'>
        <Form.Control
          type='search'
          placeholder={t('sidebar.search')}
          size='sm'
          className={`${searchMode ? 'd-block' : 'd-none'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => setSearchMode(false)}
        />
      </Nav.Item>
      {configs
        .filter(
          (config) =>
            config.name?.toLowerCase().includes(searchTerm.toLowerCase()) || config.url?.toLowerCase().includes(searchTerm.toLowerCase()) || config.id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((config) => (
          <Nav.Item key={config.id} className='w-100'>
            <NavLink to={`/configurations/${config.id}`} className={({ isActive }) => (isActive ? 'active nav-link px-2 text-truncate' : 'text-body-secondary nav-link px-2 text-truncate')}>
              {config.name || config.url || config.id}
            </NavLink>
          </Nav.Item>
        ))}
    </Nav>
  );
};
