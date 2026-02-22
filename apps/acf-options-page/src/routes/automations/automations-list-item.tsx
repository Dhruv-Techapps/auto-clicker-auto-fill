import { IConfiguration } from '@dhruv-techapps/acf-common';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface AutomationListItemProps {
  config: IConfiguration;
}

const BatchOverlay = ({ config }: { config: IConfiguration }) => {
  const { t } = useTranslation();
  if (!config.batch || (!config.batch.refresh && config.batch.repeat === undefined)) {
    return null;
  }
  return (
    <OverlayTrigger
      overlay={
        <Tooltip>
          <small className='d-flex text-start'>
            {config.batch?.refresh ? (
              `${t('loop.refresh')}: ${config.batch.refresh} `
            ) : (
              <>
                {`${t('loop.repeat')}: ${config.batch?.repeat}`} <br /> {`${t('loop.repeatInterval')}: ${config.batch?.repeatInterval}`}{' '}
              </>
            )}
          </small>
        </Tooltip>
      }
    >
      <i className='bi bi-arrow-repeat fs-6 opacity-50' />
    </OverlayTrigger>
  );
};

const ScheduleOverlay = ({ config }: { config: IConfiguration }) => {
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
};

const WatchOverlay = ({ config }: { config: IConfiguration }) => {
  const { t } = useTranslation();
  if (!config.watch || !config.watch.watchEnabled) {
    return null;
  }
  return (
    <OverlayTrigger overlay={<Tooltip>{`${t('watch.attributes')}: ${config.watch.watchAttributes?.join(', ')} <br/> ${t('watch.interval')}} `}</Tooltip>}>
      <i className='bi bi-eye-fill fs-6 opacity-50' />
    </OverlayTrigger>
  );
};

export const AutomationsListItem = ({ config }: AutomationListItemProps) => {
  const { t } = useTranslation();
  return (
    <div className='d-flex text-body-emphasis justify-content-between'>
      <div>
        <strong>
          {!config.enable && <i className='bi bi-slash-circle fs-6' />} {config.name || config.id}
        </strong>
        <small className='d-block text-body-secondary'>{config.url}</small>
      </div>
      <div className='d-flex justify-content-end gap-3'>
        <BatchOverlay config={config} />
        <ScheduleOverlay config={config} />
        <WatchOverlay config={config} />
        <small className='opacity-50 text-nowrap'>
          {config.actions.length} {t('step.plural')}
        </small>
      </div>
    </div>
  );
};
