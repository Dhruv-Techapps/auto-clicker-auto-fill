import { EActionConditionOperator, EActionStatus, IActionCondition } from '@dhruv-techapps/acf-common';
import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { removeActionStatementCondition, selectedConfigSelector, updateActionStatementCondition } from '../../store/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getFieldNameValue } from '../../util/element';

interface IActionStatementConditionProps {
  readonly condition: IActionCondition;
  readonly index: number;
}

function ActionStatementCondition({ condition, index }: IActionStatementConditionProps) {
  const { actionId, actionIndex, status, operator = EActionConditionOperator.AND } = condition;
  const config = useAppSelector(selectedConfigSelector);

  const dispatch = useAppDispatch();

  const changeOpr = (_operator: EActionConditionOperator) => {
    dispatch(updateActionStatementCondition({ name: 'operator', value: _operator, id: condition.id }));
  };

  const removeCondition = () => {
    dispatch(removeActionStatementCondition(condition.id));
  };

  const onUpdate = (e: ChangeEvent<HTMLSelectElement>) => {
    const update = getFieldNameValue(e);
    if (update) {
      dispatch(updateActionStatementCondition({ ...update, id: condition.id }));
    }
  };

  if (!config) {
    return null;
  }

  const { actions } = config;

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
        <Form.Select value={actionId} onChange={onUpdate} name='actionId' required className='flex-grow-1 me-1'>
          {actions.map((_action, index) => (
            <option key={_action.id} value={_action.id}>
              {index + 1} . {_action.name || _action.elementFinder}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Select value={status} onChange={onUpdate} name='status' required style={{ flexShrink: 2 }}>
          {Object.entries(EActionStatus).map((_status) => (
            <option key={_status[1]} value={_status[1]}>
              {_status[0]}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Button type='button' variant='link' className='ms-1 mt-2 p-0 text-danger' aria-label='Close' hidden={index === 0} onClick={removeCondition}>
          <i className='bi bi-x' />
        </Button>
      </td>
    </tr>
  );
}

export { ActionStatementCondition };
