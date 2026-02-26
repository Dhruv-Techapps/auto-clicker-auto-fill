import { ThemeContext } from '@acf-options-page/context';
import { ValueFieldTypeTooltip } from '@acf-options-page/tooltip';
import { getFieldNameValue } from '@acf-options-page/util/element';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import Editor from '@monaco-editor/react';
import { ColumnDef } from '@tanstack/react-table';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

interface IMetaProps {
  ariaLabel?: string;
  type?: string;
  as?: 'input' | 'text' | 'textarea';
  pattern?: string;
  required?: boolean;
  list?: string;
}

export const defaultColumn: Partial<ColumnDef<IAction | IUserScript, IMetaProps>> = {
  cell: Cell
};

interface InputProps {
  rows?: number;
  placeholder?: string;
}

interface CellProps {
  getValue: () => any;
  row: { original: IAction | IUserScript };
  column: { id: string; columnDef: ColumnDef<IAction | IUserScript, IMetaProps> };
  table: any;
}

function Cell({ getValue, row: { original }, column: { id, columnDef }, table }: CellProps) {
  const { theme } = useContext(ThemeContext);
  const { meta } = columnDef as { meta?: IMetaProps };
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState<boolean | undefined>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueFieldType, setValueFieldType] = useState<'input' | 'text' | 'textarea' | 'script'>(original.valueFieldType || 'input');

  useEffect(() => {
    setValueFieldType(original.valueFieldType || 'input');
  }, [original.valueFieldType]);

  const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const update = getFieldNameValue(e, { [id]: initialValue });
    if (update) {
      table.options.meta?.updateData(original.id, update.name, update.value);
    }
  };

  const onEditorChange = (value: string | undefined) => {
    const update = { name: id, value };
    if (update) {
      table.options.meta?.updateData(original.id, update.name, update.value);
    }
  };

  const resize = () => {
    const el = inputRef.current;
    if (el && el instanceof HTMLTextAreaElement) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (valueFieldType === 'textarea') {
      const debounceResize = () => {
        const timeout = setTimeout(() => resize(), 100);
        return () => clearTimeout(timeout);
      };
      debounceResize();
    }
  }, [value, valueFieldType]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      currentTarget: { value: changeValue }
    } = e;
    setIsInvalid(false);
    setValue(changeValue);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setIsInvalid(original.error?.includes(id));
    setValue(initialValue);
  }, [initialValue, id, original.error]);

  const getInput = (as: 'input' | 'text' | 'textarea' | undefined, rest: InputProps = {}) => (
    <Form.Control
      ref={inputRef}
      aria-label={meta?.ariaLabel}
      type={meta?.type}
      value={value || ''}
      name={id}
      as={as}
      size='sm'
      {...(as === 'textarea' && { rows: 1 })}
      {...rest}
      onChange={onChange}
      onBlur={onBlur}
      pattern={meta?.pattern}
      required={meta?.required}
      list={meta?.list}
      isInvalid={isInvalid}
      autoComplete='off'
    />
  );

  const onValueFieldTypeChange = () => {
    const newFieldType = valueFieldType === 'input' ? 'textarea' : 'input';
    setValueFieldType(newFieldType);
    table.options.meta?.updateValueFieldTypes(original.id, newFieldType);
  };

  const options = {
    minimap: {
      enabled: false
    },
    scrollbar: {
      alwaysConsumeMouseWheel: false
    },
    automaticLayout: true
  };

  if (id === 'value') {
    if (valueFieldType === 'script') {
      return (
        <Editor
          defaultLanguage='javascript'
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          height='100px'
          aria-label={meta?.ariaLabel}
          value={value || ''}
          onChange={onEditorChange}
          options={options}
        />
      );
    }
    return (
      <InputGroup>
        <ValueFieldTypeTooltip id={id} valueFieldType={valueFieldType}>
          <Button type='button' variant='outline-secondary' id='action-field-type' onClick={onValueFieldTypeChange} size='sm'>
            {valueFieldType === 'input' ? 'I' : 'T'}
          </Button>
        </ValueFieldTypeTooltip>
        {getInput(valueFieldType)}
      </InputGroup>
    );
  }
  return <>{getInput(meta?.as)}</>;
}
