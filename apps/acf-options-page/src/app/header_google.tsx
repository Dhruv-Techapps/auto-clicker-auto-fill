import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { firebaseSelector, switchFirebaseLoginModal } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const HeaderGoogle = () => {
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
      {user ? (
        <Dropdown className='dropdown'>
          <Dropdown.Toggle variant='secondary' as='div' className='d-flex align-items-center cursor-pointer'>
            <div className='d-inline-flex align-items-center flex-grow-1'>
              <div className='rounded-circle me-2 bg-secondary d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px' }}>
                {user.displayName
                  ?.split(' ')
                  .map((name) => name.charAt(0).toUpperCase())
                  .join('')}
              </div>
              <div>
                {user.displayName}
                {role && <small className='d-block text-body-secondary'>{role.toUpperCase()}</small>}
              </div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className='w-100'>
            <Dropdown.ItemText>{user.email}</Dropdown.ItemText>
            <Dropdown.Item as={NavLink} to='/settings/general' className='text-decoration-none text-body'>
              <i className='bi bi-gear me-2' /> Settings
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <button className='btn btn-primary' onClick={() => dispatch(switchFirebaseLoginModal())}>
          {t('header.login')}
        </button>
      )}
    </div>
  );
};
