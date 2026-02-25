import { EErrorOptions, IAction, IAddon, IUserScript } from '@dhruv-techapps/acf-common';
import { useEffect } from 'react';
import { Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { REGEX } from '../../util';

interface PreCheckRecheckProps {
  register: UseFormRegister<IAddon>;
  watch: UseFormWatch<IAddon>;
  setValue: UseFormSetValue<IAddon>;
  errors?: FieldErrors<IAddon>;
  actions: Array<IAction | IUserScript>;
}

export function PreCheckRecheck({ register, watch, setValue, actions, errors }: PreCheckRecheckProps) {
  const { t } = useTranslation();

  const recheckOption = watch('recheckOption');
  const recheckGoto = watch('recheckGoto');

  useEffect(() => {
    if (recheckOption === EErrorOptions.GOTO && !recheckGoto && actions.length > 0) {
      setValue('recheckGoto', actions[0].id);
    }
  }, [recheckOption, recheckGoto, actions, setValue]);

  return (
    <>
      <Card bg='warning-subtle' text='warning-emphasis' className='mt-3'>
        <Card.Body>
          <Row>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>{t('pageGuard.recheck.recheck')}</InputGroup.Text>
                <FormControl placeholder='0' type='number' list='recheck' {...register('recheck', { pattern: { value: REGEX.NUMBER, message: t('error.number') } })} isInvalid={!!errors?.recheck} />
                <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col md={6} sm={12}>
              <InputGroup>
                <InputGroup.Text>
                  {t('pageGuard.recheck.interval')}&nbsp;<small>({t('common.sec')})</small>
                </InputGroup.Text>
                <FormControl
                  placeholder='0'
                  list='interval'
                  {...register('recheckInterval', { pattern: { value: REGEX.INTERVAL, message: t('error.number') } })}
                  isInvalid={!!errors?.recheckInterval}
                />
                <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card bg='danger-subtle' text='danger-emphasis' className='mt-3'>
        <Card.Body>
          <Row>
            <Col xs={12} className='mb-2'>
              {t('pageGuard.recheck.hint')}
            </Col>
            <Col>
              <Form.Check type='radio' value={EErrorOptions.STOP} label={t('pageGuard.recheck.stop')} {...register('recheckOption')} />
            </Col>
            <Col>
              <Form.Check type='radio' value={EErrorOptions.SKIP} label={t('pageGuard.recheck.skip')} {...register('recheckOption')} />
            </Col>
            <Col>
              <Form.Check type='radio' value={EErrorOptions.RELOAD} label={t('pageGuard.recheck.refresh')} {...register('recheckOption')} />
            </Col>
            <Col>
              <Form.Check type='radio' value={EErrorOptions.GOTO} label={t('pageGuard.recheck.goto')} {...register('recheckOption')} />
            </Col>
            {recheckOption === EErrorOptions.GOTO && (
              <Col xs={{ span: 3, offset: 9 }}>
                <Form.Select {...register('recheckGoto')}>
                  {actions.map((_action, index) => (
                    <option key={_action.id} value={_action.id}>
                      {index + 1} . {_action.name ?? 'Action or Userscript'}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
