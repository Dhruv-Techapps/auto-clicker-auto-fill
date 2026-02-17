import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { firebaseSelector, switchFirebaseLoginModal } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface IHeaderGoogleProps {
  visible: boolean;
}
export const HeaderGoogle = (props: IHeaderGoogleProps) => {
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
          {user ? (
            <div className='d-inline-flex align-items-center flex-grow-1'>
              <div className='rounded-circle me-2 bg-secondary d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px' }}>
                {user.displayName
                  ?.split(' ')
                  .map((name) => name.charAt(0).toUpperCase())
                  .join('')}
              </div>
              {visible && (
                <div>
                  {user.displayName}
                  {role && <small className='d-block text-body-secondary'>{role.toUpperCase()}</small>}
                </div>
              )}
            </div>
          ) : (
            <div className='d-inline-flex align-items-center flex-grow-1'>
              <div className='rounded-circle me-2 bg-secondary d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px' }}>
                E
              </div>
              {visible && (
                <div>
                  Explorer
                  <small className='d-block text-body-secondary'>FREE</small>
                </div>
              )}
            </div>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className='w-100'>
          {user?.email && <Dropdown.ItemText>{user?.email}</Dropdown.ItemText>}
          <Dropdown.Item as={NavLink} to='/settings/general' className='text-decoration-none '>
            <i className='bi bi-gear me-2' /> Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(switchFirebaseLoginModal())} className='text-decoration-none'>
            <i className='bi bi-door-open me-2' /> {t('header.login')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
