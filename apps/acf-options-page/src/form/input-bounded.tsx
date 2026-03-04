import { Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface RenderInputProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues>;
  fieldState: ControllerFieldState;
}

interface InputBoundedProps<TFieldValues extends FieldValues> {
  title: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}

export function InputBounded<TFieldValues extends FieldValues>(props: InputBoundedProps<TFieldValues>) {
  const { title, name, form } = props;
  const { control } = form;
  const { t } = useTranslation();

  const transform = (v: unknown) => {
    if (v === 'unlimited') return 'unlimited';
    const n = Number(v);
    return isNaN(n) ? v : n;
  };

  const renderInput = ({ field, fieldState }: RenderInputProps<TFieldValues>) => {
    const isUnlimited = field.value === 'unlimited';
    const onToggleUnlimited = () => {
      field.onChange(isUnlimited ? undefined : 'unlimited');
    };

    return (
      <InputGroup>
        <OverlayTrigger trigger={['hover', 'focus']} placement='top' overlay={<Tooltip id={`${name}-tooltip`}>{t('retry.unlimited-tooltip')}</Tooltip>}>
          <Button variant={isUnlimited ? 'warning' : 'outline-warning'} onClick={onToggleUnlimited}>
            <i className='bi bi-infinity' />
          </Button>
        </OverlayTrigger>
        <Form.Control
          {...field}
          placeholder={'0'}
          type='text'
          inputMode={isUnlimited ? undefined : 'numeric'}
          disabled={isUnlimited}
          isInvalid={!!fieldState.error}
          list={isUnlimited ? undefined : 'bound'}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(transform(e.target.value))}
        />
        {fieldState.error && <Form.Control.Feedback type='invalid'>{fieldState.error.message as string}</Form.Control.Feedback>}
      </InputGroup>
    );
  };

  return (
    <Form.Group className='d-flex w-100 flex-column' controlId={name}>
      <Form.Label>{t(title)}</Form.Label>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (v) => {
            if (v === undefined || v === 'unlimited') return true;
            if (typeof v === 'number' && v >= 0) return true;
            return t('error.positive');
          }
        }}
        render={renderInput}
      />
    </Form.Group>
  );
}
