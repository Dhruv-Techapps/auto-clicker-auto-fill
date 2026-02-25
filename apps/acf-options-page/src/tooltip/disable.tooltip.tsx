import { IConfiguration } from '@dhruv-techapps/acf-common';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function DisableTooltip({ config }: { config: IConfiguration }) {
  const { t } = useTranslation();
  if (config.enable) {
    return null;
  }
  return (
    <OverlayTrigger overlay={<Tooltip>{t('automation.disabled')}</Tooltip>}>
      <i className='bi bi-slash-circle fs-6 opacity-50' />
    </OverlayTrigger>
  );
}
