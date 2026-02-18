import { NavLink } from 'react-router';

interface SidebarMenuProps {
  visible: boolean;
}

export const SidebarMenu = ({ visible }: SidebarMenuProps) => {
  return (
    <ul className='navbar-nav justify-content-end pt-2 text-body-secondary'>
      <li className='nav-item px-2'>
        <NavLink to='/' end className='nav-link px-2'>
          <i className='bi bi-plus-circle mx-2' /> {visible && 'New Config'}
        </NavLink>
      </li>
      <li className='nav-item px-2'>
        <NavLink to='/search' end className='nav-link px-2'>
          <i className='bi bi-search mx-2' /> {visible && 'Search'}
        </NavLink>
      </li>
    </ul>
  );
};
