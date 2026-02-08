import { HeaderGoogle } from '@acf-options-page/app/header_google';
import { NavLink } from 'react-router';
import { SidebarConfigList } from './config-list';
import { Header } from './header';

export const Sidebar = () => {
  const sidebarWidth = '21rem';

  return (
    <div className='d-flex flex-column flex-shrink-0 text-bg-dark border-end' style={{ width: sidebarWidth }}>
      <Header />
      <ul className='navbar-nav justify-content-end pt-2 text-body-secondary'>
        <li className='nav-item px-2'>
          <NavLink to='/search' end className='nav-link px-2'>
            <i className='bi bi-search me-2 text-white' /> Search
          </NavLink>
        </li>
      </ul>
      <SidebarConfigList />
      <HeaderGoogle />
    </div>
  );
};
