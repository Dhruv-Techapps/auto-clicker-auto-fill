import { firebaseLogoutAPI, firebaseSelector, switchFirebaseLoginModal } from '@acf-options-page/store/firebase';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

interface ISidebarFooterProps {
  visible: boolean;
}
export const SidebarFooter = (props: ISidebarFooterProps) => {
  const { visible } = props;
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector(firebaseSelector);
  const { t, i18n } = useTranslation();
  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    localStorage.setItem('language', lng);
  };
  return (
    <div className='d-flex flex-column p-3 border-top'>
      <Dropdown className='dropdown'>
        <Dropdown.Toggle variant='secondary' as='div' className='d-flex align-items-center cursor-pointer'>
          <div className='d-inline-flex align-items-center flex-grow-1'>
            <div className='rounded-circle me-2 bg-body-tertiary d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px' }}>
              {user?.displayName
                ?.split(' ')
                .map((name) => name.charAt(0).toUpperCase())
                .join('') ?? 'E'}
            </div>
            {visible && (
              <div>
                {user?.displayName ?? 'Explorer'}
                <small className='d-block text-body-secondary'>{role?.toUpperCase() ?? 'FREE'}</small>
              </div>
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className='w-100'>
          {user?.email && <Dropdown.ItemText>{user?.email}</Dropdown.ItemText>}
          <Dropdown.Item as={NavLink} to='/settings/general' className='text-decoration-none'>
            <i className='bi bi-gear me-2' /> Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          {!role && (
            <>
              <Dropdown.Item as={NavLink} to='/upgrade' className='text-decoration-none'>
                <i className='bi bi-arrow-up-circle me-2' /> Upgrade Plan
              </Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          {user ? (
            <Dropdown.Item onClick={() => dispatch(firebaseLogoutAPI())} className='text-decoration-none'>
              <i className='bi bi-door-closed me-2' /> {t('header.logout')}
            </Dropdown.Item>
          ) : (
            <Dropdown.Item onClick={() => dispatch(switchFirebaseLoginModal())} className='text-decoration-none'>
              <i className='bi bi-door-open me-2' /> {t('header.login')}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
