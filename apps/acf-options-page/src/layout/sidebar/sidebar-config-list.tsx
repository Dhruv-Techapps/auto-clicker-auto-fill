import { filteredConfigsSelector } from '@acf-options-page/store/config/config.slice';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
export const SidebarConfigList = () => {
  const { t } = useTranslation();
  const configs = useAppSelector(filteredConfigsSelector);
  return (
    <Nav className='flex-column mt-4' variant='pills'>
      <Nav.Item className='mx-2'>
        <small className='text-body-tertiary'>{t('sidebar.configurationsCount', { count: configs.length })}</small>
      </Nav.Item>
      {configs.map((config) => (
        <Nav.Item key={config.id} className='w-100'>
          <NavLink to={`/configurations/${config.id}`} className={({ isActive }) => (isActive ? 'active nav-link px-2 text-truncate' : 'text-body-secondary nav-link px-2 text-truncate')}>
            {config.name || config.url || config.id}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};
