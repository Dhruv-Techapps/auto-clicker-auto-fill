import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Loading } from '../components';
import { firebaseLoginAPI, firebaseSelector, switchFirebaseLoginModal } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { themeSelector } from '../store/theme.slice';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(themeSelector);
  const { t } = useTranslation();
  const { visible, isLoading } = useAppSelector(firebaseSelector);

  const handleClose = () => {
    dispatch(switchFirebaseLoginModal());
  };

  return (
    <Modal show={visible} onHide={handleClose} data-testid='login-modal' centered>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>{t('loginModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
          {isLoading && <Loading message={t('loginModal.signingIn')} />}
          <Button variant='link' onClick={() => dispatch(firebaseLoginAPI())} disabled={isLoading} data-testid='google-sign-in'>
            <img src={theme === 'light' ? './assets/btn_google_signin_light_normal_web.png' : './assets/btn_google_signin_dark_normal_web.png'} alt='Logo' />
          </Button>
        </Modal.Body>
      </Form>
    </Modal>
  );
};
export { LoginModal };
