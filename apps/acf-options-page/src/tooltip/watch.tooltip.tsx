import { IConfiguration } from '@dhruv-techapps/acf-common';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function WatchTooltip({ config }: { config: IConfiguration }) {
  const { t } = useTranslation();
  if (!config.watch?.watchEnabled) {
    return null;
  }
  return (
    <OverlayTrigger overlay={<Tooltip>{`${t('watch.attributes')}: ${config.watch.watchAttributes?.join(', ')} <br/> ${t('watch.interval')}} `}</Tooltip>}>
      <i className='bi bi-eye-fill fs-6 opacity-50' />
    </OverlayTrigger>
  );
}
