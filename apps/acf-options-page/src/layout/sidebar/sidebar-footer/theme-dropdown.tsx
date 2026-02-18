import { getStoredTheme, ThemeContext, tTheme } from '@acf-options-page/context';
import { useContext, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const ThemeDropdown = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const { updateTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const onClickTheme = (theme: tTheme | null) => {
    setTheme(theme);
    updateTheme(theme);
  };
  return (
    <NavDropdown
      title={
        <div className='d-inline-flex align-items-center w-100 text-secondary-emphasis'>
          <i className='bi bi-palette me-2' /> {t('sidebar.theme')}
        </div>
      }
      drop='end'
      as='div'
      className='d-block w-100'
    >
      <NavDropdown.Item active={theme === 'light'} onClick={() => onClickTheme('light')} className='d-flex align-items-center'>
        <i className='bi bi-sun-fill me-2 opacity-50'></i> Light
      </NavDropdown.Item>
      <NavDropdown.Item active={theme === 'dark'} onClick={() => onClickTheme('dark')} className='d-flex align-items-center'>
        <i className='bi bi-moon-stars-fill me-2 opacity-50 '></i> Dark
      </NavDropdown.Item>
      <NavDropdown.Item active={theme === null} onClick={() => onClickTheme(null)} className='d-flex align-items-center'>
        <i className='bi bi-circle-half me-2 opacity-50 '></i> Auto
      </NavDropdown.Item>
    </NavDropdown>
  );
};
