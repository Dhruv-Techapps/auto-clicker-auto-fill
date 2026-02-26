import { firebaseLogoutAPI, firebaseSelector, switchFirebaseLoginModal, useAppDispatch, useAppSelector } from '@acf-options-page/store';
import { ABOUT_LINKS, LEARN_MORE_LINKS, SOCIAL_LINKS } from '@acf-options-page/util/constants';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { LanguageDropdown } from './sidebar-footer/language-dropdown';
import { LinkDropdown } from './sidebar-footer/link-dropdown';
import { ThemeDropdown } from './sidebar-footer/theme-dropdown';

interface ISidebarFooterProps {
  visible: boolean;
}
export const SidebarFooter = (props: ISidebarFooterProps) => {
  const { visible } = props;
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector(firebaseSelector);
  const { t } = useTranslation();

  return (
    <Nav className={visible ? 'px-2 border-top flex-column' : 'flex-column'}>
      <NavDropdown
        title={
          <div className='d-inline-flex align-items-center w-100 text-secondary-emphasis'>
            <div className='rounded-circle me-2 bg-body-tertiary d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px' }}>
              {user?.displayName
                ?.split(' ')
                .map((name) => name.charAt(0).toUpperCase())
                .join('') ?? 'E'}
            </div>
            {visible && (
              <div>
                {user?.displayName ?? 'Explorer'}
                <small className='d-block text-body-tertiary'>{role?.toUpperCase() ?? 'FREE'}</small>
              </div>
            )}
          </div>
        }
        as='div'
        id='user-dropdown'
        drop='up'
        className={visible ? 'd-block w-100 user-expand' : 'user-collapse'}
      >
        {user?.email && <NavDropdown.ItemText className='text-truncate text-body-tertiary'>{user?.email}</NavDropdown.ItemText>}
        <NavDropdown.Item as={NavLink} to='/settings'>
          <i className='bi bi-gear me-2' />
          {t('settings.title')}
        </NavDropdown.Item>
        <LanguageDropdown />
        <ThemeDropdown />
        <NavDropdown.Divider />
        {/*<NavDropdown.Item as={NavLink} to='/upgrade'>
          <i className='bi bi-arrow-up-circle me-2' />
          {t('upgradePlan.title')}
        </NavDropdown.Item>*/}
        <LinkDropdown title='learnMore' icon='bi-info-circle' links={LEARN_MORE_LINKS} />
        <LinkDropdown title='about' icon='bi-info-square' links={ABOUT_LINKS} />
        <LinkDropdown title='social' icon='bi-people' links={SOCIAL_LINKS} />
        <NavDropdown.Divider />
        {user ? (
          <NavDropdown.Item onClick={() => dispatch(firebaseLogoutAPI())}>
            <i className='bi bi-door-open me-2' />
            {t('logout')}
          </NavDropdown.Item>
        ) : (
          <NavDropdown.Item onClick={() => dispatch(switchFirebaseLoginModal())}>
            <i className='bi bi-door-closed me-2' />
            {t('login')}
          </NavDropdown.Item>
        )}
      </NavDropdown>
    </Nav>
  );
};
