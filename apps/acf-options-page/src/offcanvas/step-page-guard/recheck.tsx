import { InputBounded } from '@acf-options-page/form/input-bounded';
import { InputInterval } from '@acf-options-page/form/input-interval';
import { EErrorOptions, IAction, IAddon, IUserScript } from '@dhruv-techapps/acf-common';
import { useEffect } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface PreCheckRecheckProps {
  form: UseFormReturn<IAddon>;
  actions: Array<IAction | IUserScript>;
}

export function PreCheckRecheck({ form, actions }: PreCheckRecheckProps) {
  const { t } = useTranslation();
  const { register, watch, setValue } = form;

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
              <InputBounded title={'pageGuard.recheck.recheck'} name='recheck' form={form} />
            </Col>
            <Col md={6} sm={12}>
              <InputInterval title={'pageGuard.recheck.interval'} name='recheckInterval' rangeName='recheckIntervalTo' form={form} />
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
                      {index + 1} . {_action.name ?? t('step.defaultName')}
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
