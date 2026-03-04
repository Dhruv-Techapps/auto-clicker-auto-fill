import { getFieldNameValue } from '@acf-options-page/util/element';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { ColumnDef } from '@tanstack/react-table';
import { ChangeEvent, useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { IStepTableMeta } from './meta';

interface CellProps {
  getValue: () => any;
  row: { original: IAction | IUserScript };
  column: { id: string; columnDef: ColumnDef<IAction | IUserScript, IStepTableMeta> };
  table: any;
}

export function RepeatCell({ getValue, row: { original }, column: { id }, table }: CellProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState<boolean | undefined>(false);

  const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, { [id]: initialValue });
    if (update) {
      table.options.meta?.updateData(original.id, update.name, update.value);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      currentTarget: { value: changeValue }
    } = e;
    setValue(changeValue);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setIsInvalid(original.error?.includes(id));
    setValue(initialValue);
  }, [initialValue, id, original.error]);

  return (
    <InputGroup>
      <Form.Control
        type='number'
        min={0}
        value={value || ''}
        name={id}
        size='sm'
        disabled={value === 'unlimited'}
        onChange={onChange}
        onBlur={onBlur}
        list='repeat'
        isInvalid={isInvalid}
        autoComplete='off'
      />
    </InputGroup>
  );
}
