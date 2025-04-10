/* eslint-disable @typescript-eslint/no-namespace */
import { Button, Form, Modal } from 'react-bootstrap';
import GoogleSignInDark from '../assets/btn_google_signin_dark_normal_web.png';
import GoogleSignInLight from '../assets/btn_google_signin_light_normal_web.png';
import { Loading } from '../components';
import { firebaseLoginAPI, firebaseSelector, switchFirebaseLoginModal } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { themeSelector } from '../store/theme.slice';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(themeSelector);
  const { visible, isLoading } = useAppSelector(firebaseSelector);

  const handleClose = () => {
    dispatch(switchFirebaseLoginModal());
  };

  return (
    <Modal show={visible} onHide={handleClose} data-testid='login-modal' centered>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Please sign in</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
          {isLoading && <Loading message='Sign in...' />}
          <Button variant='link' onClick={() => dispatch(firebaseLoginAPI())} disabled={isLoading} data-testid='google-sign-in'>
            <img src={theme === 'light' ? GoogleSignInLight : GoogleSignInDark} alt='Logo' />
          </Button>
        </Modal.Body>
      </Form>
    </Modal>
  );
};
export { LoginModal };
