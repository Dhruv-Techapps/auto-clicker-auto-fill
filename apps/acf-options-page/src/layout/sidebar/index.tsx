import { useState } from 'react';
import { SidebarConfigList } from './sidebar-config-list';
import { SidebarFooter } from './sidebar-footer';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export const Sidebar = () => {
  const [visible, setVisible] = useState(localStorage.getItem('sidebar-state') !== 'collapsed');
  const sidebarWidth = visible ? '21rem' : '4.5rem';

  const toggleSidebar = () => {
    setVisible((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebar-state', newState ? 'expanded' : 'collapsed');
      return newState;
    });
  };

  return (
    <div className='d-flex flex-column flex-shrink-0 border-end' style={{ width: sidebarWidth }}>
      <SidebarHeader visible={visible} toggleSidebar={toggleSidebar} />
      <div className='mb-auto'>
        <SidebarMenu visible={visible} />
        {visible && <SidebarConfigList />}
      </div>
      <SidebarFooter visible={visible} />
    </div>
  );
};
