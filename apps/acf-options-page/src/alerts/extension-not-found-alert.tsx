import { appSelector } from '@acf-options-page/store';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { CHROME_WEB_STORE } from '@acf-options-page/util/constants';
import { Alert } from 'react-bootstrap';

export const ExtensionNotFoundAlert = () => {
  const { error, errorButton } = useAppSelector(appSelector);

  if (!error) return null;

  return (
    <Alert variant='danger' className='mb-0 text-center p-1 rounded-0'>
      <p className='m-0'>
        {error}
        {errorButton && (
          <Alert.Link href={`${CHROME_WEB_STORE}${import.meta.env.VITE_PUBLIC_CHROME_EXTENSION_ID}`} target='_blank' className='ms-2'>
            download
          </Alert.Link>
        )}
      </p>
    </Alert>
  );
};
