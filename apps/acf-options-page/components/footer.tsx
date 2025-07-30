import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SOCIAL_LINKS } from './constants';

export function Footer() {
  const { t } = useTranslation();

  const imageURL = 'https://getautoclicker.com/favicons/favicon48.png';

  return (
    <footer className='pt-3 mt-3 mt-md-3 pt-md-3 border-top' data-version={React.version}>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img src={imageURL} width='48' height='48' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
            <div className='d-inline-flex flex-column'>
              <h6 className='text-secondary mb-0'>
                {t('common.appName')}
                <span className={`${import.meta.env.VITE_PUBLIC_VARIANT} ms-2`}>[{import.meta.env.VITE_PUBLIC_VARIANT}]</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2025</small>
                <br />
                <small id='web-version'>☯ {import.meta.env.VITE_PUBLIC_RELEASE_VERSION}</small>
              </div>
            </div>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.connect')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='discord' href={SOCIAL_LINKS.DISCORD}>
                  <i className='bi bi-chat-fill me-2' />
                  {t('footer.discord')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.about')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='privacy' href='https://getautoclicker.com/policy/'>
                  <i className='bi bi-shield-check me-2' />
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='rate-us' href={SOCIAL_LINKS.RATE_US}>
                  <i className='bi bi-star me-2' />
                  {t('footer.rate-us')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.social')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='facebook' href={SOCIAL_LINKS.FACEBOOK}>
                  <i className='bi bi-facebook me-2' />
                  {t('footer.facebook')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='twitter' href={SOCIAL_LINKS.TWITTER}>
                  <i className='bi bi-twitter me-2' />
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='whatsapp' href={SOCIAL_LINKS.WHATSAPP}>
                  <i className='bi bi-whatsapp me-2' />
                  {t('footer.whatsapp')}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
