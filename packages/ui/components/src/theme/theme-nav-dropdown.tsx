import { getStoredTheme, ThemeContext, TTheme } from '@dhruv-techapps/ui-context';
import { useContext, useState } from 'react';

export const ThemeNavDropdown = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const { updateTheme } = useContext(ThemeContext);

  const onClickTheme = (theme: TTheme | null) => {
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
    <li className='nav-item dropdown'>
      <button className='btn btn-link nav-link dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>
        {getIcon()}
      </button>
      <ul className='dropdown-menu dropdown-menu-end'>
        <li>
          <button type='button' className={`dropdown-item d-flex align-items-center ${theme === 'light' ? 'active' : ''}`} onClick={() => onClickTheme('light')}>
            <i className='bi bi-sun-fill me-2 opacity-50 theme-icon'></i> Light
          </button>
        </li>
        <li>
          <button type='button' className={`dropdown-item d-flex align-items-center ${theme === 'dark' ? 'active' : ''}`} onClick={() => onClickTheme('dark')}>
            <i className='bi bi-moon-stars-fill me-2 opacity-50 theme-icon'></i> Dark
          </button>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
        <li>
          <button type='button' className={`dropdown-item d-flex align-items-center ${theme === null ? 'active' : ''}`} onClick={() => onClickTheme(null)}>
            <i className='bi bi-circle-half me-2 opacity-50 theme-icon'></i> Auto
          </button>
        </li>
      </ul>
    </li>
  );
};
