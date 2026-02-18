import { getStoredTheme, ThemeContext, tTheme } from '@acf-options-page/context';
import { APP_LANGUAGES } from '@acf-options-page/util/constants';
import { useContext, useState } from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const SettingsGeneral = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const { updateTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const onClickTheme = (theme: tTheme | null) => {
    setTheme(theme);
    updateTheme(theme);
  };

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    localStorage.setItem('language', lng);
  };

  return (
    <div>
      <h4>Appearance</h4>
      <p>Color mode</p>
      <ListGroup horizontal className='mb-3' style={{ width: '300px' }}>
        <ListGroup.Item action active={theme === 'light'} onClick={() => onClickTheme('light')} className='d-flex align-items-center'>
          <i className='bi bi-sun-fill me-2 opacity-50'></i> Light
        </ListGroup.Item>
        <ListGroup.Item action active={theme === 'dark'} onClick={() => onClickTheme('dark')} className='d-flex align-items-center'>
          <i className='bi bi-moon-stars-fill me-2 opacity-50 '></i> Dark
        </ListGroup.Item>
        <ListGroup.Item action active={theme === null} onClick={() => onClickTheme(null)} className='d-flex align-items-center'>
          <i className='bi bi-circle-half me-2 opacity-50 '></i> Auto
        </ListGroup.Item>
      </ListGroup>
      <hr />
      <h4>Language</h4>
      <Container fluid className='d-flex flex-wrap flex-row mb-3 p-0'>
        <Row>
          {APP_LANGUAGES.map((language) => (
            <Col key={language} xs='auto' lg={3} className='my-5'>
              <Button key={language} variant={i18n.language === language ? 'outline-link' : 'link'} onClick={() => changeLanguage(language)}>
                {t(`language.${language}`)}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
