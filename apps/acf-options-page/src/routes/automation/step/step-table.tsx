import { useAutomationId } from '@acf-options-page/_hooks';
import { actionSelector, addAction, setColumnVisibility, updateAction } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { IAction, isUserScript, IUserScript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, Row, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Dropdown, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { DropdownToggle } from '../../../components';
import { ElementFinderPopover, ValuePopover } from '../../../popover';
import { REGEX } from '../../../util';
import { defaultColumn } from './editable-cell';
import { StepRow } from './step-row';
import { UserScriptRow } from './userscript-row';

interface StepTableMeta {
  dataType: string;
  list: string;
  pattern: string;
  required: boolean;
  width?: string;
}

interface StepTableProps {
  actions: Array<IAction | IUserScript>;
}

const StepTable = ({ actions }: StepTableProps) => {
  const { t } = useTranslation();
  const configId = useAutomationId();
  const { columnVisibility } = useAppSelector(actionSelector);
  const dispatch = useAppDispatch();

  const onColumnChange = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>) => {
    const column = e.currentTarget.getAttribute('data-column');
    if (!column) {
      return;
    }
    dispatch(setColumnVisibility(column));
  };

  const columns = useMemo<ColumnDef<IAction | IUserScript, StepTableMeta>[]>(
    () => [
      {
        header: t('step.initWait'),
        accessorKey: 'initWait',
        size: 70,
        maxSize: 70,
        meta: {
          width: '100px',
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL
        }
      },
      {
        header: t('step.name'),
        minSize: 100,
        size: 150,
        maxSize: 200,
        accessorKey: 'name'
      },
      {
        header: () => (
          <>
            {t('step.elementFinder')} <small className='text-danger'>*</small> <ElementFinderPopover />
          </>
        ),
        minSize: 400,
        maxSize: 1000,
        accessorKey: 'elementFinder',
        meta: {
          list: 'elementFinder',
          required: true
        }
      },
      {
        header: () => (
          <>
            {t('step.value')} <ValuePopover />
          </>
        ),
        minSize: 400,
        maxSize: 1000,
        accessorKey: 'value',
        meta: {
          list: 'value'
        }
      },
      {
        header: t('step.repeat'),
        accessorKey: 'repeat',
        size: 70,
        meta: {
          dataType: 'number',
          list: 'repeat',
          type: 'number',
          pattern: REGEX.NUMBER
        }
      },
      {
        header: t('step.repeatInterval'),
        accessorKey: 'repeatInterval',
        size: 80,
        meta: {
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL
        }
      }
    ],
    [t]
  );

  const table = useReactTable<IAction | IUserScript>({
    columns: columns,
    data: actions,
    defaultColumn,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData: (actionId: TRandomUUID, columnId: string, value: any) => {
        dispatch(updateAction({ actionId, name: columnId, value, configId }));
      },
      updateValueFieldTypes: (actionId: TRandomUUID, valueFieldType: 'input' | 'textarea' | 'script') => {
        dispatch(updateAction({ actionId, name: 'valueFieldType', value: valueFieldType, configId }));
      }
    }
  });

  const onDisableClick = (actionId: TRandomUUID, disabled?: boolean) => {
    dispatch(updateAction({ actionId, name: 'disabled', value: !disabled, configId }));
  };

  const onAddClick = (actionId: TRandomUUID, position: 1 | 0) => {
    dispatch(addAction({ actionId, position, configId }));
  };

  return (
    <Form>
      <Table id='actions' hover className='mb-0'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {/*<th style={{ width: '30px' }}>&nbsp;</th>*/}
              <th style={{ width: '22px' }}>#</th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th style={{ width: '92px', textAlign: 'center' }}>
                <Dropdown className='ml-2' id='acton-column-filter-wrapper'>
                  <Dropdown.Toggle as={DropdownToggle} id='acton-column-filter' className='p-0' aria-label='Toggle Action Column'>
                    <i className='bi bi-eye-slash-fill fs-4' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={onColumnChange} data-column='name' active={columnVisibility.name}>
                      {t('step.name')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={columnVisibility.initWait}>
                      {t('step.initWait')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={columnVisibility.repeat}>
                      {t('step.repeat')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={columnVisibility.repeatInterval}>
                      {t('step.repeatInterval')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            if (isUserScript(row.original)) {
              return <UserScriptRow key={row.id} row={row as Row<IUserScript>} index={index} actions={actions} onAddClick={onAddClick} onDisableClick={onDisableClick} flexRender={flexRender} />;
            }
            return <StepRow key={row.id} row={row as Row<IAction>} index={index} actions={actions} onAddClick={onAddClick} onDisableClick={onDisableClick} flexRender={flexRender} />;
          })}
        </tbody>
      </Table>
    </Form>
  );
};

export default StepTable;
