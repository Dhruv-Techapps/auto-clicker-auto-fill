import { getFieldNameValue } from '@acf-options-page/util/element';
import { IAction, IUserScript } from '@dhruv-techapps/acf-common';
import { ThemeContext } from '@dhruv-techapps/ui-context';
import Editor from '@monaco-editor/react';
import { ColumnDef } from '@tanstack/react-table';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
export const defaultColumn: Partial<ColumnDef<IAction | IUserScript>> = {
  cell: Cell
};

interface InputProps {
  rows?: number;
  placeholder?: string;
}

function Cell({ getValue, row: { original }, column: { id, columnDef }, table }: any) {
  const { theme } = useContext(ThemeContext);
  const { meta } = columnDef;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueFieldType, setValueFieldType] = useState<'input' | 'textarea' | 'script'>(original.valueFieldType || 'input');

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

  const getInput = (as: 'input' | 'textarea', rest: InputProps = {}) => (
    <Form.Control
      ref={inputRef}
      aria-label={meta?.ariaLabel}
      type={meta?.type}
      value={value || ''}
      name={id}
      as={as}
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
        <OverlayTrigger overlay={<Tooltip id={id}>{valueFieldType === 'input' ? `Switch to Textarea` : 'Switch to Input'}</Tooltip>}>
          <Button type='button' variant='outline-secondary' id='action-field-type' onClick={onValueFieldTypeChange}>
            {valueFieldType === 'input' ? 'I' : 'T'}
          </Button>
        </OverlayTrigger>
        {getInput(valueFieldType)}
      </InputGroup>
    );
  }
  return <>{getInput(meta?.as)}</>;
}
