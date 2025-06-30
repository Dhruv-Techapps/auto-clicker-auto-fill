import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth';
import { useEffect } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { firebaseSelector, switchFirebaseLoginModal } from '../../store/firebase';
import { googleHasAccessAPI, googleLoginAPI, googleLogoutAPI, googleSelector } from '../../store/google';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

function SettingGoogleSheets() {
  const { user } = useAppSelector(firebaseSelector);
  const { grantedScopes } = useAppSelector(googleSelector);
  const scope = GOOGLE_SCOPES.SHEETS;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI([scope]));
  };

  const disconnect = async () => {
    dispatch(googleLogoutAPI([scope]));
  };

  useEffect(() => {
    if (user) {
      if (!grantedScopes.includes(scope)) {
        dispatch(googleHasAccessAPI([scope]));
      }
    }
  }, [user, grantedScopes, scope, dispatch]);

  if (['DEV', 'BETA'].includes(import.meta.env.VITE_PUBLIC_VARIANT ?? '')) {
    return (
      <div className='d-flex flex-column align-items-start'>
        <Alert>
          <Alert.Heading>Use Stable Versions for Google Sheets Features.</Alert.Heading>
          For optimal performance and reliability in Google Sheets, it's recommended to utilize <Alert.Link href={`https://stable.getautoclicker.com`}>stable</Alert.Link> versions of its features.
          These versions undergo thorough testing to ensure seamless functionality, providing you with a dependable platform for your tasks. By prioritizing stability, you can enhance your
          productivity and minimize the risk of encountering unexpected issues. If you need assistance or guidance on leveraging Google Sheets effectively, feel free to reach out for support!.
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <p>
        Please
        <button className='btn' variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
          Login
        </button>
        to your account before connecting with Google Sheets.
      </p>
    );
  }

  if (!grantedScopes?.includes(scope)) {
    return (
      <button className='btn' variant='link' onClick={connect} data-testid='google-sheets-connect'>
        Connect with Google Sheets
      </button>
    );
  }

  return (
    <>
      <Badge bg='success' pill className='p-2 px-3'>
        Connected
      </Badge>
      <button className='btn' variant='link' onClick={disconnect} data-testid='google-sheets-connect'>
        Disconnect with Google Sheets
      </button>
    </>
  );
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets';
export { SettingGoogleSheets };
