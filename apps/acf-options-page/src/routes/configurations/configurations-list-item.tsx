import { IConfiguration } from '@dhruv-techapps/acf-common';

interface ConfigurationsListItemProps {
  config: IConfiguration;
}

export const ConfigurationsListItem = ({ config }: ConfigurationsListItemProps) => {
  return (
    <div className='d-flex text-body-emphasis justify-content-between'>
      <div>
        <strong>
          {!config.enable && <i className='bi bi-slash-circle fs-6' />} {config.name || config.id}
        </strong>
        <small className='d-block text-body-secondary'>{config.url}</small>
      </div>
      <small className='opacity-50 text-nowrap'>{config.actions.length} actions</small>
    </div>
  );
};
