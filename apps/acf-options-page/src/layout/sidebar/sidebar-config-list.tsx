import { filteredConfigsSelector } from '@acf-options-page/store/config/config.slice';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

export const SidebarConfigList = () => {
  const { t } = useTranslation();
  const configs = useAppSelector(filteredConfigsSelector);
  return (
    <Nav className='flex-column mt-4'>
      <Nav.Item className='mx-3'>
        <small className='text-body-tertiary'>{t('sidebar.configurations', { count: configs.length })}</small>
      </Nav.Item>
      {configs.map((config) => (
        <NavLink to={`/config/${config.id}`} className={({ isActive }) => (isActive ? 'nav-link active text-body-emphasis bg-body-tertiary' : 'nav-link text-secondary-emphasis')} key={config.id}>
          {config.name || config.url}
        </NavLink>
      ))}
    </Nav>
  );
};
