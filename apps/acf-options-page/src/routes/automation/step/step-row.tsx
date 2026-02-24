import { useAutomationId } from '@acf-options-page/_hooks/useAutomationId';
import { useConfirmationModalContext } from '@acf-options-page/_providers/confirm.provider';
import { removeAction } from '@acf-options-page/store/config';
import { useAppDispatch } from '@acf-options-page/store/hooks';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { StepOptionsDropdown } from './step-options-dropdown';

interface StepRowProps {
  row: Row<IAction>;
  index: number;
  actions: Array<IAction | IUserScript>;

  onAddClick: (actionId: TRandomUUID, position: 1 | 0) => void;
  onDisableClick: (actionId: TRandomUUID, disabled?: boolean) => void;
  flexRender: (cell: any, context: any) => React.ReactNode;
}

export const StepRow: React.FC<StepRowProps> = (props) => {
  const automationId = useAutomationId();
  const { row, index, actions, onAddClick, onDisableClick, flexRender } = props;
  const modalContext = useConfirmationModalContext();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const removeActionConfirm = async (actionId: TRandomUUID, index: number) => {
    const action = actions.find((action) => action.id === actionId) as IAction;
    if (!action) {
      return;
    }

    if (Object.keys(action).length === 3 && action.elementFinder === '') {
      dispatch(removeAction({ actionId, configId: automationId }));
      return;
    }

    const name = action.name || `#${index + 1}`;
    const result = await modalContext.showConfirmation({
      title: t('step.confirm.remove.title'),
      message: t('step.confirm.remove.message', { name }),
      headerClass: 'text-danger'
    });
    result && dispatch(removeAction({ actionId, configId: automationId }));
  };
  return (
    <tr key={row.id} className={row.original.disabled ? 'table-secondary' : ''}>
      <td className='align-middle'>{index + 1}</td>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
      <td align='center'>
        {row.original.elementFinder && (
          <StepOptionsDropdown
            index={index}
            actions={actions}
            actionId={row.original.id}
            disabled={row.original.disabled}
            removeActionConfirm={removeActionConfirm}
            onAddClick={onAddClick}
            onDisableClick={onDisableClick}
          />
        )}
      </td>
    </tr>
  );
};
