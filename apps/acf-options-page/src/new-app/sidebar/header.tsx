import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

export const Header = () => {
  const { t } = useTranslation();

  let appName = t('common.appName');
  let imageURL = 'https://getautoclicker.com/favicons/favicon48.png';

  if (/(DEV|BETA)/.test(import.meta.env.VITE_PUBLIC_VARIANT ?? '')) {
    appName += ` [${import.meta.env.VITE_PUBLIC_VARIANT}]`;
    imageURL = `https://getautoclicker.com/icons/${import.meta.env.VITE_PUBLIC_VARIANT?.toLocaleLowerCase()}_icon48.png`;
  }

  return (
    <NavLink to='/' className='d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none text-white px-3 py-2 fs-4'>
      <img src={imageURL} width='32' height='32' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
      {appName}
    </NavLink>
  );
};
