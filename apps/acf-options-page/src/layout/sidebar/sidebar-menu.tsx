import { addConfig, useAppDispatch } from '@acf-options-page/store';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router';

interface SidebarMenuProps {
  visible: boolean;
}

export const SidebarMenu = ({ visible }: SidebarMenuProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onAddConfig = () => {
    const action = dispatch(addConfig());
    navigate(`/configurations/${action.payload.id}`);
  };
  return (
    <Nav className='flex-column' variant='pills'>
      <Nav.Item>
        <Nav.Link as='button' onClick={onAddConfig} className='text-body-secondary px-1'>
          <i className='bi bi-plus-circle mx-2 text-body-emphasis' /> {visible && t('sidebar.newConfig')}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to='/configurations' end className='text-body-secondary px-1'>
          <i className='bi bi-collection mx-2 text-body-emphasis' /> {visible && t('sidebar.configurations')}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
