import { getStoredTheme, ThemeContext } from '@dhruv-techapps/ui-context';
import { useContext, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { DropDirection } from 'react-bootstrap/esm/DropdownContext';

type TThemeDropdownProps = {
  drop?: DropDirection;
};

export const ThemeButtonDropdown = (props: TThemeDropdownProps) => {
  const { drop } = props;
  const [theme, setTheme] = useState(getStoredTheme());
  const { updateTheme } = useContext(ThemeContext);

  const onClickTheme = (theme: Theme | null) => {
    setTheme(theme);
    updateTheme(theme);
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <i className='bi bi-sun' />;
    }
    if (theme === 'dark') {
      return <i className='bi bi-moon' />;
    }
    return <i className='bi bi-circle-half' />;
  };

  return (
    <DropdownButton title={getIcon()} drop={drop}>
      <Dropdown.Item active={theme === 'light'} onClick={() => onClickTheme('light')}>
        <i className='bi bi-sun' /> Light
      </Dropdown.Item>
      <Dropdown.Item active={theme === 'dark'} onClick={() => onClickTheme('dark')}>
        <i className='bi bi-moon' /> Dark
      </Dropdown.Item>
      <Dropdown.Item active={theme === null} onClick={() => onClickTheme(null)}>
        <i className='bi bi-circle-half' /> Auto
      </Dropdown.Item>
    </DropdownButton>
  );
};
