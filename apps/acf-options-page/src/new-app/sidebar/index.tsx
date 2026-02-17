import { HeaderGoogle } from '@acf-options-page/app/header_google';
import { useState } from 'react';
import { NavLink } from 'react-router';
import { SidebarConfigList } from './config-list';
import { Header } from './header';

export const Sidebar = () => {
  const [visible, setVisible] = useState(localStorage.getItem('sidebar-state') !== 'collapsed');
  const sidebarWidth = visible ? '21rem' : '4.5rem';

  const style = visible ? { width: sidebarWidth } : { width: sidebarWidth, cursor: 'ew-resize' };

  const toggleSidebar = () => {
    setVisible((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebar-state', newState ? 'expanded' : 'collapsed');
      return newState;
    });
  };

  return (
    <div className='d-flex flex-column flex-shrink-0 border-end' style={style}>
      <Header visible={visible} toggleSidebar={toggleSidebar} />
      <div className='mb-auto'>
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
        {visible && <SidebarConfigList />}
      </div>
      <HeaderGoogle visible={visible} />
    </div>
  );
};
