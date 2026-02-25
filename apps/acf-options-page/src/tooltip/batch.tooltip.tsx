import { IConfiguration } from '@dhruv-techapps/acf-common';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function BatchTooltip({ config }: { config: IConfiguration }) {
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
}
