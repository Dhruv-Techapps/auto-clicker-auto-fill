import { APP_LANGUAGES } from '@acf-options-page/util/constants';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const LanguageDropdown = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <NavDropdown
      title={
        <div className='d-inline-flex align-items-center w-100 text-secondary-emphasis'>
          <i className='bi bi-translate me-2' /> {t('languages.title')}
        </div>
      }
      drop='end'
      as='div'
      className='d-block w-100'
    >
      {APP_LANGUAGES.map((language) => (
        <NavDropdown.Item key={language} onClick={() => changeLanguage(language)} active={i18n.language === language}>
          {t(`languages.${language}`)}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
