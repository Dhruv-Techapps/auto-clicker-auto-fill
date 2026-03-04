import React, { useEffect } from 'react';
import { Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface InputIntervalProps<TFieldValues extends FieldValues> {
  title: string;
  name: Path<TFieldValues>;
  rangeName: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}

interface RenderInputProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues>;
  fieldState: ControllerFieldState;
}

export function InputInterval<TFieldValues extends FieldValues>(props: InputIntervalProps<TFieldValues>) {
  const { title, name, rangeName, form } = props;
  const { control, formState, watch, getValues, setValue, trigger } = form;
  const { errors } = formState;
  const { t } = useTranslation();
  const nameValue = watch(name);
  const rangeValue = getValues(rangeName);

  const [rangeMode, setRangeMode] = React.useState(rangeValue !== undefined);

  const onToggleRange = () => {
    setRangeMode((prev) => !prev);
  };

  useEffect(() => {
    if (rangeValue !== undefined) {
      setRangeMode(true);
    }
  }, [rangeValue]);

  useEffect(() => {
    if (!rangeMode) {
      setValue(rangeName, undefined as any, { shouldDirty: true, shouldValidate: true });
    } else if (rangeValue === undefined) {
      setValue(rangeName, nameValue, { shouldDirty: true, shouldValidate: true });
    }
  }, [rangeMode, setValue, rangeName, rangeValue, nameValue]);

  const transform = (v: string) => {
    const n = Number(v);
    return isNaN(n) ? v : n;
  };

  const renderInput = ({ field, fieldState }: RenderInputProps<TFieldValues>) => {
    const { onChange, ...rest } = field;
    return (
      <Form.Control
        placeholder='0'
        type='number'
        step='0.001'
        min={0}
        {...rest}
        inputMode='decimal'
        id={rest.name}
        list='interval'
        onChange={(e) => {
          onChange(transform(e.target.value));
          trigger(field.name === name ? rangeName : name);
        }}
        isInvalid={!!fieldState.error}
      />
    );
  };

  return (
    <Form.Group className='d-flex w-100 flex-column'>
      <Form.Label htmlFor={name}>
        {t(title)}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
      </Form.Label>
      <InputGroup>
        <OverlayTrigger trigger={['hover', 'focus']} placement='top' overlay={<Tooltip id={`${name}-tooltip`}>{t('retry.range-tooltip')}</Tooltip>}>
          <Button variant={rangeMode ? 'warning' : 'outline-warning'} onClick={onToggleRange}>
            <i className='bi bi-arrows-expand-vertical' />
          </Button>
        </OverlayTrigger>
        <Controller
          control={control}
          name={name}
          rules={{
            min: { value: 0, message: t('error.min', { min: 0 }) },
            max: rangeMode && rangeValue !== undefined ? { value: rangeValue, message: t('error.max', { max: rangeValue }) } : undefined,
            required: t('error.required')
          }}
          render={renderInput}
        />
        {rangeMode && (
          <>
            <InputGroup.Text>{t('retry.to')}</InputGroup.Text>
            <Controller
              control={control}
              name={rangeName}
              rules={{
                min: { value: nameValue, message: t('error.min', { min: nameValue }) },
                required: t('error.required')
              }}
              render={renderInput}
            />
          </>
        )}
        <Form.Control.Feedback type='invalid'>{errors[rangeName]?.message as string}</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'>{errors[name]?.message as string}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
