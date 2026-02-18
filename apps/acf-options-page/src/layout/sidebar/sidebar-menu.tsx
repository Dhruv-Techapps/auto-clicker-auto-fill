import { Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

interface SidebarMenuProps {
  visible: boolean;
}

export const SidebarMenu = ({ visible }: SidebarMenuProps) => {
  const { t } = useTranslation();
  return (
    <Navbar>
      <Nav className='flex-column'>
        <Nav.Item>
          <Nav.Link as={NavLink} to='/settings' end className='nav-link px-2'>
            <i className='bi bi-plus-circle mx-2 text-body-emphasis' /> {visible && t('sidebar.newConfig')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to='/search' end className='nav-link px-2'>
            <i className='bi bi-search mx-2 text-body-emphasis' /> {visible && t('sidebar.search')}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
