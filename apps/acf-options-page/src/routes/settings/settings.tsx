import { ErrorAlert } from '@acf-options-page/components/error-alert.components';
import { Loading } from '@acf-options-page/components/loading.components';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsGetAPI } from '@acf-options-page/store/settings/settings.api';
import { settingsSelector } from '@acf-options-page/store/settings/settings.slice';
import { ROUTES } from '@acf-options-page/util';
import { useEffect } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { error, loading, message } = useAppSelector(settingsSelector);
  const { t } = useTranslation();
  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(settingsGetAPI());
    }
  }, [dispatch]);

  return (
    <Container className='my-5'>
      <h3>{t('settings.title')}</h3>
      <Row>
        <Col xs={2}>
          <Nav variant='pills' defaultActiveKey={ROUTES.SETTINGS_RETRY} className='flex-column'>
            <Nav.Item>
              <NavLink to={ROUTES.SETTINGS_RETRY} className='nav-link'>
                <i className='bi bi-arrow-repeat me-2' />
                {t('retry.title')}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to={ROUTES.SETTINGS_NOTIFICATION} className='nav-link'>
                <i className='bi bi-bell-fill me-2' />
                {t('notification.title')}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to={ROUTES.SETTINGS_BACKUP} className='nav-link'>
                <i className='bi bi-cloud-arrow-up-fill me-2' />
                {t('backup.title')}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to={ROUTES.SETTINGS_GOOGLE_SHEETS} className='nav-link'>
                <i className='bi bi-file-spreadsheet-fill me-2' />
                {t('googleSheets.title')}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to={ROUTES.SETTINGS_ADDITIONAL} className='nav-link'>
                <i className='bi bi-cloud-fill me-2' />
                {t('settings.additional')}
              </NavLink>
            </Nav.Item>
          </Nav>
        </Col>
        <Col>
          <ErrorAlert error={error} />
          {loading && <Loading />}
          <Outlet />
          {message && (
            <div className='mt-3 text-success' data-testid='settings-message'>
              {message}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};
