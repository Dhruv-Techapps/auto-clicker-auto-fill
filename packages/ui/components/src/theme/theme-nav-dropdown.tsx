import { getStoredTheme, ThemeContext, tTheme } from '@dhruv-techapps/ui-context';
import { useContext, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';

export const ThemeNavDropdown = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const { updateTheme } = useContext(ThemeContext);

  const onClickTheme = (theme: tTheme | null) => {
    setTheme(theme);
    updateTheme(theme);
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <i className='bi bi-sun-fill'></i>;
    }
    if (theme === 'dark') {
      return <i className='bi bi-moon-stars-fill'></i>;
    }
    return <i className='bi bi-circle-half'></i>;
  };

  return (
    <NavDropdown id='nav-dropdown-dark-example' title={getIcon()} menuVariant='dark' as={'ul'}>
      <NavDropdown.Item onClick={() => onClickTheme('light')} active={theme === 'light'} className='d-flex align-items-center'>
        <i className='bi bi-sun-fill me-2 opacity-50'></i> Light
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => onClickTheme('dark')} active={theme === 'dark'} className='d-flex align-items-center'>
        <i className='bi bi-moon-stars-fill me-2 opacity-50 '></i> Dark
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => onClickTheme(null)} active={theme === null} className='d-flex align-items-center'>
        <i className='bi bi-circle-half me-2 opacity-50 '></i> Auto
      </NavDropdown.Item>
    </NavDropdown>
  );
};
