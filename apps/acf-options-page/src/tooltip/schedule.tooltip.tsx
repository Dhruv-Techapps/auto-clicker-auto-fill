import { IConfiguration } from '@dhruv-techapps/acf-common';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function ScheduleTooltip({ config }: { config: IConfiguration }) {
  const { t } = useTranslation();
  if (!config.schedule || !config.schedule.date) {
    return null;
  }
  return (
    <OverlayTrigger
      overlay={
        <Tooltip>
          <small className='d-flex text-start'>
            {t('schedule.date')}: {config.schedule.date} <br />
            {t('schedule.time')}: {config.schedule.time} <br />
            {t('schedule.repeat')}: {config.schedule.repeat}
          </small>
        </Tooltip>
      }
    >
      <i className='bi bi-stopwatch-fill fs-6 opacity-50' />
    </OverlayTrigger>
  );
}
