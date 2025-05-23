import { Nav, NavDropdown } from 'react-bootstrap';
import { firebaseLogoutAPI, firebaseSelector, switchFirebaseLoginModal } from '../store/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { switchSubscribeModal } from '../store/subscribe';

export const HeaderGoogle = () => {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector(firebaseSelector);

  /*
  const onPortalLink = async () => {
    dispatch(switchIsPortalLinkLoading());
    dispatch(addToast({ header: 'Loading Manage Subscription', variant: 'primary' }));
    const token = await GoogleOauthService.getAuthToken([GOOGLE_SCOPES.PROFILE, GOOGLE_SCOPES.EMAIL]);

    if (!token) {
      return;
    }
    const credential = GoogleAuthProvider.credential(null, token);
    if (credential) {
      await signInWithCredential(getAuth(firebase), credential);
    }

    const functions = getFunctions(firebase, 'us-central1');
    const httpsCallableFunc = httpsCallable<unknown, { url: string }>(functions, 'ext-firestore-stripe-payments-createPortalLink');
    const { data } = await httpsCallableFunc({ returnUrl: window.location.origin });
    if (data?.url) {
      window.location.href = data.url;
    } else {
      dispatch(switchIsPortalLinkLoading());
    }
  };
  */

  return (
    <div>
      {user ? (
        <NavDropdown title={user.displayName} id='subscription-nav-dropdown' align='end'>
          {!role && (
            <>
              <NavDropdown.Item title='subscribe' onClick={() => dispatch(switchSubscribeModal())}>
                Subscribe
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          <NavDropdown.Item title='logout' onClick={() => dispatch(firebaseLogoutAPI())}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      ) : (
        <Nav.Link title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
          Login
        </Nav.Link>
      )}
    </div>
  );
};
