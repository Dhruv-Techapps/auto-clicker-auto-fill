import { firebaseSelector, switchFirebaseLoginModal } from '@acf-options-page/store/firebase';
import { googleHasAccessAPI, googleLoginAPI, googleSelector } from '@acf-options-page/store/google';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth/service';
import { useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

function SettingGoogleSheets() {
  const { t } = useTranslation();
  const { user } = useAppSelector(firebaseSelector);
  const { grantedScopes } = useAppSelector(googleSelector);
  const scope = GOOGLE_SCOPES.SHEETS;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI([scope]));
  };

  useEffect(() => {
    if (user) {
      if (!grantedScopes.includes(scope)) {
        dispatch(googleHasAccessAPI([scope]));
      }
    }
  }, [user, grantedScopes, scope, dispatch]);

  if (['DEV', 'BETA'].includes(import.meta.env.VITE_PUBLIC_VARIANT || '')) {
    return (
      <Alert>
        <Alert.Heading>{t('googleSheets.useStable.title')}</Alert.Heading>
        <Trans i18nKey='googleSheets.useStable.message' components={{ 1: <Alert.Link href='https://stable.getautoclicker.com' /> }}></Trans>
      </Alert>
    );
  }

  if (!user) {
    return <Trans i18nKey='googleSheets.loginRequired' components={{ 1: <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())} /> }}></Trans>;
  }

  if (!grantedScopes?.includes(scope)) {
    return (
      <Button variant='link' onClick={connect} data-testid='google-sheets-connect'>
        {t('googleSheets.connect')}
      </Button>
    );
  }

  return <div className='text-body-tertiary d-block mb-2'>{t('googleSheets.connected')}</div>;
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets';
export { SettingGoogleSheets };
