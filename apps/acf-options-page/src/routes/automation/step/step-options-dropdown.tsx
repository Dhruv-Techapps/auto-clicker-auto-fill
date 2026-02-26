import { DropdownToggle } from '@acf-options-page/components';
import { ROUTES } from '@acf-options-page/util';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface StepOptionsDropdownProps {
  index: number;
  actions: Array<IAction | IUserScript>;
  actionId: TRandomUUID;
  disabled?: boolean;
  removeActionConfirm: (actionId: TRandomUUID, index: number) => void;
  onAddClick: (actionId: TRandomUUID, position: 1 | 0) => void;
  onDisableClick: (actionId: TRandomUUID, disabled?: boolean) => void;
}

export const StepOptionsDropdown: React.FC<StepOptionsDropdownProps> = (props) => {
  const { index, actionId, disabled, actions, onAddClick, onDisableClick, removeActionConfirm } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Dropdown id='action-dropdown-wrapper' className='d-inline-block'>
      <Dropdown.Toggle as={DropdownToggle} id='action-dropdown' aria-label='Action more option' className='btn-sm'>
        <i className='bi bi-three-dots' />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(actionId, 0)}>
          <i className='bi bi-plus-lg me-2' /> {t('step.addBefore')}
        </Dropdown.Item>
        <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(actionId, 1)}>
          <i className='bi bi-plus-lg me-2' /> {t('step.addAfter')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item data-testid='action-addon' onClick={() => navigate(ROUTES.PAGE_GUARD(actionId))}>
          <i className='bi bi-shield-check me-2' /> {t('pageGuard.title')}
        </Dropdown.Item>
        {index !== 0 && (
          <Dropdown.Item data-testid='action-statement' onClick={() => navigate(ROUTES.STATE_GUARD(actionId))}>
            <i className='bi bi-sliders me-2' /> {t('stateGuard.title')}
          </Dropdown.Item>
        )}
        <Dropdown.Item data-testid='action-settings' onClick={() => navigate(ROUTES.STEP_SETTINGS(actionId))}>
          <i className='bi bi-gear me-2' /> {t('stepSettings.title')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item data-testid='action-disable' onClick={() => onDisableClick(actionId, disabled)}>
          <i className={`bi bi-toggle-${disabled ? 'off' : 'on'} me-2`} /> {t(`step.${disabled ? 'enable' : 'disable'}`)}
        </Dropdown.Item>
        <Dropdown.Item data-testid='action-remove' onClick={() => removeActionConfirm(actionId, index)} disabled={actions.length === 1}>
          <i className={`bi bi-trash me-2`} /> {t(`step.remove`)}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
