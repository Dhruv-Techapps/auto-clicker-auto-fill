import { useState } from 'react';
import { SidebarConfigList } from './sidebar-config-list';
import { SidebarFooter } from './sidebar-footer';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export const Sidebar = () => {
  const [visible, setVisible] = useState(localStorage.getItem('sidebar-state') !== 'collapsed');
  const sidebarWidth = visible ? '20rem' : '3.5rem';

  const toggleSidebar = () => {
    setVisible((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebar-state', newState ? 'expanded' : 'collapsed');
      return newState;
    });
  };

  return (
    <div className='d-flex flex-column flex-shrink-0 border-end' style={{ width: sidebarWidth, height: '100vh' }}>
      <SidebarHeader visible={visible} toggleSidebar={toggleSidebar} />
      <div className='p-2 d-flex flex-column flex-grow-1' style={{ minHeight: 0 }}>
        <SidebarMenu visible={visible} />
        {visible && <SidebarConfigList />}
      </div>
      <SidebarFooter visible={visible} />
    </div>
  );
};
