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
  dataTestId?: string;
}

export function InputBounded<TFieldValues extends FieldValues>(props: InputBoundedProps<TFieldValues>) {
  const { title, name, form, dataTestId } = props;
  const { control } = form;
  const { t } = useTranslation();

  const transform = (v: unknown) => {
    if (v === 'unlimited') return 'unlimited';
    const n = Number(v);
    return Number.isNaN(n) ? v : n;
  };

  const renderInput = ({ field, fieldState }: RenderInputProps<TFieldValues>) => {
    const isUnlimited = field.value === 'unlimited';
    const onToggleUnlimited = () => {
      field.onChange(isUnlimited ? undefined : 'unlimited');
    };

    return (
      <InputGroup>
        <OverlayTrigger trigger={['hover', 'focus']} placement='top' overlay={<Tooltip id={`${name}-tooltip`}>{t('retry.unlimited-tooltip')}</Tooltip>}>
          <Button variant={isUnlimited ? 'warning' : 'outline-warning'} onClick={onToggleUnlimited} data-testid={dataTestId ? `${dataTestId}-unlimited` : undefined}>
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
          data-testid={dataTestId}
          list={'bound'}
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
            if (typeof v !== 'number') return t('error.integer');
            if (!Number.isFinite(v) || v < 0) return t('error.positive');
            if (!Number.isInteger(v)) return t('error.integer');
            return true;
          }
        }}
        render={renderInput}
      />
    </Form.Group>
  );
}
