import { EActionConditionOperator, EActionStatus, IAction, IActionCondition, IActionStatement, IUserScript } from '@dhruv-techapps/acf-common';
import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { FieldArrayWithId } from 'react-hook-form';

interface IActionStatementConditionProps {
  readonly field: FieldArrayWithId<IActionStatement, 'conditions', 'id'>;
  readonly index: number;
  readonly update: (index: number, value: IActionCondition) => void;
  readonly remove: (index: number) => void;
  readonly actions: Array<IAction | IUserScript>;
}

function StepConditionCondition({ field, index, update, remove, actions }: IActionStatementConditionProps) {
  const { actionId, actionIndex, status, operator = EActionConditionOperator.AND } = field;

  const changeOpr = (_operator: EActionConditionOperator) => {
    update(index, { ...field, operator: _operator });
  };

  const onUpdateActionId = (e: ChangeEvent<HTMLSelectElement>) => {
    update(index, { ...field, actionId: e.currentTarget.value as IActionCondition['actionId'] });
  };

  const onUpdateStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    update(index, { ...field, status: e.currentTarget.value as EActionStatus });
  };

  return (
    <tr className={actionIndex !== undefined && actionId === undefined ? 'table-danger' : ''}>
      <td className='fw-bold'>
        {index !== 0 && (
          <ButtonGroup>
            <Button type='button' variant='outline-primary' className={operator === EActionConditionOperator.OR ? 'active' : ''} onClick={() => changeOpr(EActionConditionOperator.OR)}>
              OR
            </Button>
            <Button type='button' variant='outline-primary' className={operator === EActionConditionOperator.AND ? 'active' : ''} onClick={() => changeOpr(EActionConditionOperator.AND)}>
              AND
            </Button>
          </ButtonGroup>
        )}
      </td>
      <td>
        <Form.Select value={actionId} onChange={onUpdateActionId} name='actionId' required className='flex-grow-1 me-1'>
          {actions.map((_action, i) => (
            <option key={_action.id} value={_action.id}>
              {i + 1} . {_action.name || 'Action or Userscript'}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Select value={status} onChange={onUpdateStatus} name='status' required style={{ flexShrink: 2 }}>
          {Object.entries(EActionStatus).map((_status) => (
            <option key={_status[1]} value={_status[1]}>
              {_status[0]}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Button type='button' variant='link' className='ms-1 mt-2 p-0 text-danger' aria-label='Close' hidden={index === 0} onClick={() => remove(index)}>
          <i className='bi bi-x' />
        </Button>
      </td>
    </tr>
  );
}

export { StepConditionCondition };
