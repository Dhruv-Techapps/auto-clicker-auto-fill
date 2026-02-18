import { useTimeout } from '@acf-options-page/_hooks/message.hooks';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { setSettingsMessage, settingsSelector } from '@acf-options-page/store/settings/settings.slice';
import { Modal } from 'react-bootstrap';

export interface SettingMessageRef {
  showMessage: (message: string) => void;
}

const SettingMessage = () => {
  const { message } = useAppSelector(settingsSelector);
  const dispatch = useAppDispatch();

  useTimeout(() => {
    dispatch(setSettingsMessage());
  }, message);

  if (!message) {
    return null;
  }

  return (
    <Modal.Footer data-testid='settings-message'>
      <span className='text-success'>{message}</span>
    </Modal.Footer>
  );
};

SettingMessage.displayName = 'SettingMessage';
export { SettingMessage };
