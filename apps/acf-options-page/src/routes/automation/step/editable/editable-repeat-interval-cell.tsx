import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { ColumnDef } from '@tanstack/react-table';
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IStepTableMeta } from './meta';

interface CellProps {
  getValue: () => any;
  row: { original: IAction | IUserScript };
  column: { id: string; columnDef: ColumnDef<IAction | IUserScript, IStepTableMeta> };
  table: any;
}

const toNumber = (v: string): number | string => {
  const n = parseFloat(v);
  return isNaN(n) ? v : n;
};

export function RepeatIntervalCell({ getValue, row: { original }, column: { id }, table }: CellProps) {
  const intervalValue = getValue();
  const intervalToValue = (original as IAction).repeatIntervalTo;

  const [from, setFrom] = useState<string>(intervalValue !== undefined ? String(intervalValue) : '');
  const [to, setTo] = useState<string>(intervalToValue !== undefined ? String(intervalToValue) : '');
  const [rangeMode, setRangeMode] = useState(intervalToValue !== undefined);
  const { t } = useTranslation();

  useEffect(() => {
    setFrom(intervalValue ?? '');
  }, [intervalValue]);

  useEffect(() => {
    setTo(intervalToValue !== undefined ? String(intervalToValue) : '');
    setRangeMode(intervalToValue !== undefined);
  }, [intervalToValue]);

  const isFromInvalid = rangeMode && from !== '' && to !== '' && Number(from) > Number(to);
  const isToInvalid = rangeMode && from !== '' && to !== '' && Number(to) < Number(from);

  const commitFrom = (value: string) => {
    const converted = value === '' ? undefined : toNumber(value);
    table.options.meta?.updateData(original.id, id, converted);
  };

  const commitTo = (value: string) => {
    const converted = value === '' ? undefined : toNumber(value);
    table.options.meta?.updateData(original.id, 'repeatIntervalTo', converted);
  };

  const onFromChange = (e: ChangeEvent<HTMLInputElement>) => setFrom(e.currentTarget.value);
  const onFromBlur = (e: FocusEvent<HTMLInputElement>) => commitFrom(e.currentTarget.value);

  const onToChange = (e: ChangeEvent<HTMLInputElement>) => setTo(e.currentTarget.value);
  const onToBlur = (e: FocusEvent<HTMLInputElement>) => commitTo(e.currentTarget.value);

  const onToggleRange = () => {
    const next = !rangeMode;
    setRangeMode(next);
    if (!next) {
      setTo('');
      table.options.meta?.updateData(original.id, 'repeatIntervalTo', undefined);
    } else if (to === '') {
      const seedValue = from !== '' ? from : '';
      setTo(seedValue);
    }
  };

  return (
    <InputGroup size='sm'>
      <Button variant={rangeMode ? 'secondary' : ''} className='border' size='sm' onClick={onToggleRange} title={t('retry.range-tooltip')} tabIndex={-1}>
        <i className='bi bi-arrows-expand-vertical' />
      </Button>
      <Form.Control
        type='number'
        min={0}
        step='0.001'
        value={from}
        name={id}
        size='sm'
        onChange={onFromChange}
        onBlur={onFromBlur}
        list='interval'
        onInput={(e: any) => e.target.validity.valid || (e.target.value = '')}
        isInvalid={isFromInvalid}
        autoComplete='off'
      />
      {rangeMode && (
        <>
          <InputGroup.Text className='px-1'>{t('retry.to')}</InputGroup.Text>
          <Form.Control
            type='number'
            min={0}
            step='0.001'
            value={to}
            name='repeatIntervalTo'
            size='sm'
            onChange={onToChange}
            onBlur={onToBlur}
            list='interval'
            onInput={(e: any) => e.target.validity.valid || (e.target.value = '')}
            isInvalid={isToInvalid}
            autoComplete='off'
          />
        </>
      )}
    </InputGroup>
  );
}
