import { useAutomationId } from '@acf-options-page/_hooks';
import { useConfirmationModalContext } from '@acf-options-page/_providers/confirm.provider';
import { removeAction } from '@acf-options-page/store/config';
import { useAppDispatch } from '@acf-options-page/store/hooks';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { StepOptionsDropdown } from './step-options-dropdown';

interface UserScriptRowProps {
  row: Row<IUserScript>;
  index: number;
  actions: Array<IAction | IUserScript>;
  onAddClick: (actionId: TRandomUUID, position: 1 | 0) => void;
  onDisableClick: (actionId: TRandomUUID, disabled?: boolean) => void;
  flexRender: (cell: any, context: any) => React.ReactNode;
}

export const UserScriptRow: React.FC<UserScriptRowProps> = (props) => {
  const configId = useAutomationId();
  const { row, index, actions, onDisableClick, onAddClick, flexRender } = props;
  const modalContext = useConfirmationModalContext();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const removeActionConfirm = async (actionId: TRandomUUID, index: number) => {
    const name = `#${index + 1} Userscript`;
    const result = await modalContext.showConfirmation({
      title: t('userscript.confirm.remove.title'),
      message: t('userscript.confirm.remove.message', { name }),
      headerClass: 'text-danger'
    });
    result && dispatch(removeAction({ actionId, configId }));
  };

  const getValueCell = (row: Row<IUserScript>) => {
    const cell = row.getVisibleCells().find((cell) => cell.column.id === 'value');
    return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null;
  };

  return (
    <tr key={row.id} className={row.original.disabled ? 'table-secondary' : ''}>
      <td className='align-middle text-body-tertiary'>{index + 1}</td>
      <td className='align-middle' colSpan={row.getVisibleCells().length}>
        {getValueCell(row)}
      </td>
      <td align='center'>
        {row.original.value && (
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
