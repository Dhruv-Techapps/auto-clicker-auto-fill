import { ErrorAlert } from '@acf-options-page/components/error-alert.components';
import { Loading } from '@acf-options-page/components/loading.components';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsGetAPI } from '@acf-options-page/store/settings/settings.api';
import { settingsSelector } from '@acf-options-page/store/settings/settings.slice';
import { useEffect } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { error, loading, message } = useAppSelector(settingsSelector);
  useEffect(() => {
    if (window.chrome?.runtime) {
      dispatch(settingsGetAPI());
    }
  }, [dispatch]);

  return (
    <Container className='my-5'>
      <h3>Settings</h3>
      <Row>
        <Col sm={2}>
          <Nav variant='pills' defaultActiveKey='/settings/general' className='flex-column'>
            <Nav.Item>
              <NavLink to='/settings/general' className='nav-link'>
                <i className='bi bi-gear-fill me-2' />
                General
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='/settings/notification' className='nav-link'>
                <i className='bi bi-bell-fill me-2' />
                Notification
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='/settings/retry' className='nav-link'>
                <i className='bi bi-arrow-repeat me-2' />
                Retry
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='/settings/backup' className='nav-link'>
                <i className='bi bi-cloud-arrow-up-fill me-2' />
                Backup
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='/settings/google-sheets' className='nav-link'>
                <i className='bi bi-file-spreadsheet-fill me-2' />
                Google Sheets
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='/settings/additional' className='nav-link'>
                <i className='bi bi-cloud-fill me-2' />
                Additional
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
