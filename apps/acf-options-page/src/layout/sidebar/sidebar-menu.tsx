import { addConfig, useAppDispatch } from '@acf-options-page/store';
import { ROUTES } from '@acf-options-page/util';
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
    navigate(ROUTES.AUTOMATION(action.payload.id));
  };
  return (
    <Nav className='flex-column my-2 p-1 border-top border-bottom' variant='pills'>
      <Nav.Item>
        <Nav.Link as='button' onClick={onAddConfig} className='text-body-secondary px-2'>
          <i className='bi bi-plus-circle mx-2 text-body-emphasis' /> {visible && t('automations.add')}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <NavLink to={ROUTES.AUTOMATIONS} end className={({ isActive }) => (isActive ? 'active nav-link px-2 text-truncate' : 'text-body-secondary nav-link px-2 text-truncate')}>
          <i className='bi bi-collection mx-2' /> {visible && t('automations.title')}
        </NavLink>
      </Nav.Item>
    </Nav>
  );
};
