import { BatchTooltip, DisableTooltip, ScheduleTooltip, WatchTooltip } from '@acf-options-page/tooltip';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { useTranslation } from 'react-i18next';

interface AutomationListItemProps {
  config: IConfiguration;
}

export const AutomationsListItem = ({ config }: AutomationListItemProps) => {
  const { t } = useTranslation();
  return (
    <div className='d-flex text-body-emphasis justify-content-between'>
      <div>
        <strong>
          <DisableTooltip config={config} /> {config.name || config.id}
        </strong>
        <small className='d-block text-body-secondary'>{config.url}</small>
      </div>
      <div className='d-flex justify-content-end gap-3'>
        <BatchTooltip config={config} />
        <ScheduleTooltip config={config} />
        <WatchTooltip config={config} />
        <small className='opacity-50 text-nowrap'>
          {config.actions.length} {t('step.plural')}
        </small>
      </div>
    </div>
  );
};
