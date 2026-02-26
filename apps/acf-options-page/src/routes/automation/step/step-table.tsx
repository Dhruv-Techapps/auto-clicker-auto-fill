import { useAutomationId } from '@acf-options-page/_hooks';
import { actionSelector, addAction, updateAction } from '@acf-options-page/store/config';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { IAction, isUserScript, IUserScript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, Row as ReactTableRow, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ElementFinderPopover, ValuePopover } from '../../../popover';
import { REGEX } from '../../../util';
import { defaultColumn } from './editable-cell';
import { StepRow } from './step-row';
import './step-table.scss';
import { UserScriptRow } from './userscript-row';

interface IStepTableMeta {
  dataType?: string;
  list?: string;
  pattern?: string;
  required?: boolean;
  width?: string;
}

interface IStepTableProps {
  actions: Array<IAction | IUserScript>;
  expand: boolean;
}

const StepTable = ({ actions, expand }: IStepTableProps) => {
  const { t } = useTranslation();
  const configId = useAutomationId();
  const { columnVisibility } = useAppSelector(actionSelector);
  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<IAction | IUserScript, IStepTableMeta>[]>(
    () => [
      {
        header: t('step.initWait'),
        accessorKey: 'initWait',
        meta: {
          width: '70',
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL.source
        }
      },
      {
        header: t('step.name'),
        accessorKey: 'name',
        meta: {
          width: '100'
        }
      },
      {
        header: () => (
          <>
            {t('step.elementFinder')} <small className='text-danger'>*</small> <ElementFinderPopover />
          </>
        ),
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
        accessorKey: 'value',
        meta: {
          list: 'value'
        }
      },
      {
        header: t('step.repeat'),
        accessorKey: 'repeat',
        meta: {
          width: '70',
          dataType: 'number',
          list: 'repeat',
          type: 'number',
          pattern: REGEX.NUMBER.source
        }
      },
      {
        header: t('step.repeatInterval'),
        accessorKey: 'repeatInterval',
        meta: {
          width: '70',
          dataType: 'number',
          list: 'interval',
          pattern: REGEX.INTERVAL.source
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
    <Container fluid={expand} className='pt-2 overflow-auto flex-grow-1'>
      <Row>
        <Col className='p-0'>
          <Form>
            <Table id='steps' hover className='mb-0'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    <th data-column='number'>#</th>
                    {headerGroup.headers.map((header) => (
                      <th data-column={header.id} key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                    <th data-column='menu'></th>
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => {
                  if (isUserScript(row.original)) {
                    return (
                      <UserScriptRow
                        key={row.id}
                        row={row as ReactTableRow<IUserScript>}
                        index={index}
                        actions={actions}
                        onAddClick={onAddClick}
                        onDisableClick={onDisableClick}
                        flexRender={flexRender}
                      />
                    );
                  }
                  return <StepRow key={row.id} row={row as ReactTableRow<IAction>} index={index} actions={actions} onAddClick={onAddClick} onDisableClick={onDisableClick} flexRender={flexRender} />;
                })}
              </tbody>
            </Table>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default StepTable;
