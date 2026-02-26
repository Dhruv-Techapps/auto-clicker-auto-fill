import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

export function HotkeyPopover() {
  const { t } = useTranslation();
  return (
    <OverlayTrigger
      trigger='click'
      placement='left'
      rootClose
      overlay={
        <Popover id='popover-basic'>
          <Popover.Header>{t('popover.hotkey.title')}</Popover.Header>
          <Popover.Body>
            <p>{t('popover.hotkey.content')}</p>
            <ul>
              <li>Ctrl + A</li>
              <li>Ctrl + Shift + A</li>
              <li>Alt + A</li>
              <li>Alt + Shift + A</li>
              <li>Ctrl + Alt + Shift + A</li>
            </ul>
            <span className='text-danger'>
              <Trans i18nKey='popover.hotkey.hint' components={{ kbd: <kbd /> }}>
                Single letter without <kbd>Ctrl</kbd>, <kbd>Alt</kbd> or <kbd>Shift</kbd> is not valid
              </Trans>
            </span>
          </Popover.Body>
        </Popover>
      }
    >
      <i className='bi bi-info-circle ms-2 text-muted' />
    </OverlayTrigger>
  );
}
