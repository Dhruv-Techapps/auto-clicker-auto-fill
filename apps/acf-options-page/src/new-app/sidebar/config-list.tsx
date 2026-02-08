import { filteredConfigsSelector } from '@acf-options-page/store/config/config.slice';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router';

export const SidebarConfigList = () => {
  const configs = useAppSelector(filteredConfigsSelector);
  return (
    <Nav className='mb-auto flex-column'>
      {configs.map((config) => (
        <NavLink to={`/config/${config.id}`} className='nav-link' key={config.id}>
          {config.name || config.url}
        </NavLink>
      ))}
    </Nav>
  );
};
