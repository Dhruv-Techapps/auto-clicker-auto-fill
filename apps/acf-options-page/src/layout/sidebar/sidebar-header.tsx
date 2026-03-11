import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

interface ISidebarHeaderProps {
  visible: boolean;
  toggleSidebar: () => void;
}
export const SidebarHeader = (props: ISidebarHeaderProps) => {
  const { visible, toggleSidebar } = props;
  const { t } = useTranslation();

  let appName = t('meta.appName');
  let imageURL = 'https://getautoclicker.com/favicons/favicon48.png';

  if (/(DEV|BETA)/.test(import.meta.env.VITE_PUBLIC_VARIANT ?? '')) {
    imageURL = `https://getautoclicker.com/icons/${import.meta.env.VITE_PUBLIC_VARIANT?.toLocaleLowerCase()}_icon48.png`;
  }

  return (
    <div className='d-flex justify-content-center align-items-center align-items-center pt-2'>
      {visible && (
        <NavLink to='/' className='d-flex align-items-center mb-md-0 me-md-auto text-decoration-none px-3 fs-5 text-secondary-emphasis'>
          <img src={imageURL} width='24' height='24' className='d-inline-block align-top me-2' alt={t('meta.logoAlt')} title={t('meta.logoAlt')} />
          {appName}
        </NavLink>
      )}
      <button className='btn' type='button' onClick={toggleSidebar} style={{ cursor: 'ew-resize' }}>
        <i className='bi bi-layout-sidebar' />
      </button>
    </div>
  );
};
