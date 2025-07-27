import { DropdownToggle } from '@acf-options-page/components';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ActionOptionsDropdownProps {
  index: number;
  actionId: TRandomUUID;
  disabled?: boolean;
  removeActionConfirm: (actionId: TRandomUUID, index: number) => void;
  showAddon: (actionId: TRandomUUID) => void;
  showSettings: (actionId: TRandomUUID) => void;
  showCondition: (actionId: TRandomUUID) => void;
  onAddClick: (actionId: TRandomUUID, position: 1 | 0) => void;
  onDisableClick: (actionId: TRandomUUID, disabled?: boolean) => void;
}

export const ActionOptionsDropdown: React.FC<ActionOptionsDropdownProps> = (props) => {
  const { index, actionId, disabled, showAddon, showSettings, showCondition, onAddClick, onDisableClick } = props;
  const { t } = useTranslation();
  return (
    <Dropdown id='action-dropdown-wrapper' className='d-inline-block'>
      <Dropdown.Toggle as={DropdownToggle} id='action-dropdown' aria-label='Action more option'>
        <i className='bi bi-three-dots' />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-testid='action-addon' onClick={() => showAddon(actionId)}>
          {t('action.addon')}
        </Dropdown.Item>
        <Dropdown.Item data-testid='action-settings' onClick={() => showSettings(actionId)}>
          {t('action.settings')}
        </Dropdown.Item>
        {index !== 0 && (
          <Dropdown.Item data-testid='action-statement' onClick={() => showCondition(actionId)}>
            {t('modal.actionCondition.title')}
          </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(actionId, 0)}>
          <i className='bi bi-plus-lg me-2' /> {t('action.addBefore')}
        </Dropdown.Item>
        <Dropdown.Item data-testid='action-add' onClick={() => onAddClick(actionId, 1)}>
          <i className='bi bi-plus-lg me-2' /> {t('action.addAfter')}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item data-testid='action-disable' onClick={() => onDisableClick(actionId, disabled)}>
          {t(`action.${disabled ? 'enable' : 'disable'}`)}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
